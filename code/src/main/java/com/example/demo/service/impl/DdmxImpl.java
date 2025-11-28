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
import com.example.demo.service.XdmxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DdmxImpl extends ServiceImpl<DdmxMapper, Ddmx> implements DdmxService {

    @Value("${pdf.upload.path:/tmp/uploads/pdf/}")
    private String uploadPath;

    @Value("${pdf.access.base-url:/pdf/}")
    private String accessBaseUrl;

    @Autowired
    private DdmxMapper ddmxMapper;

    @Autowired
    private XdmxService xdmxService;


    @Override
    public Page<Map<String, Object>> selectDistinctByDdhPage(Page<Map<String, Object>> page,
                                                             Wrapper<Map<String, Object>> queryWrapper) {

        // 计算分页参数
        long start = (page.getCurrent() - 1) * page.getSize();
        long end = page.getSize(); // 修正：这里应该是page size

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
        long end = page.getSize(); // 修正：这里应该是page size

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

            return true;

        } catch (Exception e) {
            throw new RuntimeException("撤回订单失败: " + e.getMessage());
        }
    }


    @Override
    public Map<String, Object> uploadPdf(String ddh, MultipartFile file) {
        try {
            // 验证参数
            if (ddh == null || ddh.trim().isEmpty()) {
                throw new RuntimeException("订单号不能为空");
            }
            if (file == null || file.isEmpty()) {
                throw new RuntimeException("文件不能为空");
            }

            System.out.println("开始处理PDF上传，订单号: " + ddh + ", 文件名: " + file.getOriginalFilename());

            // 检查订单号是否存在 - 查询所有相关记录
            QueryWrapper<Ddmx> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("ddh", ddh);
            List<Ddmx> ddmxList = list(queryWrapper);

            if (ddmxList == null || ddmxList.isEmpty()) {
                throw new RuntimeException("订单号不存在: " + ddh);
            }

            System.out.println("找到 " + ddmxList.size() + " 条相关记录");

            // 将文件转换为Base64
            String base64Data;
            try {
                byte[] fileBytes = file.getBytes();
                base64Data = Base64.getEncoder().encodeToString(fileBytes);
                System.out.println("文件Base64编码完成，长度: " + base64Data.length());
            } catch (IOException e) {
                throw new RuntimeException("文件读取失败: " + e.getMessage());
            }

            // 批量更新所有相关记录
            boolean allUpdated = true;
            for (Ddmx ddmx : ddmxList) {
                ddmx.setPdfFileName(file.getOriginalFilename());
                ddmx.setPdfBase64(base64Data);
                ddmx.setPdfFileSize(file.getSize());
                ddmx.setPdfUploadTime(new Date());

                boolean updated = updateById(ddmx);
                if (!updated) {
                    allUpdated = false;
                    System.err.println("更新记录失败，ID: " + ddmx.getId());
                } else {
                    System.out.println("成功更新记录，ID: " + ddmx.getId());
                }
            }

            if (!allUpdated) {
                throw new RuntimeException("部分记录更新失败");
            }

            System.out.println("PDF上传处理完成，共更新 " + ddmxList.size() + " 条记录");

            Map<String, Object> result = new HashMap<>();
            result.put("fileName", file.getOriginalFilename());
            result.put("fileSize", file.getSize());
            result.put("uploadTime", new Date());
            result.put("ddh", ddh);
            result.put("base64Size", base64Data.length());
            result.put("updatedRecords", ddmxList.size());

            return result;

        } catch (Exception e) {
            System.err.println("文件上传失败: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("文件上传失败: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> downloadPdf(String ddh) {
        try {
            System.out.println("下载PDF请求，订单号: " + ddh);

            QueryWrapper<Ddmx> queryWrapper = new QueryWrapper<>();
            queryWrapper.select("TOP 1 *")  // 将 TOP 1 放在 SELECT 子句中
                    .eq("ddh", ddh)
                    .isNotNull("pdf_base64")
                    .ne("pdf_base64", "")
                    .orderByDesc("id");

            Ddmx ddmx = getOne(queryWrapper);

            if (ddmx == null) {
                throw new RuntimeException("订单号不存在或没有PDF文件: " + ddh);
            }

            if (ddmx.getPdfBase64() == null || ddmx.getPdfBase64().isEmpty()) {
                throw new RuntimeException("该订单没有PDF文件");
            }

            // 将Base64解码为字节数组
            byte[] pdfBytes = Base64.getDecoder().decode(ddmx.getPdfBase64());
            System.out.println("PDF文件解码成功，大小: " + pdfBytes.length + " bytes");

            Map<String, Object> result = new HashMap<>();
            result.put("fileName", ddmx.getPdfFileName());
            result.put("fileSize", ddmx.getPdfFileSize());
            result.put("content", pdfBytes);
            result.put("contentType", "application/pdf");

            return result;

        } catch (Exception e) {
            System.err.println("文件下载失败: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("文件下载失败: " + e.getMessage());
        }
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
                    .setSql("pdf_upload_time = null");  // 使用setSql明确设置null

            return update(updateWrapper);

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

            // 如果需要返回Base64数据给前端，可以在这里添加
            // result.put("base64Data", ddmx.getPdfBase64());

            return result;

        } catch (Exception e) {
            throw new RuntimeException("获取PDF信息失败: " + e.getMessage());
        }
    }


}