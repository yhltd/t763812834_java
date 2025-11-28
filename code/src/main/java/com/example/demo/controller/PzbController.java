package com.example.demo.controller;

import com.example.demo.entity.Pzb;
import com.example.demo.service.PzbService;
import com.example.demo.util.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/pzb")
public class PzbController {

    @Autowired
    private PzbService pzbService;

    /**
     * 查询所有配置信息
     */
    @RequestMapping("/getList")
    public Result<List<Pzb>> getList(HttpSession session) {
        // 权限检查
        Result<?> authResult = AuthUtil.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            List<Pzb> getList = pzbService.getListArr();
            return Result.success(getList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return Result.error("获取失败!");
        }
    }

    @RequestMapping("/queryList")
    public Result<List<Pzb>> queryList(@RequestParam(value = "name", required = false) String name, HttpSession session) {
        // 权限检查
        Result<?> authResult = AuthUtil.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            log.info("开始根据姓名模糊查询，姓名参数：{}", name);

            List<Pzb> list = pzbService.queryList(name);
            log.info("查询结果数量：{}", list != null ? list.size() : "null");

            return Result.success(list);
        } catch (Exception e) {
            log.error("获取失败：{}", e.getMessage(), e);
            return Result.error("查询失败!");
        }
    }

    /**
     * 新增一行数据
     */
    @RequestMapping("/add")
    public Result<String> add(HttpSession session) {
        // 权限检查
        Result<?> authResult = AuthUtil.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            boolean success = pzbService.add();
            if (success) {
                return Result.success("新增成功");
            } else {
                return Result.error("新增失败");
            }
        } catch (Exception e) {
            log.error("新增异常: {}", e.getMessage());
            return Result.error("新增异常: " + e.getMessage());
        }
    }

    /**
     * 删除配置项
     */
    @RequestMapping("/delete")
    public Result<String> delete(@RequestBody Map<String, Object> requestData, HttpSession session) {
        // 权限检查
        Result<?> authResult = AuthUtil.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            @SuppressWarnings("unchecked")
            List<Integer> idList = (List<Integer>) requestData.get("idList");

            if (idList == null || idList.isEmpty()) {
                return Result.error("请选择要删除的数据");
            }

            boolean success = pzbService.delete(idList);
            if (success) {
                return Result.success("删除成功，共删除 " + idList.size() + " 条记录");
            } else {
                return Result.error("删除失败");
            }
        } catch (Exception e) {
            log.error("删除异常: {}", e.getMessage());
            return Result.error("删除异常: " + e.getMessage());
        }
    }

    /**
     * 更新配置项
     */
    @RequestMapping("/update")
    public Result<String> update(@RequestParam String column,
                                 @RequestParam(required = false) String value,
                                 @RequestParam int id,
                                 HttpSession session) {
        // 权限检查
        Result<?> authResult = AuthUtil.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            log.info("更新配置项 - ID: {}, 字段: {}, 新值: {}", id, column, value);

            // 允许空值更新
            boolean success = pzbService.update(column, value, id);
            if (success) {
                return Result.success("修改成功");
            } else {
                return Result.error("修改失败");
            }
        } catch (Exception e) {
            log.error("更新异常: {}", e.getMessage());
            return Result.error("更新异常: " + e.getMessage());
        }
    }
}