package com.example.demo.controller;


import com.example.demo.entity.Yjbb;
import com.example.demo.service.YjbbService;
import com.example.demo.util.*;
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
@RequestMapping("/yjbb")
public class YjbbController {

    @Autowired
    private YjbbService yjbbService;

    /**
     * 分页查询客户信息
     */
    @PostMapping("/list")
    public Result<PageResult<Yjbb>> getYjbbList(@RequestBody PageRequestDTO request) {
        try {
            log.info("分页查询业绩报表，页码: {}, 页大小: {}, 关键词: {}",
                    request.getPageNum(), request.getPageSize(), request.getKeyword());

            PageResult<Yjbb> result = yjbbService.getYjbbPage(request);
            return Result.success(result);
        } catch (Exception e) {
            log.error("查询业绩报表失败", e);
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    @PostMapping("/getfzr")
    public Qxgl gefzr(HttpSession session) {
        try {
            List<Yjbb> getfzr = yjbbService.getfzr();
            return Qxgl.success("获取成功", getfzr);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return Qxgl.error("错误!");
        }
    }

}