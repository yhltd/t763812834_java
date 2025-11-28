package com.example.demo.controller;

import com.example.demo.entity.*;
import com.example.demo.service.CaigouService;
import com.example.demo.service.CgmxService;
import com.example.demo.service.YjbbService;
import com.example.demo.util.*;
import com.example.demo.util.Qxgl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/caigou")
public class CaigouController {

    @Autowired
    private CaigouService caigouService;
    @Autowired
    private CgmxService cgmxService;
    @PostMapping("/getyifang")
    public ResultInfo getyifang(HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        Qxgl userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), Qxgl.class);
        try {
            List<Caigou> getyifang = caigouService.getyifang();
            // 添加日志查看实际返回的内容
            log.info("返回结果: data大小={}", getyifang != null ? getyifang.size() : 0);
            return ResultInfo.success("获取成功", getyifang);

            // 添加日志查看实际返回的内容
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }

    @PostMapping("/saveCgmx")
    public Result<?> saveCgmx(@RequestBody Cgmx cgmx, HttpSession session) {
        try {

            boolean success = cgmxService.save(cgmx);
            if (success) {
                return Result.success("保存成功");
            } else {
                return Result.error("保存失败");
            }
        } catch (Exception e) {
            log.error("保存采购订单失败", e);
            return Result.error("保存失败: " + e.getMessage());
        }
    }





}