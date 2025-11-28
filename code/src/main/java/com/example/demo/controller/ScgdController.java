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

            // 执行查询
            PageResult<Scgd> result = scgdService.getScgdPage(request);
            return Result.success(result);

        } catch (Exception e) {
            log.error("查询客户信息失败", e);
            return Result.error("查询失败: " + e.getMessage());
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