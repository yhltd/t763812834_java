package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Cgx;
import com.example.demo.entity.Xsd;
import com.example.demo.mapper.CgxMapper;
import com.example.demo.mapper.XsdMapper;
import com.example.demo.service.CgxService;
import com.example.demo.service.XsdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CgxImpl extends ServiceImpl<CgxMapper, Cgx> implements CgxService {
    @Autowired
    CgxMapper cgxMapper;

    @Override
    public List<Cgx> getList() {
        return cgxMapper.getList();
    }

    @Override
    public List<Cgx> queryList(String ksrq, String jsrq) {
        return cgxMapper.queryList(ksrq, jsrq);
    }

    @Override
    public boolean update(Cgx cgx) {
        return updateById(cgx);
    }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

    @Override
    public List<Cgx> getListByShdw(String shdw, String dh, String riqi) {
        return cgxMapper.getListByShdw(shdw, dh, riqi);
    }

//    @Override
//    public boolean add(String riqi, String dh, String shdw, String mc, String mh, String gg, String js
//            , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
//                       String zdr, String shdwjjsr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
//                       String bzld, String hjzl) {
//        return cgxMapper.add(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,
//                hsdj, sd, whsdj, hjje, bzld, hjzl);
//    }
@Override
public boolean add(String riqi, String dh, String shdw, String mc, String mh, String gg, String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd, String zdr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje, String bzld, String hjzl) {
    return cgxMapper.add(riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf, hsdj, sd, whsdj, hjje, bzld, hjzl); }
    @Override
    public List<Cgx> getListdh(String dh) {
        return cgxMapper.getListdh(dh);
    }

    @Override
    public boolean delete1(String dh) {
        return cgxMapper.delete1(dh);
    }

//    @Override
//    public List<Cgx> getDj(String dj) {return cgxMapper.getDj(dj);}

//    @Override
//    public List<Cgx> getListByShdw(String shdw,String dh,String riqi) {
//        return cgxMapper.getListByShdw(shdw,dh,riqi);
//    }

}
