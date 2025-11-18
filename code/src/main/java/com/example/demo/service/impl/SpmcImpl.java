package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Rk;
import com.example.demo.entity.Spmc;
import com.example.demo.mapper.RkMapper;
import com.example.demo.mapper.SpmcMapper;
import com.example.demo.service.RkService;
import com.example.demo.service.SpmcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpmcImpl extends ServiceImpl<SpmcMapper, Spmc> implements SpmcService {
    @Autowired
   SpmcMapper spmcMapper;

    @Override
    public List<Spmc> getList() {
        return spmcMapper.getList();
    }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

    @Override
    public Spmc add(Spmc spmc) { return save(spmc) ? spmc : null; }


}
