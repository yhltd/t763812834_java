package com.example.demo.controller;

import com.example.demo.entity.Scgd;
import com.example.demo.service.ScgdService;
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

@Slf4j
@RestController
@RequestMapping("/shengchan")
public class ScgdController {

    @Autowired
    private ScgdService scgdService;

    /**
     * 分页查询客户信息
     */
    @PostMapping("/list")
    public Result<PageResult<Scgd>> getKhxxList(HttpSession session, @RequestBody ScgdSearchRequest request) {
        try {
            // 处理日期格式转换：将-替换为/
            if (StringUtils.isNotBlank(request.getStartDate())) {
                request.setStartDate(normalizeDateString(request.getStartDate()));
            }
            if (StringUtils.isNotBlank(request.getEndDate())) {
                request.setEndDate(normalizeDateString(request.getEndDate()));
            }

            // 执行查询
            PageResult<Scgd> result = scgdService.getScgdPage(request);
            return Result.success(result);

        } catch (Exception e) {
            log.error("查询客户信息失败", e);
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    @PostMapping("/excel")
    public Result<List<Scgd>> daochuexcel(@RequestBody Map<String, String> params) {
        try {
            String id = params.get("id");
            List<Scgd> result = scgdService.daochuexcel(id);
            return Result.success(result);

        } catch (Exception e) {
            log.error("查询客户信息失败", e);
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    private String normalizeDateString(String dateStr) {
        if (StringUtils.isBlank(dateStr)) {
            return dateStr;
        }

        try {
            // 移除所有非数字字符（除了斜杠）
            String cleaned = dateStr.replaceAll("[^0-9/]", "/");

            // 处理纯数字格式（如20250101）
            if (cleaned.matches("\\d{8}")) {
                cleaned = cleaned.substring(0, 4) + "/" +
                        cleaned.substring(4, 6) + "/" +
                        cleaned.substring(6, 8);
            }

            // 使用SimpleDateFormat解析并格式化
            SimpleDateFormat[] possibleFormats = {
                    new SimpleDateFormat("yyyy/M/d"),
                    new SimpleDateFormat("yyyy-MM-dd"),
                    new SimpleDateFormat("yyyy.MM.dd"),
                    new SimpleDateFormat("yyyy/MM/dd")
            };

            Date date = null;
            for (SimpleDateFormat sdf : possibleFormats) {
                try {
                    sdf.setLenient(false); // 严格模式
                    date = sdf.parse(cleaned);
                    break;
                } catch (Exception e) {
                    // 尝试下一个格式
                    continue;
                }
            }

            if (date != null) {
                // 统一格式化为 yyyy/MM/dd
                SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy/MM/dd");
                return outputFormat.format(date);
            }

            // 如果无法解析，返回原始值（但记录日志）
            log.warn("无法解析日期字符串: {}", dateStr);
            return dateStr;

        } catch (Exception e) {
            log.error("日期格式化错误: {}", dateStr, e);
            return dateStr;
        }
    }

    /**
     * 根据ID获取详情
     */
    @PostMapping("/detail")
    public Result<Scgd> getScgdDetail(HttpSession session, @RequestBody DetailRequestDTO request) {
        try {

            // 数据验证
            if (request.getId() == null) {
                return Result.error("客户ID不能为空");
            }

            // 查询详情
            Scgd xiangqing = scgdService.getById(request.getId());
            if (xiangqing == null) {
                return Result.error("客户信息不存在");
            }

            return Result.success(xiangqing);

        } catch (Exception e) {
            log.error("获取客户详情失败", e);
            return Result.error("获取详情失败: " + e.getMessage());
        }
    }

    /**
     * 更新状态
     */
    @PostMapping("/updateStatus")
    public Result updateStatus(@RequestBody Map<String, Object> params,HttpSession session) {
        try {

            if ("下单".equals(params.get("zt"))) {
                // 权限检查
                Result<?> authResult = AuthUtil2.checkAdminAuth(session);
                if (!authResult.isSuccess()) {
                    return Result.error(authResult.getCode(), authResult.getMessage());
                }

            }


            // 获取ID参数，支持多种类型
            Integer id = null;
            Object idObj = params.get("id");
            if (idObj instanceof Integer) {
                id = (Integer) idObj;
            } else if (idObj instanceof String) {
                try {
                    id = Integer.parseInt((String) idObj);
                } catch (NumberFormatException e) {
                    return Result.error("ID格式不正确");
                }
            } else if (idObj != null) {
                try {
                    id = Integer.parseInt(idObj.toString());
                } catch (NumberFormatException e) {
                    return Result.error("ID格式不正确");
                }
            }

            String zt = (String) params.get("zt");

            if (id == null) {
                return Result.error("ID不能为空");
            }
            if (zt == null || zt.trim().isEmpty()) {
                return Result.error("状态不能为空");
            }

            boolean success = scgdService.updateStatus(id, zt);
            if (success) {
                return Result.success("状态更新成功");
            } else {
                return Result.error("状态更新失败");
            }
        } catch (Exception e) {
            log.error("状态更新失败", e);
            return Result.error("状态更新失败: " + e.getMessage());
        }
    }

    /**
     * 删除客户信息
     */
    @PostMapping("/delete")
    public Result delete(@RequestBody Map<String, Object> params) {
        try {
            Integer id = (Integer) params.get("id");
            if (id == null) {
                return Result.error("ID不能为空");
            }

            boolean success = scgdService.deleteById(id);
            if (success) {
                return Result.success("删除成功");
            } else {
                return Result.error("删除失败，记录不存在");
            }
        } catch (Exception e) {
            return Result.error("删除失败: " + e.getMessage());
        }
    }

    /**
     * 更新客户信息
     */
    @PostMapping("/update")
    public Result update(@RequestBody Scgd shengchan,HttpSession session) {
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
            if (shengchan.getKhcm() == null || shengchan.getKhcm().trim().isEmpty()) {
                return Result.error("客户名称不能为空");
            }

            // 修正：使用 MyBatis-Plus 自带的 saveOrUpdate 方法
            boolean success = scgdService.saveOrUpdate(shengchan);
            if (success) {
                return Result.success("保存成功");
            } else {
                return Result.error("保存失败");
            }
        } catch (Exception e) {
            return Result.error("保存失败: " + e.getMessage());
        }
    }
}