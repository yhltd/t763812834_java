package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.entity.Ddmx;
import com.example.demo.service.DdmxService;
import com.example.demo.service.impl.LargeFileUploadService;
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
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.*;


@RestController
@RequestMapping("/ddmx")
public class DdmxController {

    @Autowired
    private DdmxService ddmxService;

    @Autowired
    private LargeFileUploadService largeFileUploadService;

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
            queryWrapper.like("fzr", pageRequest.getFzr());
        }
        if (StringUtils.isNotBlank(pageRequest.getBm())) {
            queryWrapper.like("bm", pageRequest.getBm());
        }
        if (pageRequest.getStartDate() != null || pageRequest.getEndDate() != null) {
            String startDate = convertToSlashFormat(pageRequest.getStartDate());
            String endDate = convertToSlashFormat(pageRequest.getEndDate());

            if (startDate != null && endDate != null) {
                // 使用apply方法处理日期查询
                queryWrapper.apply(
                        "ISDATE(ddrq) = 1 AND " +
                                "CONVERT(DATE, ddrq) " +
                                "BETWEEN CONVERT(DATE, {0}) AND CONVERT(DATE, {1})",
                        startDate, endDate
                );
            }
        }
        // 新增：yingfu日期筛选
        if (StringUtils.isNotBlank(pageRequest.getYingfuStartDate()) ||
                StringUtils.isNotBlank(pageRequest.getYingfuEndDate())) {
            String yingfuStart = convertToSlashFormat(pageRequest.getYingfuStartDate());
            String yingfuEnd = convertToSlashFormat(pageRequest.getYingfuEndDate());

            if (yingfuStart != null && yingfuEnd != null) {
                queryWrapper.apply(
                        "ISDATE(yingfu) = 1 AND " +
                                "CONVERT(DATE, yingfu) " +
                                "BETWEEN CONVERT(DATE, {0}) AND CONVERT(DATE, {1})",
                        yingfuStart, yingfuEnd
                );
            } else if (yingfuStart != null) {
                queryWrapper.apply(
                        "ISDATE(yingfu) = 1 AND " +
                                "CONVERT(DATE, yingfu) >= CONVERT(DATE, {0})",
                        yingfuStart
                );
            } else if (yingfuEnd != null) {
                queryWrapper.apply(
                        "ISDATE(yingfu) = 1 AND " +
                                "CONVERT(DATE, yingfu) <= CONVERT(DATE, {0})",
                        yingfuEnd
                );
            }
        }

        // 新增：未付金额为0的筛选（yfsj - yifu = 0）
        if (Boolean.TRUE.equals(pageRequest.getWeifuZero())) {
            // 使用TRY_CAST处理可能的非数字值
            queryWrapper.apply("yfsj = yifu");
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

        // 在查询结果后，手动进行排序
        if (result != null && result.getRecords() != null &&
                StringUtils.isNotBlank(pageRequest.getSortField())) {

            List<Map<String, Object>> sortedList = manualSort(
                    result.getRecords(),
                    pageRequest.getSortField(),
                    pageRequest.getSortOrder()
            );

            // 更新分页结果
            result.setRecords(sortedList);
        }

        return Result.success(result);
    }

    // 手动排序方法
    private List<Map<String, Object>> manualSort(List<Map<String, Object>> list, String sortField, String sortOrder) {
        if (list == null || list.isEmpty()) {
            return list;
        }

        List<Map<String, Object>> sortedList = new ArrayList<>(list);

        sortedList.sort((map1, map2) -> {
            Object value1 = map1.get(sortField);
            Object value2 = map2.get(sortField);

            // 处理null值
            if (value1 == null && value2 == null) return 0;
            if (value1 == null) return 1;
            if (value2 == null) return -1;

            int result;

            // 根据字段类型进行比较
            if (value1 instanceof Number && value2 instanceof Number) {
                // 数字类型比较
                double num1 = ((Number) value1).doubleValue();
                double num2 = ((Number) value2).doubleValue();
                result = Double.compare(num1, num2);
            } else {
                // 字符串类型比较
                String str1 = value1.toString();
                String str2 = value2.toString();

                // 尝试解析为日期
                try {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    Date date1 = sdf.parse(str1);
                    Date date2 = sdf.parse(str2);
                    result = date1.compareTo(date2);
                } catch (Exception e) {
                    // 不是日期，按字符串比较
                    result = str1.compareTo(str2);
                }
            }

            // 根据排序方向调整
            return "asc".equalsIgnoreCase(sortOrder) ? result : -result;
        });

        return sortedList;
    }


    @PostMapping("/daochuexcel")
    public Result<Page<Map<String, Object>>> daochu(HttpSession session,@RequestBody PageRequest pageRequest) {
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
            queryWrapper.like("fzr", pageRequest.getFzr());
        }
        if (StringUtils.isNotBlank(pageRequest.getBm())) {
            queryWrapper.like("bm", pageRequest.getBm());
        }
        if (pageRequest.getStartDate() != null || pageRequest.getEndDate() != null) {
            String startDate = convertToSlashFormat(pageRequest.getStartDate());
            String endDate = convertToSlashFormat(pageRequest.getEndDate());

            if (startDate != null && endDate != null) {
                // 使用apply方法处理日期查询
                queryWrapper.apply(
                        "ISDATE(ddrq) = 1 AND " +
                                "CONVERT(DATE, ddrq) " +
                                "BETWEEN CONVERT(DATE, {0}) AND CONVERT(DATE, {1})",
                        startDate, endDate
                );
            }
        }

        // 新增：yingfu日期筛选
        if (StringUtils.isNotBlank(pageRequest.getYingfuStartDate()) ||
                StringUtils.isNotBlank(pageRequest.getYingfuEndDate())) {
            String yingfuStart = convertToSlashFormat(pageRequest.getYingfuStartDate());
            String yingfuEnd = convertToSlashFormat(pageRequest.getYingfuEndDate());

            if (yingfuStart != null && yingfuEnd != null) {
                queryWrapper.apply(
                        "ISDATE(yingfu) = 1 AND " +
                                "CONVERT(DATE, yingfu) " +
                                "BETWEEN CONVERT(DATE, {0}) AND CONVERT(DATE, {1})",
                        yingfuStart, yingfuEnd
                );
            } else if (yingfuStart != null) {
                queryWrapper.apply(
                        "ISDATE(yingfu) = 1 AND " +
                                "CONVERT(DATE, yingfu) >= CONVERT(DATE, {0})",
                        yingfuStart
                );
            } else if (yingfuEnd != null) {
                queryWrapper.apply(
                        "ISDATE(yingfu) = 1 AND " +
                                "CONVERT(DATE, yingfu) <= CONVERT(DATE, {0})",
                        yingfuEnd
                );
            }
        }

        // 新增：未付金额为0的筛选（yfsj - yifu = 0）
        if (Boolean.TRUE.equals(pageRequest.getWeifuZero())) {
            queryWrapper.apply("yfsj = yifu");
        }

        Result<?> authResult = AuthUtil2.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            // 从 Session 中获取 D 值（管理员名称）
            String fuzeren = (String) session.getAttribute("D");
            if (fuzeren == null || fuzeren.trim().isEmpty()) {
                return Result.error("为获取身份信息，请重新登录");
            }

            Page<Map<String, Object>> result = ddmxService.daochuexcely(page, queryWrapper,fuzeren);
            return Result.success(result);
        }

        // 执行查询 - 通过Service调用
        Page<Map<String, Object>> result = ddmxService.daochuexcel(page, queryWrapper);

        return Result.success(result);
    }


    private String convertToSlashFormat(String dateStr) {
        if (StringUtils.isBlank(dateStr)) {
            return null;
        }

        // 替换横杠为斜杠
        dateStr = dateStr.replace("-", "/");

        // 处理单数字月份和日期
        String[] parts = dateStr.split("/");
        if (parts.length == 3) {
            // 年份
            String year = parts[0];
            // 月份补零
            String month = parts[1].length() == 1 ? "0" + parts[1] : parts[1];
            // 日期补零
            String day = parts[2].length() == 1 ? "0" + parts[2] : parts[2];

            return year + "/" + month + "/" + day;
        }

        return dateStr;
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
     * 优化上传PDF文件 - 支持分片上传
     */
    @PostMapping("/uploadPdf")
    public ResponseEntity<?> uploadPdf(HttpSession session,
                                       @RequestParam("ddh") String ddh,
                                       @RequestParam("pdfFile") MultipartFile pdfFile,
                                       @RequestParam(value = "chunk", required = false) Integer chunk,
                                       @RequestParam(value = "chunks", required = false) Integer chunks) {

        // 权限检查
        Result<?> authResult = AuthUtil2.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 403);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }

        try {
            // 检查文件大小
            if (pdfFile.getSize() > 50 * 1024 * 1024) { // 50MB限制
                throw new RuntimeException("文件大小不能超过50MB");
            }

            // 分片上传处理
            if (chunks != null && chunks > 1) {
                return handleChunkUpload(ddh, pdfFile, chunk, chunks);
            }

            // 普通上传
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
     * 处理分片上传
     */
    private ResponseEntity<?> handleChunkUpload(String ddh, MultipartFile chunkFile, Integer chunk, Integer chunks) {
        try {
            // 这里实现分片上传逻辑
            // 实际项目中需要保存分片到临时位置，最后合并
            // 简化实现：直接拒绝分片上传，要求完整上传
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 400);
            errorResponse.put("message", "当前版本不支持分片上传，请上传完整文件");

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 500);
            errorResponse.put("message", "分片上传处理失败: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * 优化下载PDF文件 - 支持断点续传
     */
    @PostMapping("/downloadPdf")
    public ResponseEntity<byte[]> downloadPdf(HttpSession session,
                                              @RequestBody Map<String, String> params,
                                              @RequestHeader(value = "Range", required = false) String rangeHeader) {

        try {
            String ddh = params.get("ddh");
            Map<String, Object> result = ddmxService.downloadPdf(ddh);

            byte[] pdfBytes = (byte[]) result.get("content");
            String fileName = (String) result.get("fileName");
            String source = (String) result.get("source");

            System.out.println("文件下载完成，来源: " + source + ", 大小: " + pdfBytes.length);

            // 支持断点续传
            if (rangeHeader != null && rangeHeader.startsWith("bytes=")) {
                return handleRangeDownload(pdfBytes, fileName, rangeHeader);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", fileName);
            headers.setContentLength(pdfBytes.length);
            headers.add("Cache-Control", "private, max-age=3600");
            headers.add("X-File-Source", source);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            System.err.println("文件下载失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 处理断点续传
     */
    private ResponseEntity<byte[]> handleRangeDownload(byte[] fullBytes, String fileName, String rangeHeader) {
        try {
            long fileSize = fullBytes.length;
            String range = rangeHeader.substring(6);
            String[] ranges = range.split("-");

            long start = Long.parseLong(ranges[0]);
            long end = fileSize - 1;
            if (ranges.length > 1) {
                end = Long.parseLong(ranges[1]);
            }

            if (start > end || start < 0 || end >= fileSize) {
                return ResponseEntity.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE).build();
            }

            long contentLength = end - start + 1;
            byte[] partialContent = new byte[(int) contentLength];
            System.arraycopy(fullBytes, (int) start, partialContent, 0, (int) contentLength);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentLength(contentLength);
            headers.add("Content-Range", "bytes " + start + "-" + end + "/" + fileSize);
            headers.add("Accept-Ranges", "bytes");
            headers.add("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
            headers.add("Cache-Control", "private, max-age=3600");

            return new ResponseEntity<>(partialContent, headers, HttpStatus.PARTIAL_CONTENT);

        } catch (Exception e) {
            System.err.println("断点续传处理失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 专门处理大文件上传的接口
     */
    @PostMapping("/uploadLargePdf")
    public ResponseEntity<?> uploadLargePdf(HttpSession session,
                                            @RequestParam("ddh") String ddh,
                                            @RequestParam("pdfFile") MultipartFile pdfFile) {

        // 权限检查
        Result<?> authResult = AuthUtil2.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(createResponse(403, "权限不足"));
        }

        try {
            // 文件大小检查
            if (pdfFile.getSize() > 100 * 1024 * 1024) { // 100MB限制
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createResponse(400, "文件大小不能超过100MB"));
            }

            long startTime = System.currentTimeMillis();

            // 根据文件大小选择不同的处理方式
            Map<String, Object> result;
            if (pdfFile.getSize() > 10 * 1024 * 1024) { // 超过10MB使用大文件处理
                double fileSizeMB = pdfFile.getSize() / (1024.0 * 1024.0);
                result = largeFileUploadService.uploadLargePdf(ddh, pdfFile);
            } else {
                // 小文件使用原处理方式
                result = ddmxService.uploadPdf(ddh, pdfFile);
            }

            long costTime = System.currentTimeMillis() - startTime;

            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "文件上传成功");
            response.put("data", result);
            response.put("totalCostTime", costTime + "ms");

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 500);
            errorResponse.put("message", "文件上传失败: " + e.getMessage());
            errorResponse.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    /**
     * 创建响应Map的辅助方法
     */
    private Map<String, Object> createResponse(int code, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", code);
        response.put("message", message);
        return response;
    }



    /**
     * 优化查看PDF文件（在线预览）- 添加缓存控制
     */
    @RequestMapping(value = "/viewPdf", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<byte[]> viewPdf(HttpSession session,
                                          @RequestParam("ddh") String ddh,
                                          @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {

        try {
            Map<String, Object> result = ddmxService.downloadPdf(ddh);
            byte[] pdfBytes = (byte[]) result.get("content");
            String source = (String) result.get("source");

            // 生成ETag（简单版本）
            String eTag = "\"" + Integer.toHexString(Arrays.hashCode(pdfBytes)) + "\"";

            // 检查缓存
            if (ifNoneMatch != null && ifNoneMatch.equals(eTag)) {
                return ResponseEntity.status(HttpStatus.NOT_MODIFIED).build();
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "document.pdf");
            headers.setContentLength(pdfBytes.length);
            headers.setETag(eTag);
            headers.setCacheControl("public, max-age=3600");
            headers.add("X-File-Source", source);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 删除PDF文件
     */
    @PostMapping("/deletePdf")
    public ResponseEntity<?> deletePdf(HttpSession session,@RequestBody Map<String, String> params) {

        // 权限检查
        Result<?> authResult = AuthUtil2.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 403);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
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
    public ResponseEntity<?> getPdfInfo(HttpSession session,@RequestBody Map<String, String> params) {
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

    /**
     * 快速预览URL（直接返回文件URL，不经过后端处理）
     */
    @GetMapping("/previewUrl/{ddh}")
    public ResponseEntity<?> getPreviewUrl(@PathVariable String ddh) {
        try {
            // 在实际项目中，这里可以返回MinIO/S3的直接访问URL
            // 简化实现：返回后端下载URL

            // 检查订单是否存在PDF文件
            QueryWrapper<Ddmx> queryWrapper = new QueryWrapper<>();
            queryWrapper.select("pdf_file_name")
                    .eq("ddh", ddh)
                    .isNotNull("pdf_base64")
                    .ne("pdf_base64", "")
                    .last("LIMIT 1");

            Ddmx ddmx = ddmxService.getOne(queryWrapper);

            if (ddmx == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("code", 404);
                errorResponse.put("message", "该订单没有PDF文件");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            // 构建预览信息
            Map<String, Object> previewInfo = new HashMap<>();
            previewInfo.put("url", "/ddmx/viewPdf?ddh=" + URLEncoder.encode(ddh, "UTF-8"));
            previewInfo.put("direct", false);
            previewInfo.put("message", "请使用后端预览接口");
            previewInfo.put("fileName", ddmx.getPdfFileName());
            previewInfo.put("hasFile", true);

            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取预览URL成功");
            response.put("data", previewInfo);
            response.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok().body(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 500);
            errorResponse.put("message", "获取预览URL失败: " + e.getMessage());
            errorResponse.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }


//     在DdmxController中添加
    @PostMapping("/updatePdfFileName")
    public Result updatePdfFileName(@RequestBody Map<String, Object> params) {
        String ddh = (String) params.get("ddh");
        String pdfFileName = (String) params.get("pdfFileName");

        // 更新dingdanmingx表的pdf_file_name字段
        boolean success = ddmxService.updatePdfFileNameByDdh(ddh, pdfFileName);

        if (success) {
            return Result.success("PDF文件名更新成功");
        } else {
            return Result.error("PDF文件名更新失败");
        }
    }

    // 添加查询当前文件名的接口
    @PostMapping("/getCurrentPdfFileName")
    public Result<String> getCurrentPdfFileName(@RequestBody Map<String, Object> params) {
        String ddh = (String) params.get("ddh");

        if (ddh == null || ddh.trim().isEmpty()) {
            return Result.error("订单号不能为空");
        }

        try {
            // 查询当前的文件名
            String currentFileName = ddmxService.getCurrentPdfFileName(ddh);
            return Result.success(currentFileName);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("查询文件名失败: " + e.getMessage());
        }
    }




}