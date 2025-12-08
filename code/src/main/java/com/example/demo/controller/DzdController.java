package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.entity.Ddmx;
import com.example.demo.service.DzdService;
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
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/dzd")
@Slf4j
public class DzdController {

    @Autowired
    private DzdService dzdService;

    /**
     * 分页查询去重订单数据
     */
    @PostMapping("/distinctPage")
    public Result<Page<Map<String, Object>>> distinctPage(HttpSession session,@RequestBody PageRequest pageRequest) {

        if (pageRequest != null) {
            // 转换空字符串为null
            if (pageRequest.getStartDate() != null && pageRequest.getStartDate().trim().isEmpty()) {
                pageRequest.setStartDate(null);
            }
            if (pageRequest.getEndDate() != null && pageRequest.getEndDate().trim().isEmpty()) {
                pageRequest.setEndDate(null);
            }

            if (StringUtils.isNotBlank(pageRequest.getStartDate())) {
                pageRequest.setStartDate(formatAndNormalizeDate(pageRequest.getStartDate()));
            }
            if (StringUtils.isNotBlank(pageRequest.getEndDate())) {
                pageRequest.setEndDate(formatAndNormalizeDate(pageRequest.getEndDate()));
            }
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
            String ddh = (String) params.get("ddh");
            if (ddh == null) {
                return Result.error("订单号和订单日期不能为空");
            }

            List<Ddmx> detailList = dzdService.getDetailByDdh(ddh);
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
    public Result updateDzztStatus(HttpSession session,@RequestBody Map<String, Object> params) {

        // 权限检查
        Result<?> authResult = AuthUtil2.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }
        try {
            String ddh = (String) params.get("ddh");
            String dzzt = (String) params.get("dzzt");

            if (ddh == null || dzzt == null) {
                return Result.error("订单号和对账状态不能为空");
            }

            boolean success = dzdService.updateDzztStatus(ddh, dzzt);
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

}
