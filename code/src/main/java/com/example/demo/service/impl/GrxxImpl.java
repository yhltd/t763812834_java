package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Grxx;
import com.example.demo.entity.UserInfo;
import com.example.demo.mapper.GrxxMapper;
import com.example.demo.service.GrxxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GrxxImpl extends ServiceImpl<GrxxMapper, Grxx> implements GrxxService {
    @Autowired
    GrxxMapper grxxMapper;

    @Override
    public List<Grxx> queryList(String name) {
        return grxxMapper.queryList(name);
    }

    @Override
    public boolean update(Grxx grxx) { return updateById(grxx); }

    @Override
    public Grxx add(Grxx grxx) { return save(grxx) ? grxx : null; }

}
