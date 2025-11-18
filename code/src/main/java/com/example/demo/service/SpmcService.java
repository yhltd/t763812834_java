package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Rk;
import com.example.demo.entity.Spmc;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SpmcService extends IService<Spmc> {

    /**
     * 查询所有
     */
    List<Spmc> getList();

    boolean delete(List<Integer> idList);

    Spmc add(Spmc spmc);

}
