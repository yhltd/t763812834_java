package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Yh;
import com.example.demo.mapper.YhMapper;
import com.example.demo.service.YhService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class YhImpl extends ServiceImpl<YhMapper, Yh> implements YhService {
    @Autowired
    YhMapper yhMapper;

    @Override
    public List<Yh> getList() {
        return yhMapper.getList();
    }

    @Override
    public List<Yh> queryList(String ksrq,String jsrq) {
        return yhMapper.queryList(ksrq,jsrq);
    }

    @Override
    public boolean update(Yh yh) { return updateById(yh); }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

    @Override
    public Yh add(Yh yh) { return save(yh) ? yh : null; }

}
