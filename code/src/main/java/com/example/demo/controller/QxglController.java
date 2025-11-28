package com.example.demo.controller;

import com.example.demo.service.QxglService;
import com.example.demo.util.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/user")
public class QxglController {


    @Autowired
    private QxglService qxglService;

    @RequestMapping("/login")
    public Qxgl login(HttpSession session, String username, String password) {
        try {
            Map<String, Object> map = qxglService.login(username, password);
            System.out.println("map");
            System.out.println(map);

            if (StringUtils.isEmpty(map)) {
                SessionUtil.remove(session, "token");
                SessionUtil.remove(session, "C");
                SessionUtil.remove(session, "D");
                return Qxgl.error(-1, "账号密码错误");
            } else {
                // 获取 token 字符串
                String tokenJson = map.get("token").toString();
                System.out.println("Token JSON: " + tokenJson);

                // 解析 JSON
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> tokenData = objectMapper.readValue(tokenJson, Map.class);

                System.out.println("解析后的Token数据: " + tokenData);

                // 设置 Session
                SessionUtil.setToken(session, tokenJson);
                System.out.println("设置的Token: " + tokenJson);

                // 从解析的数据中获取 C 和 D
                String cValue = (String) tokenData.get("C");
                String dValue = (String) tokenData.get("D");

                // 存储 C 和 D 到 Session
                SessionUtil.setC(session, cValue);
                SessionUtil.setD(session, dValue);

                System.out.println("已存储C到Session: " + cValue);
                System.out.println("已存储D到Session: " + dValue);

                return Qxgl.success("登陆成功");
            }
        } catch (Exception e) {
            log.error("登陆失败：{}", e.getMessage());
            return Qxgl.error("错误!");
        }
    }

    /**
     * 查询所有用户
     */
    @RequestMapping("/getList")
    public Result<List<Map<String, Object>>> getList(HttpSession session) {

        // 权限检查
        Result<?> authResult = AuthUtil.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            List<com.example.demo.entity.Qxgl> entityList = qxglService.getList();

            // 转换为Map列表
            List<Map<String, Object>> utilList = entityList.stream()
                    .map(entity -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", entity.getId());
                        map.put("power", entity.getC());
                        map.put("name", entity.getD());
                        map.put("username", entity.getE());
                        map.put("password", entity.getF());
                        // 添加其他需要的字段...
                        return map;
                    })
                    .collect(Collectors.toList());

            return Result.success(utilList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return Result.error("错误!");
        }
    }

    /**
     * 根据姓名模糊查询
     */
    @RequestMapping("/queryList")
    public Result<List<Map<String, Object>>> queryList(@RequestParam(value = "name", required = false) String name, HttpSession session) {

        // 权限检查
        Result<?> authResult = AuthUtil.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            if (name == null) {
                log.info("姓名为null");
            } else if (name.isEmpty()) {
                log.info("姓名为空字符串");
            }

            List<com.example.demo.entity.Qxgl> entityList = qxglService.queryList(name);

            // 转换为Map列表
            List<Map<String, Object>> utilList = entityList.stream()
                    .map(entity -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", entity.getId());
                        map.put("power", entity.getC());
                        map.put("name", entity.getD());
                        map.put("username", entity.getE());
                        map.put("password", entity.getF());
                        // 添加其他需要的字段...
                        return map;
                    })
                    .collect(Collectors.toList());

            return Result.success(utilList);

        } catch (Exception e) {
            log.error("获取失败：{}", e.getMessage(), e);
            return Result.error("查询失败!");
        }
    }

    /**
     * 修改用户信息
     */
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public Result<Map<String, Object>> update(@RequestBody Map<String, Object> updateData, HttpSession session) {
        // 权限检查
        Result<?> authResult = AuthUtil.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            log.info("接收到的修改数据: {}", updateData);

            // 创建entity对象并设置字段
            com.example.demo.entity.Qxgl entity = new com.example.demo.entity.Qxgl();
            entity.setId(Integer.valueOf(updateData.get("id").toString()));
            entity.setC(updateData.get("power").toString());  // 权限对应C字段
            entity.setD(updateData.get("name").toString());   // 姓名对应D字段
            entity.setE(updateData.get("username").toString()); // 用户名对应E字段
            entity.setF(updateData.get("password").toString()); // 密码对应F字段

            log.info("转换后的entity: {}", entity);

            boolean success = qxglService.update(entity);
            if (success) {
                // 返回修改后的数据
                Map<String, Object> result = new HashMap<>();
                result.put("id", entity.getId());
                result.put("power", entity.getC());
                result.put("name", entity.getD());
                result.put("username", entity.getE());
                result.put("password", entity.getF());
                return Result.success(result);
            } else {
                return Result.error("修改失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("修改失败：{}", e.getMessage());
            log.error("参数：{}", updateData);
            return Result.error("修改失败");
        }
    }

    /**
     * 添加用户 - 修复版本
     */
    @RequestMapping("/add")
    public Result<Map<String, Object>> add(@RequestBody Map<String, Object> requestData, HttpSession session) {
        // 权限检查
        Result<?> authResult = AuthUtil.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            log.info("接收到的添加数据: {}", requestData);

            @SuppressWarnings("unchecked")
            Map<String, Object> addInfo = (Map<String, Object>) requestData.get("addInfo");

            if (addInfo == null) {
                return Result.error("缺少addInfo参数");
            }

            // 创建entity对象并设置字段
            com.example.demo.entity.Qxgl entity = new com.example.demo.entity.Qxgl();
            entity.setC(addInfo.get("power").toString());  // 权限对应C字段
            entity.setD(addInfo.get("name").toString());   // 姓名对应D字段
            entity.setE(addInfo.get("username").toString()); // 用户名对应E字段
            entity.setF(addInfo.get("password").toString()); // 密码对应F字段

            log.info("转换后的entity: {}", entity);

            com.example.demo.entity.Qxgl resultEntity = qxglService.add(entity);
            if (resultEntity != null) {
                // 返回添加后的数据
                Map<String, Object> result = new HashMap<>();
                result.put("id", resultEntity.getId());
                result.put("power", resultEntity.getC());
                result.put("name", resultEntity.getD());
                result.put("username", resultEntity.getE());
                result.put("password", resultEntity.getF());
                return Result.success(result);
            } else {
                return Result.error("添加失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("添加失败：{}", e.getMessage());
            log.error("参数：{}", requestData);
            return Result.error("添加失败");
        }
    }

    /**
     * 删除用户
     */
    @RequestMapping("/delete")
    public Result<List<Integer>> delete(@RequestBody HashMap map, HttpSession session) {

        // 权限检查
        Result<?> authResult = AuthUtil.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        com.example.demo.util.Qxgl qxgl = GsonUtil.toEntity(SessionUtil.getToken(session), com.example.demo.util.Qxgl.class);
        System.out.println(qxgl);
        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
        List<Integer> idList = GsonUtil.toList(gsonUtil.get("idList"), Integer.class);

        try {
            // 批量删除，避免循环调用
            boolean success = qxglService.delete(idList);
            if (success) {
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

    /**
     * 转换单个entity到util
     */
    private com.example.demo.util.Qxgl convertToUtil(com.example.demo.entity.Qxgl entity) {
        if (entity == null) {
            return null;
        }

        com.example.demo.util.Qxgl util = new com.example.demo.util.Qxgl();
        // 复制属性 - 根据实际字段映射
        util.setId(entity.getId());
        util.setC(entity.getC());
        util.setE(entity.getE());
        util.setF(entity.getF());
        util.setD(entity.getD());

        return util;
    }

    /**
     * 转换entity列表到util列表
     */
    private List<com.example.demo.util.Qxgl> convertToUtilList(List<com.example.demo.entity.Qxgl> entityList) {
        if (entityList == null) {
            return new ArrayList<>();
        }

        return entityList.stream()
                .map(this::convertToUtil)
                .collect(Collectors.toList());
    }

}