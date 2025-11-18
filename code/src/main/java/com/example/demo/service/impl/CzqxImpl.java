package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Czqx;
import com.example.demo.entity.Yh;
import com.example.demo.mapper.CzqxMapper;
import com.example.demo.mapper.YhMapper;
import com.example.demo.service.CzqxService;
import com.example.demo.service.YhService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CzqxImpl extends ServiceImpl<CzqxMapper, Czqx> implements CzqxService {
    @Autowired
    CzqxMapper czqxMapper;

    @Override
    public List<Czqx> getList() {
        return czqxMapper.getList();
    }

    @Override
    public List<Czqx> queryList(String czr,String biao,String czqx) {return czqxMapper.queryList(czr,biao,czqx);}

    @Override
    public boolean update(Czqx czqx) { return updateById(czqx); }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

    @Override
    public Czqx add(Czqx czqx) { return save(czqx) ? czqx : null; }

}
