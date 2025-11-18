package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Yssj;
import com.example.demo.entity.Zhbhs;
import com.example.demo.mapper.YssjMapper;
import com.example.demo.mapper.ZhbhsMapper;
import com.example.demo.service.YssjService;
import com.example.demo.service.ZhbhsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class YssjImpl extends ServiceImpl<YssjMapper, Yssj> implements YssjService {
    @Autowired
    YssjMapper yssjMapper;

    @Override
    public List<Yssj> getList() {
        return yssjMapper.getList();
    }

    @Override
    public List<Yssj> queryList(String ksrq,String jsrq) {
        return yssjMapper.queryList(ksrq,jsrq);
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
