package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Ft;
import com.example.demo.entity.Yh;
import com.example.demo.mapper.FtMapper;
import com.example.demo.mapper.YhMapper;
import com.example.demo.service.FtService;
import com.example.demo.service.YhService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FtImpl extends ServiceImpl<FtMapper, Ft> implements FtService {
    @Autowired
    FtMapper ftMapper;

    @Override
    public List<Ft> getList() {
        return ftMapper.getList();
    }

    @Override
    public List<Ft> queryList(String ksrq,String jsrq,String khmc) {
        return ftMapper.queryList(ksrq,jsrq,khmc);
    }

    @Override
    public boolean update(Ft ft) { return updateById(ft); }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

    @Override
    public Ft add(Ft ft) { return save(ft) ? ft : null; }

}
