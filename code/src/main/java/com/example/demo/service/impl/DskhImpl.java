package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Dskh;
import com.example.demo.mapper.DskhMapper;
import com.example.demo.service.DskhService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DskhImpl extends ServiceImpl<DskhMapper, Dskh> implements DskhService {
    @Autowired
    DskhMapper dskhMapper;

    @Override
    public List<Dskh> getList() {
        return dskhMapper.getList();
    }

    @Override
    public List<Dskh> queryList(String khmc,String kddh) {
        return dskhMapper.queryList(khmc,kddh);
    }

    @Override
    public boolean update(Dskh dskh) { return updateById(dskh); }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

    @Override
    public Dskh add(Dskh dskh) { return save(dskh) ? dskh : null; }

//    @Override
//    public Dskh addCzqx(Dskh dskh) { return save(dskh) ? dskh : null; }

}
