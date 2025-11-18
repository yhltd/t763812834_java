package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Gyszl;
import com.example.demo.mapper.GyszlMapper;
import com.example.demo.service.GyszlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GyszlImpl extends ServiceImpl<GyszlMapper, Gyszl> implements GyszlService {
    @Autowired
    GyszlMapper gyszlMapper;

    @Override
    public List<Gyszl> getList() {
        return gyszlMapper.getList();
    }

    @Override
    public List<Gyszl> queryList(String gsm) {
        return gyszlMapper.queryList(gsm);
    }

    @Override
    public boolean update(Gyszl gyszl) { return updateById(gyszl); }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

    @Override
    public Gyszl add(Gyszl gyszl) { return save(gyszl) ? gyszl : null; }

}
