package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Caigou;


import java.util.List;

public interface CaigouService extends IService<Caigou> {

    List<Caigou> getyifang();
}
