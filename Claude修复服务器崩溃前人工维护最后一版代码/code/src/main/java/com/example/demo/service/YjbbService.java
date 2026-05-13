package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Yjbb;
import com.example.demo.util.PageRequestDTO;
import com.example.demo.util.PageResult;

import java.util.List;

public interface YjbbService extends IService<Yjbb> {

    /**
     * 分页查询客户信息
     */
    PageResult<Yjbb> getYjbbPage(PageRequestDTO request);
    List<Yjbb> getfzr();
}