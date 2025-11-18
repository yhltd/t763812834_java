package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Zbsj;
import com.example.demo.mapper.ZbsjMapper;
import com.example.demo.service.ZbsjService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZbsjImpl extends ServiceImpl<ZbsjMapper, Zbsj> implements ZbsjService {
    @Autowired
    ZbsjMapper zbsjMapper;

    @Override
    public List<Zbsj> getList() {
        return zbsjMapper.getList();
    }

    @Override
    public List<Zbsj> queryList(String ksrq,String jsrq) {
        return zbsjMapper.queryList(ksrq,jsrq);
    }
    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

}
