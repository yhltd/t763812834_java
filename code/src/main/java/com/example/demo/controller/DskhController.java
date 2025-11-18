package com.example.demo.controller;

import com.example.demo.entity.Dskh;
import com.example.demo.entity.Gyszl;
import com.example.demo.entity.UserInfo;
import com.example.demo.service.DskhService;
import com.example.demo.service.GyszlService;
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

@Slf4j
@RestController
@RequestMapping("/dskh")
public class DskhController {
    @Autowired
    private DskhService dskhService;

    /**
     * 查询所有
     *
     * @return ResultInfo
     */
    @RequestMapping("/getList")
    public ResultInfo getList(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Dskh> getList = dskhService.getList();
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
    public ResultInfo queryList(String khmc,String kddh, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Dskh> list = dskhService.queryList(khmc,kddh);
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
        if(!userInfo.getCaozuoquanxian().equals("可修改")){
            return ResultInfo.error(401, "无权限,请联系管理员");
        }
        Dskh dskh = null;
        try {
            dskh = DecodeUtil.decodeToJson(updateJson, Dskh.class);
            if (dskhService.update(dskh)) {
                return ResultInfo.success("修改成功", dskh);
            } else {
                return ResultInfo.success("修改失败", dskh);
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("修改失败：{}", e.getMessage());
//            log.error("参数：{}", userInfo);
            return ResultInfo.error("修改失败");
        }
    }

    /**
     * 修改
     */
//    @RequestMapping(value = "/update1", method = RequestMethod.POST)
//    public ResultInfo update1(@RequestBody String updateJson, HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        if(!userInfo.getCaozuoquanxian().equals("可修改")){
//            return ResultInfo.error(401, "无权限");
//        }
//        Dskh dskh = null;
//        try {
//            dskh = DecodeUtil.decodeToJson(updateJson, Dskh.class);
//            if (dskhService.update(dskh)) {
//                return ResultInfo.success("修改成功", dskh);
//            } else {
//                return ResultInfo.success("修改失败", dskh);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("修改失败：{}", e.getMessage());
////            log.error("参数：{}", userInfo);
//            return ResultInfo.error("修改失败");
//        }
//    }

    /**
     * 添加
     */
    @RequestMapping("/add")
    public ResultInfo add(@RequestBody HashMap map, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
        if(!userInfo.getCaozuoquanxian().equals("可修改")){
            return ResultInfo.error(401, "无权限,请联系管理员");
        }
        try {
            Dskh dskh = GsonUtil.toEntity(gsonUtil.get("addInfo"), Dskh.class);
            dskh = dskhService.add(dskh);
            if (StringUtils.isNotNull(dskh)) {
                return ResultInfo.success("添加成功", dskh);
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
        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
        List<Integer> idList = GsonUtil.toList(gsonUtil.get("idList"), Integer.class);
        if(!userInfo.getCaozuoquanxian().equals("可修改")){
            return ResultInfo.error(401, "无权限,请联系管理员");
        }
        try {
            for(int i=0; i<idList.size(); i++){
                int this_id = idList.get(i);
                dskhService.delete(Collections.singletonList(this_id));
            }
            return ResultInfo.success("删除成功", idList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("删除失败：{}", e.getMessage());
            log.error("参数：{}", idList);
            return ResultInfo.error("删除失败");
        }
    }

    /**
     * 添加
     */
//    @RequestMapping("/addCzqx")
//    public ResultInfo addCzqx(@RequestBody HashMap map, HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
//        if(!userInfo.getCaozuoquanxian().equals("可修改")){
//            return ResultInfo.error(401, "无权限");
//        }
//        try {
//            Dskh dskh = GsonUtil.toEntity(gsonUtil.get("addInfo"), Dskh.class);
//            dskh = dskhService.addCzqx(dskh);
//            if (StringUtils.isNotNull(dskh)) {
//                return ResultInfo.success("添加成功", dskh);
//            } else {
//                return ResultInfo.success("添加失败", null);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("添加失败：{}", e.getMessage());
//            log.error("参数：{}", map);
//            return ResultInfo.error("添加失败");
//        }
//    }

}