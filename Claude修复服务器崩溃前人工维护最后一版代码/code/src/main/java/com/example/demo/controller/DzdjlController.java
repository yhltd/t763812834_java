package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.entity.Ddmx;
import com.example.demo.service.DzdService;
import com.example.demo.service.DzdjlService;
import com.example.demo.util.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dzdjl")
@Slf4j
public class DzdjlController {
    @Autowired
    private DzdjlService dzdService;

    /**
     * 分页查询去重订单数据
     */
    @PostMapping("/distinctPage")
    public Result<Page<Map<String, Object>>> distinctPage(HttpSession session, @RequestBody PageRequest pageRequest) {

        if (pageRequest != null) {
            // 转换空字符串为null
            if (pageRequest.getStartDate() != null && pageRequest.getStartDate().trim().isEmpty()) {
                pageRequest.setStartDate(null);
            }
            if (pageRequest.getEndDate() != null && pageRequest.getEndDate().trim().isEmpty()) {
                pageRequest.setEndDate(null);
            }

//            if (StringUtils.isNotBlank(pageRequest.getStartDate())) {
//                pageRequest.setStartDate(formatAndNormalizeDate(pageRequest.getStartDate()));
//            }
//            if (StringUtils.isNotBlank(pageRequest.getEndDate())) {
//                pageRequest.setEndDate(formatAndNormalizeDate(pageRequest.getEndDate()));
//            }
        }

        // 创建分页对象
        Page<Map<String, Object>> page = new Page<>(pageRequest.getPageNum(), pageRequest.getPageSize());

        // 构建查询条件
        QueryWrapper<Map<String, Object>> queryWrapper = new QueryWrapper<>();

        queryWrapper.and(wrapper -> wrapper
                .eq("sfkp", "已开票")
                .or()
                .eq("sfkp", "未开票")
        )
                .eq("fahuozhuangtai", "全部发货")
                .isNotNull("duizhangriqi")  // duizhangriqi IS NOT NULL
                .ne("duizhangriqi", "");    // duizhangriqi != ''

        // 添加查询条件
        if (StringUtils.isNotBlank(pageRequest.getDdh())) {
            queryWrapper.like("duizhangdanhao", pageRequest.getDdh());
        }
        if (StringUtils.isNotBlank(pageRequest.getKhmc())) {
            queryWrapper.like("khmc", pageRequest.getKhmc());
        }
        if (StringUtils.isNotBlank(pageRequest.getFzr())) {
            queryWrapper.like("fzr", pageRequest.getFzr());
        }
        if (StringUtils.isNotBlank(pageRequest.getBm())) {
            queryWrapper.eq("bm", pageRequest.getBm());
        }
        if (pageRequest.getStartDate() != null && pageRequest.getEndDate() != null) {
            queryWrapper.between("duizhangriqi", pageRequest.getStartDate(), pageRequest.getEndDate());
        }

        Result<?> authResult3 = AuthUtil3.checkAdminAuth(session);
        if (!authResult3.isSuccess()) {
                return Result.error("权限不足");
        }

        Result<?> authResult = AuthUtil2.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            String fuzeren = (String) session.getAttribute("D");
            if (fuzeren == null || fuzeren.trim().isEmpty()) {
                return Result.error("为获取身份信息，请重新登录");
            }

            Page<Map<String, Object>> result = dzdService.selectDistinctByDdhPageY(page, queryWrapper,fuzeren);

            return Result.success(result);
        }

        // 执行查询 - 通过Service调用
        Page<Map<String, Object>> result = dzdService.selectDistinctByDdhPage(page, queryWrapper);

        logDetailedResult(result);
        return Result.success(result);
    }
    //------------新0128获取期初金额的接口
    @PostMapping("/getOpeningAmount")
    public Result<Double> getOpeningAmount(@RequestBody Map<String, Object> params) {
        try {
            String khmc = (String) params.get("khmc");

            if (StringUtils.isBlank(khmc)) {
                return Result.error("客户名称不能为空");
            }

            // 查询该客户所有已开票但未支付的对账单的未付金额总和
            Double openingAmount = dzdService.getOpeningAmountByKhmc(khmc);

            return Result.success(openingAmount);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("获取期初金额失败: " + e.getMessage());
        }
    }
    //----------------------0128
    @PostMapping("/daochuexcel")
    public Result<Page<Map<String, Object>>> daochu(HttpSession session,@RequestBody PageRequest pageRequest) {

        if (pageRequest != null) {
            // 转换空字符串为null
            if (pageRequest.getStartDate() != null && pageRequest.getStartDate().trim().isEmpty()) {
                pageRequest.setStartDate(null);
            }
            if (pageRequest.getEndDate() != null && pageRequest.getEndDate().trim().isEmpty()) {
                pageRequest.setEndDate(null);
            }

//            if (StringUtils.isNotBlank(pageRequest.getStartDate())) {
//                pageRequest.setStartDate(formatAndNormalizeDate(pageRequest.getStartDate()));
//            }
//            if (StringUtils.isNotBlank(pageRequest.getEndDate())) {
//                pageRequest.setEndDate(formatAndNormalizeDate(pageRequest.getEndDate()));
//            }
        }

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
        if (StringUtils.isNotBlank(pageRequest.getDuizhangdanhao())) {
            queryWrapper.eq("duizhangdanhao", pageRequest.getDuizhangdanhao());
        }
        if (StringUtils.isNotBlank(pageRequest.getBm())) {
            queryWrapper.eq("bm", pageRequest.getBm());
        }
        if (pageRequest.getStartDate() != null && pageRequest.getEndDate() != null) {
            queryWrapper.between("ddrq", pageRequest.getStartDate(), pageRequest.getEndDate());
        }

        Result<?> authResult3 = AuthUtil3.checkAdminAuth(session);
        if (!authResult3.isSuccess()) {
                return Result.error("为获取身份信息，请重新登录");
        }

        Result<?> authResult = AuthUtil2.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            String fuzeren = (String) session.getAttribute("D");
            if (fuzeren == null || fuzeren.trim().isEmpty()) {
                return Result.error("为获取身份信息，请重新登录");
            }

            Page<Map<String, Object>> result = dzdService.daochuexcely(page, queryWrapper,fuzeren);

            return Result.success(result);
        }

        // 执行查询 - 通过Service调用
        Page<Map<String, Object>> result = dzdService.daochuexcel(page, queryWrapper);

        logDetailedResult(result);
        return Result.success(result);
    }


    private String formatAndNormalizeDate(String dateStr) {
        if (StringUtils.isBlank(dateStr)) {
            return dateStr;
        }

        try {
            // 去除前后空格
            dateStr = dateStr.trim();

            // 1. 如果是纯数字格式：20250101 -> 2025/01/01
            if (dateStr.matches("^\\d{8}$")) {
                String year = dateStr.substring(0, 4);
                String month = dateStr.substring(4, 6);
                String day = dateStr.substring(6, 8);
                return year + "/" + month + "/" + day;
            }

            // 2. 替换所有分隔符为斜杠
            String normalized = dateStr.replaceAll("[-.]", "/");

            // 3. 分割日期部分
            String[] parts = normalized.split("/");
            if (parts.length < 3) {
                log.warn("日期格式不正确: {}", dateStr);
                return dateStr;
            }

            // 4. 提取年月日并去除空格
            String year = parts[0].trim();
            String month = parts[1].trim();
            String day = parts[2].trim();

            // 5. 验证是否为数字
            if (!year.matches("\\d+") || !month.matches("\\d+") || !day.matches("\\d+")) {
                log.warn("日期包含非数字字符: {}", dateStr);
                return dateStr;
            }

            // 6. 补零处理
            year = String.format("%04d", Integer.parseInt(year));
            month = String.format("%02d", Integer.parseInt(month));
            day = String.format("%02d", Integer.parseInt(day));

            return year + "/" + month + "/" + day;

        } catch (NumberFormatException e) {
            log.error("日期数字转换错误: {}, 错误: {}", dateStr, e.getMessage());
            return dateStr;
        } catch (Exception e) {
            log.error("日期格式化异常: {}, 错误: {}", dateStr, e.getMessage());
            return dateStr;
        }
    }

    /**
     * 详细输出查询结果
     */
    private void logDetailedResult(Page<Map<String, Object>> result) {
        if (result == null) {
            log.error("查询结果为null");
            return;
        }

        log.info("分页信息: 第{}页/共{}页, 每页{}条/共{}条",
                result.getCurrent(), result.getPages(), result.getSize(), result.getTotal());

        List<Map<String, Object>> records = result.getRecords();
        if (records == null || records.isEmpty()) {
            log.warn("查询结果为空！");
            return;
        }

        log.info("查询到 {} 条记录:", records.size());
        for (int i = 0; i < records.size(); i++) {
            Map<String, Object> record = records.get(i);
            log.info("记录 {}: {}", i + 1, formatMapForLog(record));
        }
    }

    /**
     * 格式化Map用于日志输出
     */
    private String formatMapForLog(Map<String, Object> map) {
        if (map == null) {
            return "null";
        }

        StringBuilder sb = new StringBuilder("{");
        boolean first = true;

        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (!first) {
                sb.append(", ");
            }
            first = false;

            sb.append(entry.getKey()).append("=");

            Object value = entry.getValue();
            if (value == null) {
                sb.append("null");
            } else if (value instanceof String) {
                // 字符串类型，加上引号
                sb.append("\"").append(truncateString(value.toString(), 50)).append("\"");
            } else if (value instanceof Date) {
                // 日期类型，格式化
                try {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    sb.append("\"").append(sdf.format((Date) value)).append("\"");
                } catch (Exception e) {
                    sb.append("\"").append(value.toString()).append("\"");
                }
            } else if (value instanceof Number || value instanceof Boolean) {
                // 数字和布尔类型直接输出
                sb.append(value);
            } else {
                // 其他类型，截断输出
                sb.append("\"").append(truncateString(value.toString(), 30)).append("\"");
            }
        }

        sb.append("}");
        return sb.toString();
    }

    /**
     * 截断字符串，避免日志过长
     */
    private String truncateString(String str, int maxLength) {
        if (str == null || str.length() <= maxLength) {
            return str;
        }
        return str.substring(0, maxLength) + "...";
    }

    /**
     * 根据订单号获取详细信息
     */
    @PostMapping("/getDetailByDdh")
    public Result getDetailByDdh(@RequestBody Map<String, Object> params) {
        try {
            Object ddhObj = params.get("duizhangdanhao");

            if (ddhObj == null) {
                return Result.error("对账单号不能为空");
            }

            // 统一转换为字符串
            String duizhangdanhao = ddhObj.toString();

            if (duizhangdanhao.trim().isEmpty()) {
                return Result.error("对账单号不能为空");
            }

            List<Ddmx> detailList = dzdService.getDetailByDdh(duizhangdanhao);
            return Result.success(detailList);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("获取详情失败: " + e.getMessage());
        }
    }

    /**
     * 更新对账状态
     */
    @PostMapping("/updateDzztStatus")
    public Result updateDzztStatus(HttpSession session, @RequestBody Map<String, Object> params) {
        // 权限检查
        Result<?> authResult = AuthUtil2.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }
        Result<?> authResult3 = AuthUtil3.checkAdminAuth(session);
        if (!authResult3.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }
        try {
            String duizhangdanhao = (String) params.get("duizhangdanhao");
            String sfkp = (String) params.get("sfkp");

            if (duizhangdanhao == null || sfkp == null) {
                return Result.error("对账单号和对账状态不能为空");
            }

            boolean success = dzdService.updateDzztStatusByDuizhangdanhao(duizhangdanhao, sfkp);
            if (success) {
                return Result.success("更新对账状态成功");
            } else {
                return Result.error("更新对账状态失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("更新对账状态失败: " + e.getMessage());
        }
    }

    /**
     * 批量更新开票状态
     * @param request 开票请求
     * @return 操作结果
     */
    @PostMapping("/batchUpdateInvoiceStatusByDdh")
    public Map<String, Object> batchUpdateInvoiceStatus(@RequestBody BatchInvoiceRequest request) {
        Map<String, Object> result = new HashMap<>();

        try {
            boolean success = dzdService.batchUpdateInvoiceStatus(request);

            if (success) {
                result.put("code", 200);
                result.put("message", "开票成功");
                result.put("data", null);
            } else {
                result.put("code", 500);
                result.put("message", "开票失败");
            }
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", e.getMessage());
        }

        return result;
    }

    // 添加查询当前文件名的接口
    @PostMapping("/getCurrentPdfFileName")
    public Result<String> getCurrentPdfFileName(@RequestBody Map<String, Object> params) {
        String duizhangdanhao = (String) params.get("duizhangdanhao");

        if (duizhangdanhao == null || duizhangdanhao.trim().isEmpty()) {
            return Result.error("对账单号不能为空");
        }

        try {
            // 查询当前的文件名
            String currentFileName = dzdService.getCurrentPdfFileName(duizhangdanhao);
            return Result.success(currentFileName);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("查询文件名失败: " + e.getMessage());
        }
    }

    @PostMapping("/updatePdfFileName")
    public Result updatePdfFileName(@RequestBody Map<String, Object> params) {
        String duizhangdanhao = (String) params.get("duizhangdanhao");
        String dzscwj = (String) params.get("dzscwj");

        boolean success = dzdService.updatePdfFileNameByDdh(duizhangdanhao, dzscwj);

        if (success) {
            return Result.success("PDF文件名更新成功");
        } else {
            return Result.error("PDF文件名更新失败");
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
        Result<?> authResult3 = AuthUtil3.checkAdminAuth(session);
        if (!authResult3.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            String duizhangdanhao = (String) updateParams.get("duizhangdanhao");
            String fieldName = (String) updateParams.get("fieldName");
            Object fieldValue = updateParams.get("fieldValue");

            if (duizhangdanhao == null || fieldName == null) {
                return Result.error("订单号和字段名不能为空");
            }

            // 特殊处理开票状态和开票时间
            if ("sfkp".equals(fieldName) && "已开票".equals(fieldValue)) {
                // 同时更新开票时间
                Map<String, Object> multiUpdateParams = new HashMap<>();
                multiUpdateParams.put("duizhangdanhao", duizhangdanhao);
                int result = dzdService.updateByDdh(multiUpdateParams);
                return Result.success(result);
            } else {
                Map<String, Object> updateMap = new HashMap<>();
                updateMap.put("duizhangdanhao", duizhangdanhao);
                updateMap.put(fieldName, fieldValue);

                int result = dzdService.updateByDdh(updateMap);
                return Result.success(result);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("更新失败: " + e.getMessage());
        }
    }

}

