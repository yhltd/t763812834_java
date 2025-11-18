package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Mx;
import com.example.demo.mapper.MxMapper;
import com.example.demo.service.MxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MxImpl extends ServiceImpl<MxMapper, Mx> implements MxService {
    @Autowired
    MxMapper mxMapper;

    @Override
    public List<Mx> getList() {
        return mxMapper.getList();
    }

    @Override
    public List<Mx> queryList(String ksrq, String jsrq,String gsm) {
        return mxMapper.queryList(ksrq, jsrq,gsm);
    }

    @Override
    public Mx add(Mx mx) {
        return save(mx) ? mx : null;
    }

    @Override
    public boolean add1(String mc,String js,String zl,String je,String ziduan,String danhao) {
        return mxMapper.add1(mc,js,zl,je,ziduan,danhao);
    }
    @Override
    public Mx add2(Mx mx) {
        return save(mx) ? mx : null;
    }

//    @Override
//    public boolean update(String mc,String js,String zl,String je,String danhao) {
//        return mxMapper.update(mc,js,zl,je,danhao);
//    }
//    @Override
//    public boolean update(Mx mx) { return updateById(mx); }

    @Override
    public boolean update1(Mx mx) { return updateById(mx); }

    @Override
    public boolean update2(Mx mx) { return updateById(mx); }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

//    @Override
//    public boolean deleteMingxi(String danhao) {
//        return removeByIds(Collections.singleton(danhao));
//    }

    @Override
    public List<Mx> queryListMingxi(String danhao) {
        return mxMapper.queryListMingxi(danhao);
    }

    @Override
    public List<Mx> queryListMingxi1(String danhao) {
        return mxMapper.queryListMingxi1(danhao);
    }

}
