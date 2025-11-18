package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Kdgsdzd;
import com.example.demo.mapper.KdgsdzdMapper;
import com.example.demo.service.KdgsdzdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KdgsdzdImpl extends ServiceImpl<KdgsdzdMapper, Kdgsdzd> implements KdgsdzdService {
    @Autowired
    KdgsdzdMapper kdgsdzdMapper;

    @Override
    public List<Kdgsdzd> getList() {
        return kdgsdzdMapper.getList();
    }

//    @Override
//    public List<Kdgsdzd> getDrList() {
//        return kdgsdzdMapper.getDrList();
//    }

    @Override
    public List<Kdgsdzd> queryList(String khmc,String kddh) {
        return kdgsdzdMapper.queryList(khmc,kddh);
    }

    @Override
    public boolean update(Kdgsdzd kdgsdzd) { return updateById(kdgsdzd); }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

    @Override
    public Kdgsdzd add(Kdgsdzd kdgsdzd) { return save(kdgsdzd) ? kdgsdzd : null; }

}
