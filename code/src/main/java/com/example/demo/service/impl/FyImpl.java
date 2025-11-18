package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Fy;
import com.example.demo.entity.Rk;
import com.example.demo.mapper.FyMapper;
import com.example.demo.mapper.RkMapper;
import com.example.demo.service.FyService;
import com.example.demo.service.RkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FyImpl extends ServiceImpl<FyMapper, Fy> implements FyService {
    @Autowired
    FyMapper fyMapper;

    @Override
    public List<Fy> getList() {
        return fyMapper.getList();
    }

    @Override
    public List<Fy> queryList(String ksrq,String jsrq) {
        return fyMapper.queryList(ksrq,jsrq);
    }

    @Override
    public boolean update(Fy fy) { return updateById(fy); }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

    @Override
    public Fy add(Fy fy) { return save(fy) ? fy : null; }

}
