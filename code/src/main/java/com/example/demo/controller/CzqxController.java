package com.example.demo.controller;

import com.example.demo.entity.Czqx;
import com.example.demo.entity.UserInfo;
import com.example.demo.entity.Yh;
import com.example.demo.service.CzqxService;
import com.example.demo.service.YhService;
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
@RequestMapping("/czqx")
public class CzqxController {
    @Autowired
    private CzqxService czqxService;

    /**
     * 查询所有
     *
     * @return ResultInfo
     */
    @RequestMapping("/getList")
    public ResultInfo getList(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Czqx> getList = czqxService.getList();
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
    public ResultInfo queryList(String czr,String biao,String czqx, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Czqx> list = czqxService.queryList(czr,biao,czqx);
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
            return ResultInfo.error(401, "无权限");
        }
        Czqx czqx = null;
        try {
            czqx = DecodeUtil.decodeToJson(updateJson, Czqx.class);
            if (czqxService.update(czqx)) {
                return ResultInfo.success("修改成功", czqx);
            } else {
                return ResultInfo.success("修改失败", czqx);
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("修改失败：{}", e.getMessage());
//            log.error("参数：{}", userInfo);
            return ResultInfo.error("修改失败");
        }
    }

    /**
     * 添加
     */
    @RequestMapping("/add")
    public ResultInfo add(String czr,String biao,String czqx,String czid, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
//        if(!userInfo.getCaozuoquanxian().equals("可修改")){
//            return ResultInfo.error(401, "无权限");
//        }
        try {
            Czqx czqxa = new Czqx();
            czqxa.setCzr(czr);
            czqxa.setBiao(biao);
            czqxa.setCzqx(czqx);
            czqxa.setCzid(czid);
            czqxa = czqxService.add(czqxa);
            return ResultInfo.success("添加成功", czqxa);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("添加失败：{}", e.getMessage());
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
            return ResultInfo.error(401, "无权限");
        }
        try {
            for(int i=0; i<idList.size(); i++){
                int this_id = idList.get(i);
                czqxService.delete(Collections.singletonList(this_id));
            }
            return ResultInfo.success("删除成功", idList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("删除失败：{}", e.getMessage());
            log.error("参数：{}", idList);
            return ResultInfo.error("删除失败");
        }
    }

}