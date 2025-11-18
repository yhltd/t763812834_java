package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.UserInfo;
import com.example.demo.entity.Xsd;
import com.example.demo.mapper.XsdMapper;
import com.example.demo.service.XsdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class XsdImpl extends ServiceImpl<XsdMapper, Xsd> implements XsdService {
    @Autowired
    XsdMapper xsdMapper;

    @Override
    public List<Xsd> getList() {
        return xsdMapper.getList();
    }

    @Override
    public List<Xsd> queryList(String ksrq,String jsrq,String shdw) {
        return xsdMapper.queryList(ksrq,jsrq,shdw);
    }

//    @Override
//    public boolean update(String riqi,String dh,String shdw,String mc,String mh,String gg,String js,String zl,String dj,String je,String bz,String shdz,String kddh,String sfyj,String fkfs,String sfhs,String gd,String zdr,String shdwjjsr,String jgf,String kdf,String hsdj,String sd,String whsdj,int id)
//    { return xsdMapper.update( riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf, hsdj, sd, whsdj,id); }

    @Override
    public boolean update(String riqi,String dh,String shdw,String mc,String mh,String gg,String zl,String dj,String je,String bz,String shdz,String kddh,String sfyj,String fkfs,String sfhs,String gd,String zdr,String jgf,String kdf,String hsdj,String sd,String whsdj,int id) {
        return xsdMapper.update( riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf, hsdj, sd, whsdj,id); }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

//    @Override
//    public Xsd add(Xsd xsd) { return save(xsd) ? xsd : null; }

//    @Override
//    public Xsd add1(Xsd xsd) {
//        return null;
//    }

//    @Override
//    public boolean add2(String riqi,String dh,String shdw,String mc,String mh,String gg,String js,String zl,String dj,String je,String bz,String shdz,String kddh,String sfyj,String fkfs,String sfhs,String gd,
//                     String zdr,String shdwjjsr ,String jgf,String kdf,String hsdj,String sd,String whsdj,String hjje,String bzld,
//                     String hjzl) { return xsdMapper.add2(riqi,dh,shdw,mc,mh,gg,js,zl,dj,je,bz,shdz,kddh,sfyj,fkfs,sfhs,gd,zdr,shdwjjsr,jgf,kdf,
//            hsdj,sd,whsdj,hjje,bzld,hjzl); }

//    @Override
//    public boolean add(String riqi, String dh, String shdw, String mc, String mh, String gg, String js
//            , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
//                       String zdr, String shdwjjsr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
//                       String bzld, String hjzl) {
//        return xsdMapper.add(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,
//                hsdj, sd, whsdj, hjje, bzld, hjzl);
//    }
@Override
public boolean add(String riqi, String dh, String shdw, String mc, String mh, String gg
        , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
                   String zdr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
                   String bzld, String hjzl) {
    return xsdMapper.add(riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf,
            hsdj, sd, whsdj, hjje, bzld, hjzl); }

    @Override
    public List<Xsd> getList2(String dh) {
        return xsdMapper.getList2(dh);
    }


    @Override
    public List<Xsd> getDj(String dj) {return xsdMapper.getDj(dj);}

    @Override
    public List<Xsd> getListByShdw(String shdw,String dh,String riqi) {
        return xsdMapper.getListByShdw(shdw,dh,riqi);
    }

    @Override
    public boolean update2(Xsd xsd) { return updateById(xsd); }

    @Override
    public boolean delete1(String dh) {
        return xsdMapper.delete1(dh);
    }

}
