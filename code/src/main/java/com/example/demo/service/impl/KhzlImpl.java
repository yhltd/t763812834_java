package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Khzl;
import com.example.demo.entity.UserInfo;
import com.example.demo.mapper.KhzlMapper;
import com.example.demo.service.KhzlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KhzlImpl extends ServiceImpl<KhzlMapper, Khzl> implements KhzlService {
    @Autowired
    KhzlMapper khzlMapper;

    @Override
    public List<Khzl> getList() {
        return khzlMapper.getList();
    }

    @Override
    public List<Khzl> queryList(String gsm) {
        return khzlMapper.queryList(gsm);
    }

    @Override
    public boolean update(Khzl khzl) { return updateById(khzl); }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

    @Override
    public Khzl add(Khzl khzl) { return save(khzl) ? khzl : null; }

    @Override
    public List<Khzl> hqxlGsm() {return khzlMapper.hqxlGsm();}

//    @Override
//    public String hqgd(String shdw) {return khzlMapper.hqgd(shdw);}
@Override
public String hqgd(String shdw) {return khzlMapper.hqgd(shdw); }

    @Override
    public List<Khzl> getListByGsm(String gsm) {return khzlMapper.getListByGsm(gsm);}

    @Override
    public boolean tkkc(String tkkc,String gsm) { return khzlMapper.tkkc(tkkc,gsm); }

    @Override
    public boolean tzkc(String tzkc,String gsm) { return khzlMapper.tzkc(tzkc,gsm); }

    @Override
    public String gettkkc(String gsm) {
        return khzlMapper.gettkkc(gsm);
    }

    @Override
    public String gettzkc(String gsm) {
        return khzlMapper.gettzkc(gsm);
    }

    @Override
    public String hqdz(String shdw) {
        return khzlMapper.hqdz(shdw);
    }

    @Override
    public String getysje(String fuzhu) {
        return khzlMapper.getysje(fuzhu);
    }

    @Override
    public boolean upysje(String ysje,String fuzhu) {
        return khzlMapper.upysje(ysje,fuzhu);
    }
}
