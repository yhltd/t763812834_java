package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Kc;
import com.example.demo.entity.Khzl;
import com.example.demo.mapper.KcMapper;
import com.example.demo.service.KcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KcImpl extends ServiceImpl<KcMapper, Kc> implements KcService {
    @Autowired
    KcMapper kcMapper;

    @Override
    public List<Kc> getList() {
        return kcMapper.getList();
    }

    @Override
    public List<Kc> getList1() {
        return kcMapper.getList1();
    }
    @Override
    public List<Kc> getList2() {
        return kcMapper.getList2();
    }

    @Override
    public List<Kc> queryList(String ksrq, String jsrq,String mc) {
        return kcMapper.queryList(ksrq,jsrq,mc);
    }

    @Override
    public List<Kc> spmcList(String mc) {
        return kcMapper.spmcList(mc);
    }

    @Override
    public boolean update(Kc kc) {
        return updateById(kc);
    }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

    @Override
    public Kc add(Kc kc) {
        return save(kc) ? kc : null;
    }


    public List<Kc> hqxlMc() {
        return kcMapper.hqxlMc();
    }

}
