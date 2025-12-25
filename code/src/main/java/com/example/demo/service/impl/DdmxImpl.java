package com.example.demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Ddmx;
import com.example.demo.entity.Xdmx;
import com.example.demo.mapper.DdmxMapper;
import com.example.demo.service.DdmxService;
import com.example.demo.service.FileCacheService;
import com.example.demo.service.XdmxService;
import com.example.demo.util.Base64Compressor;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.lang.ref.SoftReference;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;
import java.util.zip.GZIPOutputStream;

@Service
public class DdmxImpl extends ServiceImpl<DdmxMapper, Ddmx> implements DdmxService {

    @Value("${pdf.upload.path:/tmp/uploads/pdf/}")
    private String uploadPath;

    @Value("${pdf.access.base-url:/pdf/}")
    private String accessBaseUrl;

    @Value("${pdf.upload.compress-threshold:102400}")
    private int compressThreshold;

    @Value("${pdf.upload.chunk-size:524288}")
    private int chunkSize;

    @Value("${pdf.upload.compress-enabled:true}")
    private boolean compressEnabled;

    @Autowired
    private DdmxMapper ddmxMapper;

    @Autowired
    private XdmxService xdmxService;

    @Autowired
    private Base64Compressor base64Compressor;

    @Autowired
    private FileCacheService fileCacheService;

    // 线程池用于异步处理
    private final ExecutorService executorService = Executors.newFixedThreadPool(4);

    // 内存缓存（软引用，避免OOM）
    private final Map<String, SoftReference<byte[]>> memoryCache = new ConcurrentHashMap<>();

    // 分片上传状态跟踪
    private final Map<String, List<String>> chunkUploadMap = new ConcurrentHashMap<>();

    @Override
    public Page<Map<String, Object>> daochuexcel(Page<Map<String, Object>> page,
                                                             Wrapper<Map<String, Object>> queryWrapper) {

        // 计算分页参数
        long start = (page.getCurrent() - 1) * page.getSize();
        long end = page.getSize();

        // 查询数据
        List<Map<String, Object>> records = ddmxMapper.daochuexcel(start, end, queryWrapper);

        // 查询总数
        Long total = ddmxMapper.selectDistinctCount(queryWrapper);

        // 为每条记录添加PDF文件访问URL
        records = records.stream().map(record -> {
            if (record.get("pdf_file_path") != null && !record.get("pdf_file_path").toString().isEmpty()) {
                String filePath = record.get("pdf_file_path").toString();
                String fileName = new File(filePath).getName();
                record.put("pdfFile", accessBaseUrl + fileName);
            } else {
                record.put("pdfFile", "");
            }
            return record;
        }).collect(Collectors.toList());

        // 设置分页结果
        page.setRecords(records);
        page.setTotal(total);

        return page;
    }

    @Override
    public Page<Map<String, Object>> daochuexcely(Page<Map<String, Object>> page,
                                                              Wrapper<Map<String, Object>> queryWrapper,String fuzeren) {

        // 计算分页参数
        long start = (page.getCurrent() - 1) * page.getSize();
        long end = page.getSize();

        // 查询数据
        List<Map<String, Object>> records = ddmxMapper.daochuexcely(start, end, queryWrapper,fuzeren);

        // 查询总数
        Long total = ddmxMapper.selectDistinctCountY(queryWrapper,fuzeren);

        // 为每条记录添加PDF文件访问URL
        records = records.stream().map(record -> {
            if (record.get("pdf_file_path") != null && !record.get("pdf_file_path").toString().isEmpty()) {
                String filePath = record.get("pdf_file_path").toString();
                String fileName = new File(filePath).getName();
                record.put("pdfFile", accessBaseUrl + fileName);
            } else {
                record.put("pdfFile", "");
            }
            return record;
        }).collect(Collectors.toList());

        // 设置分页结果
        page.setRecords(records);
        page.setTotal(total);

        return page;
    }



    @Override
    public Page<Map<String, Object>> selectDistinctByDdhPage(Page<Map<String, Object>> page,
                                                             Wrapper<Map<String, Object>> queryWrapper) {

        // 计算分页参数
        long start = (page.getCurrent() - 1) * page.getSize();
        long end = page.getSize();

        // 查询数据
        List<Map<String, Object>> records = ddmxMapper.selectDistinctByDdhForPage(start, end, queryWrapper);

        // 查询总数
        Long total = ddmxMapper.selectDistinctCount(queryWrapper);

        // 为每条记录添加PDF文件访问URL
        records = records.stream().map(record -> {
            if (record.get("pdf_file_path") != null && !record.get("pdf_file_path").toString().isEmpty()) {
                String filePath = record.get("pdf_file_path").toString();
                String fileName = new File(filePath).getName();
                record.put("pdfFile", accessBaseUrl + fileName);
            } else {
                record.put("pdfFile", "");
            }
            return record;
        }).collect(Collectors.toList());

        // 设置分页结果
        page.setRecords(records);
        page.setTotal(total);

        return page;
    }

    @Override
    public Page<Map<String, Object>> selectDistinctByDdhPageY(Page<Map<String, Object>> page,
                                                              Wrapper<Map<String, Object>> queryWrapper,String fuzeren) {

        // 计算分页参数
        long start = (page.getCurrent() - 1) * page.getSize();
        long end = page.getSize();

        // 查询数据
        List<Map<String, Object>> records = ddmxMapper.selectDistinctByDdhForPageY(start, end, queryWrapper,fuzeren);

        // 查询总数
        Long total = ddmxMapper.selectDistinctCountY(queryWrapper,fuzeren);

        // 为每条记录添加PDF文件访问URL
        records = records.stream().map(record -> {
            if (record.get("pdf_file_path") != null && !record.get("pdf_file_path").toString().isEmpty()) {
                String filePath = record.get("pdf_file_path").toString();
                String fileName = new File(filePath).getName();
                record.put("pdfFile", accessBaseUrl + fileName);
            } else {
                record.put("pdfFile", "");
            }
            return record;
        }).collect(Collectors.toList());

        // 设置分页结果
        page.setRecords(records);
        page.setTotal(total);

        return page;
    }

    @Override
    public List<Ddmx> getDetailByDdh(String ddh, String ddrq) {
        return baseMapper.getDetailByDdh(ddh, ddrq);
    }

    @Override
    public int updateByDdh(Map<String, Object> updateParams) {
        String ddh = (String) updateParams.get("ddh");
        if (ddh == null) {
            return 0;
        }

        // 移除ddh，因为它是条件不是更新字段
        updateParams.remove("ddh");

        QueryWrapper<Ddmx> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("ddh", ddh);

        Ddmx updateEntity = new Ddmx();

        // 动态设置更新字段
        if (updateParams.containsKey("tcd")) {
            updateEntity.setTcd((String) updateParams.get("tcd"));
        }
        if (updateParams.containsKey("wldh")) {
            updateEntity.setWldh((String) updateParams.get("wldh"));
        }
        if (updateParams.containsKey("zk")) {
            updateEntity.setZk((String) updateParams.get("zk"));
        }
        if (updateParams.containsKey("yifu")) {
            updateEntity.setYifu((String) updateParams.get("yifu"));
        }
        if (updateParams.containsKey("yfsj")) {
            updateEntity.setYfsj((String) updateParams.get("yfsj"));
        }
        if (updateParams.containsKey("yingfu")) {
            updateEntity.setYingfu((String) updateParams.get("yingfu"));
        }
        if (updateParams.containsKey("sfkp")) {
            updateEntity.setSfkp((String) updateParams.get("sfkp"));
        }
        if (updateParams.containsKey("kpsj")) {
            updateEntity.setKpsj((String) updateParams.get("kpsj"));
        }
        if (updateParams.containsKey("fhsj")) {
            updateEntity.setFhsj((String) updateParams.get("fhsj"));
        }

        return ddmxMapper.update(updateEntity, queryWrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean withdrawOrder(String ddh) {
        try {
            // 1. 根据订单号删除dingdanmingx表中的数据
            QueryWrapper<Ddmx> ddmxWrapper = new QueryWrapper<>();
            ddmxWrapper.eq("ddh", ddh);
            boolean deleteDdmx = remove(ddmxWrapper);

            // 2. 使用Service方法更新生产工单状态
            int updateCount = xdmxService.updateZtByHtbh(ddh);

            // 3. 清理缓存
            fileCacheService.deleteCache(ddh);
            memoryCache.remove(ddh);

            return true;

        } catch (Exception e) {
            throw new RuntimeException("撤回订单失败: " + e.getMessage());
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> uploadPdf(String ddh, MultipartFile file) {
        long startTime = System.currentTimeMillis();

        try {
            System.out.println("开始处理PDF上传优化版，订单号: " + ddh + ", 文件名: " + file.getOriginalFilename());

            // 1. 查询订单信息（一次查询）
            List<Ddmx> ddmxList = getDdmxByDdh(ddh);
            if (ddmxList.isEmpty()) {
                throw new RuntimeException("订单号不存在: " + ddh);
            }

            System.out.println("找到 " + ddmxList.size() + " 条相关记录");

            // 2. 读取文件（优化读取）
            byte[] fileBytes = file.getBytes();
            System.out.println("文件读取完成，大小: " + fileBytes.length + " bytes");

            // 3. 生成Base64（禁用压缩，直接编码）
            String base64Data = Base64.getEncoder().encodeToString(fileBytes);
            System.out.println("Base64编码完成，大小: " + base64Data.length() + " chars");

            // 4. 分批更新数据库（优化批量更新）
            boolean updateSuccess = updateDdmxRecords(ddmxList, file, base64Data);

            if (!updateSuccess) {
                throw new RuntimeException("数据库更新失败");
            }

            // 5. 异步缓存（非阻塞）
            asyncCacheFile(ddh, fileBytes, file.getOriginalFilename(), file.getSize());

            long costTime = System.currentTimeMillis() - startTime;
            System.out.println("PDF上传处理完成，耗时: " + costTime + "ms, 共更新 " + ddmxList.size() + " 条记录");

            return buildUploadResult(ddh, file, fileBytes.length, costTime, ddmxList.size());

        } catch (Exception e) {
            System.err.println("文件上传失败: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("文件上传失败: " + e.getMessage());
        }
    }

    // 新增方法：优化数据库更新（使用MyBatis的批量更新）
    private boolean updateDdmxRecords(List<Ddmx> ddmxList, MultipartFile file, String base64Data) {
        if (ddmxList.isEmpty()) return false;

        // 使用批量更新提高性能
        List<Ddmx> updateList = new ArrayList<>();

        // 第一条记录存储完整PDF数据
        Ddmx firstRecord = ddmxList.get(0);
        updateDdmxWithPdf(firstRecord, file, base64Data, true);
        updateList.add(firstRecord);

        // 其他记录只标记引用（节省数据库空间）
        for (int i = 1; i < ddmxList.size(); i++) {
            Ddmx record = ddmxList.get(i);
            updateDdmxWithReference(record, file, firstRecord.getId());
            updateList.add(record);
        }

        // 批量更新（使用MyBatis Plus的批量更新）- 修正参数类型
        return updateBatchById(updateList, 20); // 每批20条
    }

    // 新增方法：更新记录为包含完整PDF
    private void updateDdmxWithPdf(Ddmx record, MultipartFile file, String base64Data, boolean isFullData) {
        record.setPdfBase64(isFullData ? base64Data : null);
        record.setPdfFileName(file.getOriginalFilename());
        record.setPdfFileSize(file.getSize());
        record.setPdfUploadTime(new Date());

        // 更新备注字段
        String bzPrefix = record.getBz() != null ? record.getBz() + ";" : "";
        record.setBz(bzPrefix + "pdf_upload:" +
                new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()) +
                ";size:" + file.getSize());

        // 添加引用标记
        if (!isFullData) {
            record.setBz(record.getBz() + ";pdf_ref:true");
        }
    }

    // 新增方法：更新记录为引用 - 参数类型改为 Integer
    private void updateDdmxWithReference(Ddmx record, MultipartFile file, Integer refId) {
        record.setPdfBase64(null);  // 不存储Base64，节省空间
        record.setPdfFileName(file.getOriginalFilename() + " [引用]");
        record.setPdfFileSize(file.getSize());
        record.setPdfUploadTime(new Date());

        String bzPrefix = record.getBz() != null ? record.getBz() + ";" : "";
        record.setBz(bzPrefix + "pdf_ref_to:" + refId +
                ";upload_time:" + new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));
    }
    /**
     * 优化读取文件（避免OOM）
     */
    private byte[] readFileOptimized(MultipartFile file) throws IOException {
        long fileSize = file.getSize();

        // 小文件直接读取
        if (fileSize <= 2 * 1024 * 1024) { // 2MB
            return file.getBytes();
        }

        // 大文件分块读取
        try (var inputStream = file.getInputStream()) {
            ByteArrayOutputStream baos = new ByteArrayOutputStream((int) fileSize);
            byte[] buffer = new byte[8192]; // 8KB缓冲区
            int bytesRead;

            while ((bytesRead = inputStream.read(buffer)) != -1) {
                baos.write(buffer, 0, bytesRead);
            }

            return baos.toByteArray();
        }
    }

    /**
     * 分块Base64
     */
    private List<String> splitBase64(String base64, int chunkSize) {
        List<String> chunks = new ArrayList<>();
        int length = base64.length();

        for (int i = 0; i < length; i += chunkSize) {
            int end = Math.min(length, i + chunkSize);
            chunks.add(base64.substring(i, end));
        }

        return chunks;
    }

    /**
     * 批量更新记录（修复空指针问题）
     */
    /**
     * 批量更新记录 - 修改为只在第一条记录存储完整PDF，其他记录只存储引用
     */
    private boolean updateRecordsInBatch(List<Ddmx> ddmxList, MultipartFile file, List<String> base64Chunks) {
        if (ddmxList == null || ddmxList.isEmpty() || base64Chunks == null || base64Chunks.isEmpty()) {
            return false;
        }

        // 1. 合并所有分块
        StringBuilder fullBase64 = new StringBuilder();
        for (String chunk : base64Chunks) {
            if (chunk != null) {
                fullBase64.append(chunk);
            }
        }

        String finalBase64 = fullBase64.toString();
        if (finalBase64.isEmpty()) {
            return false;
        }

        System.out.println("最终Base64长度: " + finalBase64.length());

        // 2. 只更新第一条记录存储完整PDF，其他记录存储引用
        List<Ddmx> recordsToUpdate = new ArrayList<>();

        // 第一条记录存储完整PDF
        if (!ddmxList.isEmpty()) {
            Ddmx firstRecord = ddmxList.get(0);
            if (firstRecord != null) {
                firstRecord.setPdfBase64(finalBase64);
                firstRecord.setPdfFileName(file.getOriginalFilename());
                firstRecord.setPdfFileSize(file.getSize());
                firstRecord.setPdfUploadTime(new Date());
                firstRecord.setBz((firstRecord.getBz() != null ? firstRecord.getBz() + ";" : "") +
                        "has_pdf:true;file_size:" + file.getSize());
                recordsToUpdate.add(firstRecord);
                System.out.println("第一条记录已设置PDF: " + firstRecord.getDdh());
            }
        }

        // 其他记录只标记有PDF，但不存储实际数据
        for (int i = 1; i < ddmxList.size(); i++) {
            Ddmx record = ddmxList.get(i);
            if (record != null) {
                // 只设置文件名和大小，不存储base64数据
                record.setPdfFileName(file.getOriginalFilename() + "(引用)");
                record.setPdfFileSize(file.getSize());
                record.setPdfUploadTime(new Date());
                record.setBz((record.getBz() != null ? record.getBz() + ";" : "") +
                        "has_pdf:reference;ref_record_id:" + ddmxList.get(0).getId());
                recordsToUpdate.add(record);
            }
        }

        // 3. 过滤null
        recordsToUpdate.removeIf(Objects::isNull);

        if (recordsToUpdate.isEmpty()) {
            return false;
        }

        System.out.println("准备更新记录数: " + recordsToUpdate.size());

        try {
            // 4. 分批次更新，避免批量过大
            boolean result = updateBatchById(recordsToUpdate);
            System.out.println("批量更新结果: " + result);
            return result;
        } catch (Exception e) {
            System.err.println("批量更新异常: " + e.getMessage());
            // 如果批量更新失败，尝试单条更新
            return updateOneByOne(recordsToUpdate);
        }
    }

    /**
     * 单条更新作为备选方案
     */
    private boolean updateOneByOne(List<Ddmx> records) {
        if (records == null || records.isEmpty()) {
            return false;
        }

        int successCount = 0;
        for (Ddmx record : records) {
            try {
                if (record != null) {
                    boolean updated = updateById(record);
                    if (updated) {
                        successCount++;
                    }
                }
            } catch (Exception e) {
                System.err.println("单条更新失败: " + e.getMessage());
            }
        }

        System.out.println("单条更新成功: " + successCount + "/" + records.size());
        return successCount > 0;
    }

    /**
     * 优化下载：多级缓存 + 智能解压
     */
    @Override
    public Map<String, Object> downloadPdf(String ddh) {
        long startTime = System.currentTimeMillis();

        try {
            // 1. 检查内存缓存（最快）
            byte[] cachedBytes = getFromMemoryCache(ddh);
            if (cachedBytes != null) {
                System.out.println("内存缓存命中，耗时: " + (System.currentTimeMillis() - startTime) + "ms");
                return buildDownloadResult(cachedBytes, ddh, "memory_cache");
            }

            // 2. 检查并获取存储PDF的记录
            Ddmx pdfRecord = getPdfRecordFromDatabase(ddh);
            if (pdfRecord == null) {
                throw new RuntimeException("该订单没有PDF文件");
            }

            // 3. 如果是引用，找到原始记录
            if (pdfRecord.getPdfBase64() == null && pdfRecord.getBz() != null &&
                    pdfRecord.getBz().contains("pdf_ref_to:")) {
                pdfRecord = getOriginalPdfRecord(pdfRecord);
            }

            // 4. 解码Base64
            byte[] pdfBytes = decodeBase64(pdfRecord.getPdfBase64());

            // 5. 异步更新缓存
            asyncCacheFile(ddh, pdfBytes, pdfRecord.getPdfFileName(), pdfBytes.length);

            long totalTime = System.currentTimeMillis() - startTime;
            System.out.println("数据库查询完成，耗时: " + totalTime + "ms");

            return buildDownloadResult(pdfBytes, ddh, "database");

        } catch (Exception e) {
            System.err.println("文件下载失败: " + e.getMessage());
            throw new RuntimeException("文件下载失败: " + e.getMessage());
        }
    }


    // 新增方法：获取存储PDF的记录
    private Ddmx getPdfRecordFromDatabase(String ddh) {
        // 先查询有完整PDF数据的记录
        QueryWrapper<Ddmx> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("id", "pdf_base64", "pdf_file_name", "pdf_file_size", "bz")
                .eq("ddh", ddh)
                .isNotNull("pdf_base64")
                .ne("pdf_base64", "")
                .last("LIMIT 1");

        Ddmx pdfRecord = getOne(queryWrapper);

        // 如果没有完整PDF，查找引用的记录
        if (pdfRecord == null) {
            queryWrapper = new QueryWrapper<>();
            queryWrapper.select("id", "pdf_file_name", "pdf_file_size", "bz")
                    .eq("ddh", ddh)
                    .like("pdf_file_name", "[引用]")
                    .last("LIMIT 1");
            pdfRecord = getOne(queryWrapper);
        }

        return pdfRecord;
    }

    // 修复 getOriginalPdfRecord 方法中的类型转换问题
    private Ddmx getOriginalPdfRecord(Ddmx refRecord) {
        try {
            // 从备注中提取引用的记录ID
            String bz = refRecord.getBz();
            String refPrefix = "pdf_ref_to:";
            int start = bz.indexOf(refPrefix);
            if (start != -1) {
                start += refPrefix.length();
                int end = bz.indexOf(";", start);
                if (end == -1) end = bz.length();

                // 修复：改为 Integer 类型
                String idStr = bz.substring(start, end).trim();
                try {
                    Integer refId = Integer.parseInt(idStr);

                    // 查询原始记录
                    Ddmx original = getById(refId);
                    if (original != null && original.getPdfBase64() != null) {
                        return original;
                    }
                } catch (NumberFormatException e) {
                    System.err.println("ID格式错误: " + idStr);
                }
            }
        } catch (Exception e) {
            System.err.println("获取原始PDF记录失败: " + e.getMessage());
        }

        return refRecord;
    }

    // 新增方法：简化Base64解码
    private byte[] decodeBase64(String base64Data) {
        if (base64Data == null || base64Data.isEmpty()) {
            throw new RuntimeException("Base64数据为空");
        }

        try {
            // 直接解码，跳过压缩解压步骤
            return Base64.getDecoder().decode(base64Data);
        } catch (Exception e) {
            throw new RuntimeException("Base64解码失败: " + e.getMessage());
        }
    }

    // 新增方法：获取内存缓存
    private byte[] getFromMemoryCache(String ddh) {
        SoftReference<byte[]> softRef = memoryCache.get(ddh);
        if (softRef != null) {
            byte[] cachedBytes = softRef.get();
            if (cachedBytes != null) {
                return cachedBytes;
            }
        }

        // 尝试从Redis获取（如果有）
        if (fileCacheService != null) {
            return fileCacheService.getCachedPdfBytes(ddh);
        }

        return null;
    }

    /**
     * 从数据库获取PDF（支持分块合并）
     */
    private byte[] getPdfFromDatabaseOptimized(String ddh) {
        // 查询所有相关记录（包括分块）
        QueryWrapper<Ddmx> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("pdf_base64", "pdf_file_name", "bz")
                .eq("ddh", ddh)
                .isNotNull("pdf_base64")
                .ne("pdf_base64", "")
                .orderByAsc("id");

        List<Ddmx> ddmxList = list(queryWrapper);

        if (ddmxList == null || ddmxList.isEmpty()) {
            return null;
        }

        // 检查是否分块存储
        boolean isChunked = ddmxList.size() > 1 ||
                (ddmxList.get(0).getBz() != null && ddmxList.get(0).getBz().contains("chunk:"));

        if (!isChunked) {
            // 单块存储，直接处理
            Ddmx ddmx = ddmxList.get(0);
            String base64Data = ddmx.getPdfBase64();
            return decodeBase64Optimized(base64Data);
        }

        // 分块存储，需要合并
        System.out.println("检测到分块存储，共 " + ddmxList.size() + " 块");

        // 合并所有分块
        StringBuilder fullBase64 = new StringBuilder();
        String fileName = null;

        for (Ddmx ddmx : ddmxList) {
            fullBase64.append(ddmx.getPdfBase64());
            if (fileName == null && ddmx.getPdfFileName() != null) {
                fileName = ddmx.getPdfFileName();
                if (fileName.endsWith(".part0")) {
                    fileName = fileName.substring(0, fileName.length() - 6);
                }
            }
        }

        return decodeBase64Optimized(fullBase64.toString());
    }

    /**
     * 优化Base64解码（支持压缩）
     */
    private byte[] decodeBase64Optimized(String base64Data) {
        try {
            // 检查是否需要解压
            String decompressedBase64 = base64Compressor.decompressBase64(base64Data);
            return Base64.getDecoder().decode(decompressedBase64);
        } catch (Exception e) {
            // 解压失败，尝试直接解码
            try {
                return Base64.getDecoder().decode(base64Data);
            } catch (Exception e2) {
                throw new RuntimeException("Base64解码失败", e2);
            }
        }
    }

    /**
     * 构建结果对象
     */
    private Map<String, Object> buildResultFromBytes(byte[] pdfBytes, String ddh, String source) {
        // 获取文件名
        String fileName = "document.pdf";
        String[] meta = fileCacheService.getCachedFileMeta(ddh);
        if (meta != null && meta.length >= 1) {
            fileName = meta[0];
        }

        Map<String, Object> result = new HashMap<>();
        result.put("fileName", fileName);
        result.put("fileSize", pdfBytes.length);
        result.put("content", pdfBytes);
        result.put("contentType", "application/pdf");
        result.put("source", source);

        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deletePdf(String ddh) {
        try {
            UpdateWrapper<Ddmx> updateWrapper = new UpdateWrapper<>();
            updateWrapper.eq("ddh", ddh)
                    .set("pdf_base64", null)
                    .set("pdf_file_name", null)
                    .set("pdf_file_size", null)
                    .setSql("pdf_upload_time = null");

            boolean success = update(updateWrapper);

            // 清理缓存
            if (success) {
                fileCacheService.deleteCache(ddh);
                memoryCache.remove(ddh);
            }

            return success;

        } catch (Exception e) {
            throw new RuntimeException("文件删除失败: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> getPdfInfo(String ddh) {
        try {
            QueryWrapper<Ddmx> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("ddh", ddh);
            Ddmx ddmx = getOne(queryWrapper);

            if (ddmx == null) {
                throw new RuntimeException("订单号不存在: " + ddh);
            }

            Map<String, Object> result = new HashMap<>();
            result.put("hasPdf", ddmx.getPdfBase64() != null && !ddmx.getPdfBase64().isEmpty());
            result.put("fileName", ddmx.getPdfFileName());
            result.put("fileSize", ddmx.getPdfFileSize());
            result.put("uploadTime", ddmx.getPdfUploadTime());
            result.put("cached", fileCacheService.hasCache(ddh));

            return result;

        } catch (Exception e) {
            throw new RuntimeException("获取PDF信息失败: " + e.getMessage());
        }
    }

    // 在 DdmxImpl.java 中添加以下缺失的方法

    // 新增方法：根据订单号查询订单信息
    private List<Ddmx> getDdmxByDdh(String ddh) {
        QueryWrapper<Ddmx> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("id", "ddh", "ddrq", "bz", "pdf_base64", "pdf_file_name")
                .eq("ddh", ddh)
                .orderByAsc("id");
        return list(queryWrapper);
    }

    // 新增方法：异步缓存文件
    private void asyncCacheFile(String ddh, byte[] fileBytes, String fileName, long fileSize) {
        CompletableFuture.runAsync(() -> {
            try {
                // 内存缓存（软引用）
                memoryCache.put(ddh, new SoftReference<>(fileBytes));

                // Redis缓存（如果可用）
                if (fileCacheService != null) {
                    fileCacheService.cachePdfBytes(ddh, fileBytes);
                    fileCacheService.cacheFileMeta(ddh, fileName, fileSize);
                }

                System.out.println("文件缓存完成: " + ddh);
            } catch (Exception e) {
                System.err.println("文件缓存失败（不影响主流程）: " + e.getMessage());
            }
        }, executorService).exceptionally(e -> {
            System.err.println("异步缓存异常: " + e.getMessage());
            return null;
        });
    }

    // 新增方法：构建上传结果
    private Map<String, Object> buildUploadResult(String ddh, MultipartFile file, long fileSize,
                                                  long costTime, int updatedRecords) {
        Map<String, Object> result = new HashMap<>();
        result.put("fileName", file.getOriginalFilename());
        result.put("fileSize", fileSize);
        result.put("uploadTime", new Date());
        result.put("ddh", ddh);
        result.put("updatedRecords", updatedRecords);
        result.put("costTime", costTime + "ms");
        result.put("status", "success");
        result.put("message", "文件上传成功");
        return result;
    }

    // 新增方法：构建下载结果
    private Map<String, Object> buildDownloadResult(byte[] pdfBytes, String ddh, String source) {
        // 获取文件名
        String fileName = getFileNameFromCache(ddh);

        Map<String, Object> result = new HashMap<>();
        result.put("fileName", fileName);
        result.put("fileSize", pdfBytes.length);
        result.put("content", pdfBytes);
        result.put("contentType", "application/pdf");
        result.put("source", source);
        result.put("downloadUrl", "/ddmx/downloadPdf?ddh=" + ddh);

        return result;
    }

    // 新增方法：从缓存获取文件名
    private String getFileNameFromCache(String ddh) {
        String fileName = "document.pdf";

        // 从Redis缓存获取
        if (fileCacheService != null) {
            String[] meta = fileCacheService.getCachedFileMeta(ddh);
            if (meta != null && meta.length >= 1) {
                fileName = meta[0];
            }
        }

        // 如果Redis没有，从数据库获取
        if (fileName.equals("document.pdf")) {
            QueryWrapper<Ddmx> queryWrapper = new QueryWrapper<>();
            queryWrapper.select("pdf_file_name")
                    .eq("ddh", ddh)
                    .last("LIMIT 1");
            Ddmx ddmx = getOne(queryWrapper);
            if (ddmx != null && ddmx.getPdfFileName() != null) {
                fileName = ddmx.getPdfFileName();
            }
        }

        return fileName;
    }



    // 新增方法：辅助方法 - 格式化文件大小
    private String formatSize(long bytes) {
        if (bytes < 1024) return bytes + "B";
        if (bytes < 1024 * 1024) return String.format("%.1fKB", bytes / 1024.0);
        if (bytes < 1024 * 1024 * 1024) return String.format("%.1fMB", bytes / (1024.0 * 1024.0));
        return String.format("%.1fGB", bytes / (1024.0 * 1024.0 * 1024.0));
    }


    @Override
    public boolean updatePdfFileNameByDdh(String ddh, String pdfFileName) {
        return baseMapper.updatePdfFileNameByDdh(ddh,pdfFileName);
    }

    // 添加查询当前文件名的方法
    @Override
    public String getCurrentPdfFileName(String ddh) {
        return baseMapper.getpdffilename(ddh);
    }



}