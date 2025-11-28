
package com.example.demo.controller;

import com.example.demo.entity.Khxx;
import com.example.demo.entity.Ygxx;
import com.example.demo.service.YgxxService;
import com.example.demo.util.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/ygxx")
public class YgxxController {


    @Autowired
    private YgxxService ygxxService;

    /**
     * 查询所有
     */
    @RequestMapping("/getList")
    public Result<List<Ygxx>> getList(HttpSession session) {

        // 权限检查
        Result<?> authResult = AuthUtil2.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            List<Ygxx> getList = ygxxService.getList();
            return Result.success(getList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return Result.error("错误!");
        }
    }

    @RequestMapping("/queryList")
    public Result<List<Ygxx>> queryList(@RequestBody HashMap map, HttpSession session) {

        // 权限检查
        Result<?> authResult = AuthUtil2.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            String name = (String) map.get("name");

            List<Ygxx> list = ygxxService.queryList(name);

            return Result.success(list);
        } catch (Exception e) {
            log.error("获取失败：{}", e.getMessage(), e);
            return Result.error("查询失败!");
        }
    }

    /**
     * 修改
     */
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public Result<Ygxx> update(@RequestBody HashMap map, HttpSession session) {

        // 权限检查
        Result<?> authResult = AuthUtil2.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
            Ygxx ygxx = GsonUtil.toEntity(gsonUtil.get("updateInfo"), Ygxx.class);

            log.info("修改员工信息，ID: {}, 姓名: {}", ygxx.getId(), ygxx.getXm());

            if (ygxxService.update(ygxx)) {
                return Result.success(ygxx);
            } else {
                return Result.error("修改失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("修改失败：{}", e.getMessage());
            log.error("修改参数：{}", map);
            return Result.error("修改失败");
        }
    }

    /**
     * 添加
     */
    @RequestMapping("/add")
    public Result<Ygxx> add(@RequestBody HashMap map, HttpSession session) {

        // 权限检查
        Result<?> authResult = AuthUtil2.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
        try {
            Ygxx ygxx = GsonUtil.toEntity(gsonUtil.get("addInfo"), Ygxx.class);
            Ygxx result = ygxxService.add(ygxx);
            if (StringUtils.isNotNull(result)) {
                return Result.success(result);
            } else {
                return Result.success( null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("添加失败：{}", e.getMessage());
            log.error("参数：{}", map);
            return Result.error("添加失败");
        }
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    public Result<List<Integer>> delete(@RequestBody HashMap map, HttpSession session) {

        // 权限检查
        Result<?> authResult = AuthUtil2.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
        List<Integer> idList = GsonUtil.toList(gsonUtil.get("idList"), Integer.class);
        try {
            if (ygxxService.delete(idList)) {
                return Result.success(idList);
            } else {
                return Result.error("删除失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("删除失败：{}", e.getMessage());
            log.error("参数：{}", idList);
            return Result.error("删除失败");
        }
    }
}