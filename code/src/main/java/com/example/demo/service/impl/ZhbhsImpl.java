package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Xsd;
import com.example.demo.entity.Zhbhs;
import com.example.demo.mapper.XsdMapper;
import com.example.demo.mapper.ZhbhsMapper;
import com.example.demo.service.XsdService;
import com.example.demo.service.ZhbhsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZhbhsImpl extends ServiceImpl<ZhbhsMapper, Zhbhs> implements ZhbhsService {
    @Autowired
    ZhbhsMapper zhbhsMapper;

    @Override
    public List<Zhbhs> getList() {
        return zhbhsMapper.getList();
    }

    @Override
    public List<Zhbhs> queryList(String ksrq,String jsrq) {
        return zhbhsMapper.queryList(ksrq,jsrq);
    }

//    @Override
//    public boolean update(Xsd xsd) { return updateById(xsd); }

//    @Override
//    public boolean delete(List<Integer> idList) {
//        return removeByIds(idList);
//    }

//    @Override
//    public Xsd add(Xsd xsd) { return save(xsd) ? xsd : null; }

//    @Override
//    public List<Xsd> getDj(String dj) {return xsdMapper.getDj(dj);}

//    @Override
//    public List<Xsd> getListByShdw(String shdw,String dh,String riqi) {
//        return xsdMapper.getListByShdw(shdw,dh,riqi);
//    }

}
