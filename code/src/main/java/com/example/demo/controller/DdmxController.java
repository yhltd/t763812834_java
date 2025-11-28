package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.entity.Ddmx;
import com.example.demo.service.DdmxService;
import com.example.demo.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/ddmx")
public class DdmxController {

    @Autowired
    private DdmxService ddmxService;

    @Value("${pdf.upload.path:/tmp/uploads/pdf/}")
    private String uploadPath;

    /**
     * 分页查询去重订单数据
     */
    @PostMapping("/distinctPage")
    public Result<Page<Map<String, Object>>> distinctPage(HttpSession session,@RequestBody PageRequest pageRequest) {


        // 创建分页对象
        Page<Map<String, Object>> page = new Page<>(pageRequest.getPageNum(), pageRequest.getPageSize());

        // 构建查询条件
        QueryWrapper<Map<String, Object>> queryWrapper = new QueryWrapper<>();

        // 添加查询条件
        if (StringUtils.isNotBlank(pageRequest.getDdh())) {
            queryWrapper.like("ddh", pageRequest.getDdh());
        }
        if (StringUtils.isNotBlank(pageRequest.getKhmc())) {
            queryWrapper.like("khmc", pageRequest.getKhmc());
        }
        if (StringUtils.isNotBlank(pageRequest.getFzr())) {
            queryWrapper.eq("fzr", pageRequest.getFzr());
        }
        if (StringUtils.isNotBlank(pageRequest.getBm())) {
            queryWrapper.eq("bm", pageRequest.getBm());
        }
        if (pageRequest.getStartDate() != null && pageRequest.getEndDate() != null) {
            queryWrapper.between("ddrq", pageRequest.getStartDate(), pageRequest.getEndDate());
        }

        Result<?> authResult = AuthUtil2.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            // 从 Session 中获取 D 值（管理员名称）
            String fuzeren = (String) session.getAttribute("D");
            if (fuzeren == null || fuzeren.trim().isEmpty()) {
                return Result.error("为获取身份信息，请重新登录");
            }

            Page<Map<String, Object>> result = ddmxService.selectDistinctByDdhPageY(page, queryWrapper,fuzeren);
            return Result.success(result);
        }

        // 执行查询 - 通过Service调用
        Page<Map<String, Object>> result = ddmxService.selectDistinctByDdhPage(page, queryWrapper);

        return Result.success(result);
    }

    /**
     * 根据订单号获取详细信息
     */
    @PostMapping("/getDetailByDdhAndDdrq")
    public Result getDetailByDdhAndDdrq(@RequestBody Map<String, Object> params) {
        try {
            String ddh = (String) params.get("ddh");
            String ddrq = (String) params.get("ddrq");
            if (ddh == null || ddrq == null) {
                return Result.error("订单号和订单日期不能为空");
            }

            List<Ddmx> detailList = ddmxService.getDetailByDdh(ddh, ddrq);
            return Result.success(detailList);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("获取详情失败: " + e.getMessage());
        }
    }

    /**
     * 根据订单号更新字段
     */
    @PostMapping("/updateByDdh")
    public Result updateByDdh(HttpSession session,@RequestBody Map<String, Object> updateParams) {
        Result<?> authResult = AuthUtil.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            String ddh = (String) updateParams.get("ddh");
            String fieldName = (String) updateParams.get("fieldName");
            Object fieldValue = updateParams.get("fieldValue");

            if (ddh == null || fieldName == null) {
                return Result.error("订单号和字段名不能为空");
            }

            // 特殊处理开票状态和开票时间
            if ("sfkp".equals(fieldName) && "已开票".equals(fieldValue)) {
                // 同时更新开票时间
                Map<String, Object> multiUpdateParams = new HashMap<>();
                multiUpdateParams.put("ddh", ddh);
                multiUpdateParams.put("sfkp", "已开票");
                // 格式化当前时间
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                multiUpdateParams.put("kpsj", sdf.format(new Date()));
                int result = ddmxService.updateByDdh(multiUpdateParams);
                return Result.success(result);
            } else {
                Map<String, Object> updateMap = new HashMap<>();
                updateMap.put("ddh", ddh);
                updateMap.put(fieldName, fieldValue);

                int result = ddmxService.updateByDdh(updateMap);
                return Result.success(result);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("更新失败: " + e.getMessage());
        }
    }

    /**
     * 批量更新多个字段
     */
    @PostMapping("/updateMultipleByDdh")
    public Result updateMultipleByDdh(HttpSession session,@RequestBody Map<String, Object> updateParams) {

        Result<?> authResult = AuthUtil.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }
        try {
            String ddh = (String) updateParams.get("ddh");
            if (ddh == null) {
                return Result.error("订单号不能为空");
            }

            // 处理日期字段转换
            if (updateParams.containsKey("kpsj") && updateParams.get("kpsj") instanceof Date) {
                Date kpsjDate = (Date) updateParams.get("kpsj");
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                updateParams.put("kpsj", sdf.format(kpsjDate));
            }

            int result = ddmxService.updateByDdh(updateParams);
            return Result.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("批量更新失败: " + e.getMessage());
        }
    }


    @PostMapping("/withdrawOrder")
    public Result withdrawOrder(HttpSession session,@RequestBody Map<String, String> params) {

        Result<?> authResult = AuthUtil.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            String ddh = params.get("ddh");
            if (ddh == null || ddh.trim().isEmpty()) {
                return Result.error("订单号不能为空");
            }

            // 调用Service执行撤回操作
            boolean result = ddmxService.withdrawOrder(ddh);

            if (result) {
                return Result.success("订单撤回成功");
            } else {
                return Result.error("订单撤回失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("撤回订单失败: " + e.getMessage());
        }
    }

    /**
     * 上传PDF文件
     */
    @PostMapping("/uploadPdf")
    public ResponseEntity<?> uploadPdf(
            @RequestParam("ddh") String ddh,
            @RequestParam("pdfFile") MultipartFile pdfFile) {

        try {
            Map<String, Object> result = ddmxService.uploadPdf(ddh, pdfFile);

            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "文件上传成功");
            response.put("data", result);

            return ResponseEntity.ok().body(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 500);
            errorResponse.put("message", "文件上传失败: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * 下载PDF文件
     */
    @PostMapping("/downloadPdf")
    public ResponseEntity<byte[]> downloadPdf(@RequestBody Map<String, String> params) {
        try {
            String ddh = params.get("ddh");
            Map<String, Object> result = ddmxService.downloadPdf(ddh);

            byte[] pdfBytes = (byte[]) result.get("content");
            String fileName = (String) result.get("fileName");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", fileName);
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 查看PDF文件（在线预览）
     */
    @RequestMapping(value = "/viewPdf", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<byte[]> viewPdf(@RequestParam("ddh") String ddh) {
        try {
            Map<String, Object> result = ddmxService.downloadPdf(ddh);
            byte[] pdfBytes = (byte[]) result.get("content");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "document.pdf");
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 删除PDF文件
     */
    @PostMapping("/deletePdf")
    public ResponseEntity<?> deletePdf(@RequestBody Map<String, String> params) {
        try {
            String ddh = params.get("ddh");
            boolean success = ddmxService.deletePdf(ddh);

            Map<String, Object> response = new HashMap<>();
            if (success) {
                response.put("code", 200);
                response.put("message", "文件删除成功");
                return ResponseEntity.ok().body(response);
            } else {
                response.put("code", 500);
                response.put("message", "文件删除失败");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 500);
            errorResponse.put("message", "文件删除失败: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * 获取PDF文件信息
     */
    @PostMapping("/getPdfInfo")
    public ResponseEntity<?> getPdfInfo(@RequestBody Map<String, String> params) {
        try {
            String ddh = params.get("ddh");
            Map<String, Object> result = ddmxService.getPdfInfo(ddh);

            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("data", result);

            return ResponseEntity.ok().body(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 500);
            errorResponse.put("message", "获取文件信息失败: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}