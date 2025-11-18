package com.example.demo.controller;

import com.example.demo.entity.UserInfo;
import com.example.demo.service.UserInfoService;
import com.example.demo.util.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserInfoController {
    @Autowired
    private UserInfoService userInfoService;

    @RequestMapping("/login")
    public ResultInfo login(HttpSession session, String username, String password) {
        try {
            //获取user
            Map<String, Object> map = userInfoService.login(username, password);
            System.out.println("map");
            System.out.println(map);

            //为Null则查询不到
            if (StringUtils.isEmpty(map)) {
                SessionUtil.remove(session, "token");
                SessionUtil.remove(session, "power");
                SessionUtil.remove(session, "username");
                return ResultInfo.error(-1, "账号密码错误");
            } else {
                SessionUtil.setToken(session, map.get("token").toString());
                SessionUtil.setPower(session, (List<UserInfo>) map.get("power"));
                SessionUtil.setUserName(session,(List<UserInfo>) map.get("username"));
                return ResultInfo.success("登陆成功");
            }
        } catch (Exception e) {
            log.error("登陆失败：{}", e.getMessage());
            log.error("参数：{}", username);
            log.error("参数：{}", password);
            return ResultInfo.error("错误!");
        }
    }

    /**
     * 查询所有
     *
     * @return ResultInfo
     */
    @RequestMapping("/getList")
    public ResultInfo getList(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<UserInfo> getList = userInfoService.getList();
            return ResultInfo.success("获取成功", getList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }

    /**
     * 根据姓名和部门查询
     *
     * @return ResultInfo
     */
    @RequestMapping("/queryList")
    public ResultInfo queryList(String name, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<UserInfo> list = userInfoService.queryList(name);
            return ResultInfo.success("获取成功", list);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }



    /**
     * 修改
     */
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public ResultInfo update(@RequestBody String updateJson, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        if(!userInfo.getPower().equals("管理员")){
//            return ResultInfo.error(401, "无权限");
//        }
        UserInfo UserInfo = null;
        try {
            UserInfo = DecodeUtil.decodeToJson(updateJson, UserInfo.class);
            if (userInfoService.update(UserInfo)) {
                return ResultInfo.success("修改成功", UserInfo);
            } else {
                return ResultInfo.success("修改失败", UserInfo);
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("修改失败：{}", e.getMessage());
            log.error("参数：{}", userInfo);
            return ResultInfo.error("修改失败");
        }
    }

    /**
     * 添加
     */
    @RequestMapping("/add")
    public ResultInfo add(@RequestBody HashMap map, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
//        if(!userInfo.getPower().equals("管理员")){
//            return ResultInfo.error(401, "无权限");
//        }
        try {
            UserInfo UserInfo = GsonUtil.toEntity(gsonUtil.get("addInfo"), UserInfo.class);
            UserInfo = userInfoService.add(UserInfo);
            if (StringUtils.isNotNull(UserInfo)) {
                return ResultInfo.success("添加成功", UserInfo);
            } else {
                return ResultInfo.success("添加失败", null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("添加失败：{}", e.getMessage());
            log.error("参数：{}", map);
            return ResultInfo.error("添加失败");
        }
    }

    /**
     * 删除
     *
     * @param map
     * @return ResultInfo
     */
    @RequestMapping("/delete")
    public ResultInfo delete(@RequestBody HashMap map,HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        System.out.println(userInfo);
        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
        List<Integer> idList = GsonUtil.toList(gsonUtil.get("idList"), Integer.class);
//        if(!userInfo.getPower().equals("管理员")){
//            return ResultInfo.error(401, "无权限");
//        }
        try {
            for(int i=0; i<idList.size(); i++){
                int this_id = idList.get(i);
                userInfoService.delete(Collections.singletonList(this_id));
            }
            return ResultInfo.success("删除成功", idList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("删除失败：{}", e.getMessage());
            log.error("参数：{}", idList);
            return ResultInfo.error("删除失败");
        }
    }

    @RequestMapping("/getName")
    public ResultInfo getName(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            return ResultInfo.success("获取成功", userInfo.getName());
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }

    /**
     * 获取当前账号权限
     *
     * @return ResultInfo
     */
    @RequestMapping("/getPower")
    public ResultInfo getPower(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            return ResultInfo.success("获取成功", userInfo.getPower());
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }

    /**
     * 获取当前账号操作权限
     *
     * @return ResultInfo
     */
    @RequestMapping("/getCaozuoquanxian")
    public ResultInfo getCaozuoquanxian(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            return ResultInfo.success("获取成功", userInfo.getCaozuoquanxian());
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }

}