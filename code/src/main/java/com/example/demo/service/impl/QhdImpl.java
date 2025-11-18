package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Qhd;
import com.example.demo.entity.Ysyf;
import com.example.demo.mapper.QhdMapper;
import com.example.demo.mapper.YsyfMapper;
import com.example.demo.service.QhdService;
import com.example.demo.service.YsyfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QhdImpl extends ServiceImpl<QhdMapper, Qhd> implements QhdService {
    @Autowired
    QhdMapper qhdMapper;

    @Override
    public List<Qhd> getList() {return qhdMapper.getList();}

    @Override
    public List<Qhd> queryList(String ksrq,String jsrq,String gsm) {
        return qhdMapper.queryList(ksrq,jsrq,gsm);
    }

    @Override
    public boolean update(Qhd qhd) { return updateById(qhd); }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

//    @Override
//    public Qhd add(Qhd qhd) { return save(qhd) ? qhd : null; }

    @Override
    public boolean add1(String riqi,String gsm,String ysje,String bz,String bh,String zys) { return qhdMapper.add1(riqi,gsm,ysje,bz,bh,zys); }
}
