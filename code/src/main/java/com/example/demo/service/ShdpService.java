package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.example.demo.entity.Shdp;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author hui
 * @date 2024/8/7 18:35
 */
@Service
public interface ShdpService extends IService<Shdp> {
    List<Shdp> getList();

    int count1();

//    void add(String riqi,String dh,String kddh,String shdwjjsr,String shdw,String sfyj,String fkfs,String sfhs,String sd,String zdr,String kdf,String bzld);

    void add(String riqi,String dh,String kddh,String shdw,String sfyj,String fkfs,String sfhs,String sd,String zdr,String kdf,String bzld);

//    boolean update(String mc, String mh, String gg, String js, String zl, String dj, String je, String bz, String shdz, String gd, String jgf, String hsdj, String whsdj, String hjje, String hjzl, int id);

    boolean update(String mc, String mh, String gg, String zl, String dj, String je, String bz, String shdz, String gd, String jgf, String hsdj, String whsdj, String hjje, String hjzl, int id);
    void delete();



    String getriqi(int id);

    String getdh(int id);

    String getshdw(int id);

    String getfkfs(int id);

    String getsfhs(int id);

    String getkdf(int id);

    String getsd(int id);


    String getkddh(int id);

    String getshdwjjsr(int id);

    String getsfyj(int id);
    String getbzld(int id);
//    void add1(String riqi, String dh, String shdw, String mc, String mh, String gg, String js
//            , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
//              String zdr, String shdwjjsr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
//              String bzld, String hjzl);
void add1(String riqi, String dh, String shdw, String mc, String mh, String gg
        , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
          String zdr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
          String bzld, String hjzl);

}
