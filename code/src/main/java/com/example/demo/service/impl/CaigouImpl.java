package com.example.demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.example.demo.entity.Caigou;


import com.example.demo.entity.Scgd;
import com.example.demo.entity.Yjbb;
import com.example.demo.mapper.CaigouMapper;

import com.example.demo.mapper.YjbbMapper;
import com.example.demo.service.CaigouService;

import com.example.demo.service.YjbbService;
import com.example.demo.util.PageRequestDTO;
import com.example.demo.util.PageResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;


import java.util.List;
@Slf4j
@Service
public class CaigouImpl extends ServiceImpl<CaigouMapper, Caigou> implements CaigouService {
    @Autowired
    CaigouMapper CaigouMapper;

    @Override
    public List<Caigou> getyifang() {
        return CaigouMapper.getyifang();
    }


}