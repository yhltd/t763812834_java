package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Rk;
import com.example.demo.entity.Shdp;
import com.example.demo.mapper.ShdpMapper;
import com.example.demo.service.ShdpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author hui
 * @date 2024/8/8 9:26
 */
@Service
public class ShdpImpl extends ServiceImpl<ShdpMapper, Shdp> implements ShdpService {
    @Autowired
    ShdpMapper shdpMapper;

    @Override
    public List<Shdp> getList() {
        return shdpMapper.getList();
    }

    @Override
    public int count1() {
        return shdpMapper.count1();
    }
//    @Override
//    public void add(String riqi,String dh,String kddh,String shdwjjsr,String shdw,String sfyj,String fkfs,String sfhs,String sd,String zdr,String kdf,String bzld) { shdpMapper.add(riqi,dh,kddh,shdwjjsr,shdw,sfyj,fkfs,sfhs,sd,zdr,kdf,bzld); }

    @Override
    public void add(String riqi,String dh,String kddh,String shdw,String sfyj,String fkfs,String sfhs,String sd,String zdr,String kdf,String bzld) { shdpMapper.add(riqi,dh,kddh,shdw,sfyj,fkfs,sfhs,sd,zdr,kdf,bzld); }

//    @Override
//    public boolean update(String mc, String mh, String gg, String js, String zl, String dj, String je, String bz, String shdz, String gd, String jgf, String hsdj, String whsdj, String hjje, String hjzl, int id) {
//        return shdpMapper.update(mc,mh,gg,js,zl,dj,je,bz,shdz,gd,jgf,hsdj,whsdj,hjje,hjzl,id);
//    }
@Override
public boolean update(String mc, String mh, String gg, String zl, String dj, String je, String bz, String shdz, String gd, String jgf, String hsdj, String whsdj, String hjje, String hjzl, int id) {
    return shdpMapper.update(mc,mh,gg,zl,dj,je,bz,shdz,gd,jgf,hsdj,whsdj,hjje,hjzl,id); }
    @Override
    public void delete() {
        shdpMapper.delete();
    }


    @Override
    public String getriqi(int id) {
        return shdpMapper.getriqi(id);
    }

    @Override
    public String getdh(int id) {
        return shdpMapper.getdh(id);
    }

    @Override
    public String getshdw(int id) {
        return shdpMapper.getshdw(id);
    }

    @Override
    public String getfkfs(int id) {
        return shdpMapper.getfkfs(id);
    }

    @Override
    public String getsfhs(int id) {
        return shdpMapper.getsfhs(id);
    }

    @Override
    public String getkdf(int id) {
        return shdpMapper.getkdf(id);
    }

    @Override
    public String getsd(int id) {
        return shdpMapper.getsd(id);
    }

    @Override
    public String getkddh(int id) {
        return shdpMapper.getkddh(id);
    }

    @Override
    public String getshdwjjsr(int id) {
        return shdpMapper.getshdwjjsr(id);
    }

    @Override
    public String getsfyj(int id) {
        return shdpMapper.getsfyj(id);
    }

    @Override
    public String getbzld(int id) {
        return shdpMapper.getbzld(id);
    }
//
//    @Override
//    public void add1(String riqi, String dh, String shdw, String mc, String mh, String gg, String js, String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd, String zdr, String shdwjjsr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje, String bzld, String hjzl) {
//        shdpMapper.add1(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,
//                hsdj, sd, whsdj, hjje, bzld, hjzl);
//    }
@Override
public void add1(String riqi, String dh, String shdw, String mc, String mh, String gg, String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd, String zdr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje, String bzld, String hjzl) {
    shdpMapper.add1(riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf, hsdj, sd, whsdj, hjje, bzld, hjzl); }


}
