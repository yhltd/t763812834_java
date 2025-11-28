package com.example.demo.controller;
import com.example.demo.entity.*;
import com.example.demo.service.DyshdService;

import com.example.demo.util.*;
import com.example.demo.util.Qxgl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/dyshd")
public class DyshdController {

    @Autowired
    private DyshdService dyshdService;

    @PostMapping("/getddh")
    public ResultInfo getddh(HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        Qxgl userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), Qxgl.class);
        try {
            List<Dyshd> getddh = dyshdService.getddh();
            // 添加日志查看实际返回的内容
            log.info("返回结果: data大小={}", getddh != null ? getddh.size() : 0);
            return ResultInfo.success("获取成功", getddh);

            // 添加日志查看实际返回的内容
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }


    @PostMapping("/getshdlist")
    public  Result<PageResult<Dyshd>> getshdList(HttpSession session, @RequestBody PageRequestDTO request) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            // 执行查询
            PageResult<Dyshd> result = dyshdService.getshdlist(request);
            return Result.success(result);

        } catch (Exception e) {
            log.error("查询客户信息失败", e);
            return Result.error("查询失败: " + e.getMessage());
        }
    }



    @PostMapping("/shipProducts")
    public Result updateShipDate(HttpSession session,@RequestBody Map<String, Object> params) {
        // 权限检查
        Result<?> authResult = AuthUtil2.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            // 打印接收到的完整参数
            System.out.println("=== 接收到发货请求 ===");
            System.out.println("完整参数: " + params);

            // 检查是否是批量发货（包含ids数组）
            Object idsObj = params.get("ids");
            Object fhrqObj = params.get("fhrq");  // 改为fhrq

            System.out.println("ids参数: " + idsObj);
            System.out.println("fhrq参数: " + fhrqObj);
            System.out.println("fhrq参数类型: " + (fhrqObj != null ? fhrqObj.getClass().getSimpleName() : "null"));

            if (idsObj instanceof List) {
                // 批量发货逻辑
                List<?> idsList = (List<?>) idsObj;
                System.out.println("批量发货，ID数量: " + idsList.size());
                System.out.println("IDs列表: " + idsList);

                List<Integer> validIds = new ArrayList<>();
                for (Object idObj : idsList) {
                    Integer id = convertToInteger(idObj);
                    if (id != null) {
                        validIds.add(id);
                    }
                }

                System.out.println("有效ID列表: " + validIds);

                if (validIds.isEmpty()) {
                    return Result.error("没有有效的ID");
                }

                if (fhrqObj == null || fhrqObj.toString().trim().isEmpty()) {
                    return Result.error("发货日期不能为空");
                }

                String fhrq = fhrqObj.toString();
                System.out.println("发货日期: " + fhrq);

                // 调用批量更新服务，传入fhrq
                boolean success = dyshdService.batchUpdateShipDate(validIds, fhrq);
                if (success) {
                    return Result.success("批量发货成功");
                } else {
                    return Result.error("批量发货失败");
                }

            } else {
                // 单个发货逻辑
                Integer id = convertToInteger(params.get("id"));
                String fhrq = (String) params.get("fhrq");  // 改为fhrq

                System.out.println("单个发货 - ID: " + id + ", 发货日期: " + fhrq);

                if (id == null) {
                    return Result.error("ID不能为空");
                }
                if (fhrq == null || fhrq.trim().isEmpty()) {
                    return Result.error("发货日期不能为空");
                }

                // 调用更新服务，传入fhrq
                boolean success = dyshdService.updateShipDate(id, fhrq);
                if (success) {
                    return Result.success("发货日期更新成功");
                } else {
                    return Result.error("发货日期更新失败");
                }
            }

        } catch (Exception e) {
            System.out.println("发货异常: " + e.getMessage());
            log.error("发货失败", e);
            return Result.error("发货失败: " + e.getMessage());
        } finally {
            System.out.println("=== 发货请求处理结束 ===");
        }
    }

    // 辅助方法：将对象转换为Integer
    private Integer convertToInteger(Object obj) {
        if (obj instanceof Integer) {
            return (Integer) obj;
        } else if (obj instanceof String) {
            try {
                return Integer.parseInt((String) obj);
            } catch (NumberFormatException e) {
                System.out.println("ID转换失败: " + obj);
                return null;
            }
        } else if (obj != null) {
            try {
                return Integer.parseInt(obj.toString());
            } catch (NumberFormatException e) {
                System.out.println("ID转换失败: " + obj);
                return null;
            }
        }
        return null;
    }

}