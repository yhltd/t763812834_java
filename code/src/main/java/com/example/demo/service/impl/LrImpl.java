package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Lr;
import com.example.demo.entity.Yh;
import com.example.demo.mapper.LrMapper;
import com.example.demo.mapper.YhMapper;
import com.example.demo.service.LrService;
import com.example.demo.service.YhService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LrImpl extends ServiceImpl<LrMapper, Lr> implements LrService {
    @Autowired
    LrMapper lrMapper;

    @Override
    public List<Lr> getList() {
        return lrMapper.getList();
    }

    @Override
    public List<Lr> queryList(String ksrq,String jsrq) {
        return lrMapper.queryList(ksrq,jsrq);
    }

    @Override
    public boolean update(Lr lr) { return updateById(lr); }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

    @Override
    public Lr add(Lr lr) { return save(lr) ? lr : null; }

}
