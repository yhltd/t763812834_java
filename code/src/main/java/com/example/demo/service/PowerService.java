package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Power;

import java.util.List;

public interface PowerService extends IService<Power> {
    List<Power> getList();
}
