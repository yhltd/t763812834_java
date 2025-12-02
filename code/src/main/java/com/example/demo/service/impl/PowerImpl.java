package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Power;
import com.example.demo.mapper.PowerMapper;
import com.example.demo.service.PowerService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PowerImpl extends ServiceImpl<PowerMapper, Power> implements PowerService {

    @Override
    public List<Power> getList(){
        return baseMapper.getList();
    }
}
