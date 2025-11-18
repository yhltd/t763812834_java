package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Kc;
import com.example.demo.entity.Qc;
import com.example.demo.mapper.KcMapper;
import com.example.demo.mapper.QcMapper;
import com.example.demo.service.KcService;
import com.example.demo.service.QcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QcImpl extends ServiceImpl<QcMapper, Qc> implements QcService {
    @Autowired
    QcMapper qcMapper;

    @Override
    public List<Qc> getList() {
        return qcMapper.getList();
    }

    @Override
    public List<Qc> queryList(String ksrq, String jsrq) {
        return qcMapper.queryList(ksrq, jsrq);
    }

    @Override
    public List<Qc> mcList(String spmc) {
        return qcMapper.mcList(spmc);
    }

    @Override
    public boolean update(Qc qc) {
        return updateById(qc);
    }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

    @Override
    public Qc add(Qc qc) {
        return save(qc) ? qc : null;
    }
}
