package com.example.demo.controller;

import com.example.demo.entity.UserInfo;
import com.example.demo.entity.Ysyf;
import com.example.demo.entity.Yszkmxb;
import com.example.demo.service.YsyfService;
import com.example.demo.service.YszkmxbService;
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
@RequestMapping("/yszkmxb")
public class YszkmxbController {
    @Autowired
    private YszkmxbService yszkmxbService;

    /**
     * 查询所有
     *
     * @return ResultInfo
     */
    @RequestMapping("/getList")
    public ResultInfo getList(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Yszkmxb> getList = yszkmxbService.getList();
            return ResultInfo.success("获取成功", getList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }
    @RequestMapping("/getList1")
    public ResultInfo getList1(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Yszkmxb> getList= yszkmxbService.getList1();
            return ResultInfo.success("获取成功", getList);
          //查找getList2，并根据getList2查出结果插入到update里
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }
    @RequestMapping("/getList2")
    public ResultInfo getList2(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Yszkmxb> getList = yszkmxbService.getList2();
            return ResultInfo.success("获取成功", getList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }
    @RequestMapping("/add")
    public ResultInfo add(@RequestBody HashMap map, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));

        try {
            Yszkmxb yszkmxb = GsonUtil.toEntity(gsonUtil.get("addInfo"), Yszkmxb.class);
            yszkmxb = yszkmxbService.add(yszkmxb);
            if (StringUtils.isNotNull(yszkmxb)) {
                return ResultInfo.success("添加成功", yszkmxb);
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

    @RequestMapping("/delete")
    public void delete() {
               yszkmxbService.delete();
    }
    @RequestMapping("/update")
    public ResultInfo update(HttpSession session,String yf1,String yf2,String yf3,String yf4,String yf5,String yf6,String yf7,String yf8,String yf9,String yf10,String yf11,String yf12,String bnysje,String gsm,String nian) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            yszkmxbService.update(yf1,yf2,yf3,yf4,yf5,yf6,yf7,yf8,yf9,yf10,yf11,yf12,bnysje,gsm,nian);
            return ResultInfo.success("获取成功",null);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }

}

