
package com.example.demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Ddmx;
import com.example.demo.mapper.DdmxMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.zip.GZIPOutputStream;

@Slf4j
@Service
public class LargeFileUploadService extends ServiceImpl<DdmxMapper, Ddmx> {

    private static final int BUFFER_SIZE = 8192; // 8KB缓冲区
    private static final int MAX_MEMORY_CHUNK = 5 * 1024 * 1024; // 5MB内存分块

    private final ExecutorService executorService = Executors.newFixedThreadPool(2);

    @Autowired
    private DdmxMapper ddmxMapper;

    /**
     * 优化的超大文件上传方法
     */
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> uploadLargePdf(String ddh, MultipartFile file) throws IOException {
        long startTime = System.currentTimeMillis();

        try {
            log.info("开始上传大文件，订单号: {}, 文件名: {}, 大小: {}MB",
                    ddh, file.getOriginalFilename(),
                    String.format("%.2f", file.getSize() / (1024.0 * 1024.0)));

            // 1. 只查询需要的字段
            List<Integer> recordIds = getRecordIdsByDdh(ddh);
            if (recordIds.isEmpty()) {
                throw new RuntimeException("订单号不存在: " + ddh);
            }
            log.info("找到 {} 条相关记录", recordIds.size());

            // 2. 处理大文件 - 使用流式处理
            LargeFileResult fileResult = processLargeFile(ddh, file);

            // 3. 异步更新数据库（不阻塞）
            CompletableFuture<Boolean> updateFuture = updateRecordsAsync(recordIds, file, fileResult);

            // 4. 等待更新完成（带超时）
            boolean updateSuccess = updateFuture.get(30, java.util.concurrent.TimeUnit.SECONDS);

            if (!updateSuccess) {
                throw new RuntimeException("数据库更新失败");
            }

            long costTime = System.currentTimeMillis() - startTime;
            log.info("大文件上传完成，耗时: {}ms", costTime);

            return buildSuccessResult(ddh, file, fileResult, costTime);

        } catch (Exception e) {
            log.error("大文件上传失败", e);
            throw new RuntimeException("文件上传失败: " + e.getMessage());
        }
    }

    /**
     * 流式处理大文件（避免内存溢出）
     */
    private LargeFileResult processLargeFile(String ddh, MultipartFile file) throws IOException {
        long fileSize = file.getSize();

        // 对于小文件（<5MB），直接内存处理
        if (fileSize <= MAX_MEMORY_CHUNK) {
            return processInMemory(file);
        }

        // 大文件使用临时文件处理
        return processUsingTempFile(file, ddh);
    }

    /**
     * 内存处理小文件
     */
    private LargeFileResult processInMemory(MultipartFile file) throws IOException {
        byte[] fileBytes = file.getBytes();

        // 快速Base64编码
        String base64Data = Base64.getEncoder().encodeToString(fileBytes);

        LargeFileResult result = new LargeFileResult();
        result.base64Data = base64Data;
        result.fileBytes = fileBytes;
        result.fileSize = fileBytes.length;
        result.inMemory = true;

        return result;
    }

    /**
     * 使用临时文件处理大文件
     */
    private LargeFileResult processUsingTempFile(MultipartFile file, String ddh) throws IOException {
        // 创建临时文件
        Path tempFile = Files.createTempFile("pdf_upload_" + ddh + "_", ".tmp");

        try {
            // 1. 保存到临时文件
            file.transferTo(tempFile.toFile());
            long fileSize = Files.size(tempFile);

            // 2. 分块读取和编码
            String base64Data = encodeFileToBase64Chunked(tempFile);

            // 3. 清理临时文件
            Files.delete(tempFile);

            LargeFileResult result = new LargeFileResult();
            result.base64Data = base64Data;
            result.fileSize = fileSize;
            result.inMemory = false;
            result.tempFilePath = tempFile.toString();

            return result;

        } finally {
            // 确保临时文件被删除
            if (Files.exists(tempFile)) {
                try {
                    Files.delete(tempFile);
                } catch (Exception e) {
                    log.warn("删除临时文件失败: {}", tempFile, e);
                }
            }
        }
    }

    /**
     * 分块编码文件为Base64
     */
    private String encodeFileToBase64Chunked(Path filePath) throws IOException {
        long fileSize = Files.size(filePath);

        // 计算分块数量
        int chunkCount = (int) Math.ceil((double) fileSize / MAX_MEMORY_CHUNK);
        log.info("文件大小: {}MB，分块数量: {}",
                String.format("%.2f", fileSize / (1024.0 * 1024.0)), chunkCount);

        StringBuilder base64Builder = new StringBuilder((int) (fileSize * 1.4)); // 预分配空间

        try (FileChannel fileChannel = FileChannel.open(filePath, StandardOpenOption.READ)) {
            ByteBuffer buffer = ByteBuffer.allocateDirect(MAX_MEMORY_CHUNK);
            byte[] chunkBytes;

            int chunkIndex = 0;
            while (fileChannel.read(buffer) > 0) {
                buffer.flip();
                chunkBytes = new byte[buffer.remaining()];
                buffer.get(chunkBytes);

                // 编码当前分块
                String chunkBase64 = Base64.getEncoder().encodeToString(chunkBytes);
                base64Builder.append(chunkBase64);

                buffer.clear();
                chunkIndex++;

                // 每处理10个分块记录一次进度
                if (chunkIndex % 10 == 0) {
                    log.info("文件编码进度: {}/{} 分块", chunkIndex, chunkCount);
                }
            }
        }

        return base64Builder.toString();
    }

    /**
     * 异步更新数据库记录
     */
    private CompletableFuture<Boolean> updateRecordsAsync(List<Integer> recordIds,
                                                          MultipartFile file,
                                                          LargeFileResult fileResult) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                if (recordIds.isEmpty()) {
                    return false;
                }

                List<Ddmx> updateList = new ArrayList<>();

                // 第一个记录存储完整数据
                Integer firstRecordId = recordIds.get(0);
                Ddmx firstRecord = getById(firstRecordId);
                if (firstRecord != null) {
                    updateFirstRecord(firstRecord, file, fileResult.base64Data);
                    updateList.add(firstRecord);
                }

                // 其他记录只存储引用（节省数据库空间）
                for (int i = 1; i < recordIds.size(); i++) {
                    Integer recordId = recordIds.get(i);
                    Ddmx record = getById(recordId);
                    if (record != null) {
                        updateReferenceRecord(record, file, firstRecordId);
                        updateList.add(record);
                    }
                }

                // 批量更新
                return updateBatchById(updateList, 50); // 每次更新50条

            } catch (Exception e) {
                log.error("异步更新数据库失败", e);
                return false;
            }
        }, executorService);
    }

    /**
     * 更新第一个记录（存储完整数据）
     */
    private void updateFirstRecord(Ddmx record, MultipartFile file, String base64Data) {
        record.setPdfBase64(base64Data);
        record.setPdfFileName(file.getOriginalFilename());
        record.setPdfFileSize(file.getSize());
        record.setPdfUploadTime(new Date());

        String bzPrefix = record.getBz() != null ? record.getBz() + ";" : "";
        record.setBz(bzPrefix + "pdf_full_data;upload_time:" +
                new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));
    }

    /**
     * 更新引用记录
     */
    private void updateReferenceRecord(Ddmx record, MultipartFile file, Integer refId) {
        // 不存储base64数据，节省空间
        record.setPdfBase64(null);
        record.setPdfFileName(file.getOriginalFilename() + " [引用]");
        record.setPdfFileSize(file.getSize());
        record.setPdfUploadTime(new Date());

        String bzPrefix = record.getBz() != null ? record.getBz() + ";" : "";
        record.setBz(bzPrefix + "pdf_ref_to:" + refId + ";ref_time:" +
                new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));
    }

    /**
     * 只查询记录ID，不查询所有字段
     */
    private List<Integer> getRecordIdsByDdh(String ddh) {
        QueryWrapper<Ddmx> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("id")
                .eq("ddh", ddh)
                .orderByAsc("id");
        List<Ddmx> records = list(queryWrapper);

        List<Integer> ids = new ArrayList<>();
        for (Ddmx record : records) {
            ids.add(record.getId());
        }

        return ids;
    }

    /**
     * 构建成功结果
     */
    private Map<String, Object> buildSuccessResult(String ddh, MultipartFile file,
                                                   LargeFileResult fileResult, long costTime) {
        Map<String, Object> result = new HashMap<>();
        result.put("fileName", file.getOriginalFilename());
        result.put("fileSize", file.getSize());
        result.put("base64Size", fileResult.base64Data.length());
        result.put("costTime", costTime + "ms");
        result.put("ddh", ddh);
        result.put("processedInMemory", fileResult.inMemory);
        result.put("status", "success");
        result.put("message", "文件上传成功");
        result.put("timestamp", new Date());
        return result;
    }

    /**
     * 内部类：存储文件处理结果
     */
    private static class LargeFileResult {
        String base64Data;
        byte[] fileBytes;
        long fileSize;
        boolean inMemory;
        String tempFilePath;
    }
}