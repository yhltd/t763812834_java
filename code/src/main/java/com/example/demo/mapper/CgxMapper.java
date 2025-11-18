package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Cgx;
import com.example.demo.entity.Xsd;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface CgxMapper extends BaseMapper<Cgx> {

    @Select("select * from caogaoxiang order by riqi desc")
    List<Cgx> getList();

    @Select("select * from caogaoxiang where riqi >= convert(date,#{ksrq}) and riqi <= convert(date,#{jsrq})")
    List<Cgx> queryList(String ksrq, String jsrq);
//
//    @Update("update caogaoxiang set riqi = #{riqi},dh = #{dh},shdw = #{shdw},mc = #{mc},mh = #{mh},gg = #{gg},js = #{js},zl = #{zl},dj = #{dj},je = #{je},bz = #{bz},shdz = #{shdz},kddh = #{kddh},sfyj = #{sfyj},fkfs = #{fkfs},sfhs = #{sfhs},gd = #{gd},zdr = #{zdr},shdwjjsr = #{shdwjjsr},jgf = #{jgf},kdf = #{kdf},hsdj = #{hsdj},sd = #{sd},whsdj = #{whsdj},hjje=#{hjje},hjzl=#{hjzl} where id = #{id}")
//    boolean update(String riqi, String dh, String shdw, String mc, String mh, String gg, String js, String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd, String zdr, String shdwjjsr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje, String hjzl, int id);

    @Update("update caogaoxiang set riqi = #{riqi},dh = #{dh},shdw = #{shdw},mc = #{mc},mh = #{mh},gg = #{gg},zl = #{zl},dj = #{dj},je = #{je},bz = #{bz},shdz = #{shdz},kddh = #{kddh},sfyj = #{sfyj},fkfs = #{fkfs},sfhs = #{sfhs},gd = #{gd},zdr = #{zdr},jgf = #{jgf},kdf = #{kdf},hsdj = #{hsdj},sd = #{sd},whsdj = #{whsdj},hjje=#{hjje},hjzl=#{hjzl} where id = #{id}")
    boolean update(String riqi, String dh, String shdw, String mc, String mh, String gg, String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd, String zdr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje, String hjzl, int id);


    @Delete("delete from caogaoxiang where id=#{id}")
    boolean delete(int id);

//    @Insert("insert into caogaoxiang(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,hsdj, sd, whsdj, hjje, bzld, hjzl) values(#{riqi},#{dh},#{shdw},#{mc},#{mh},#{gg},#{js},#{zl},#{dj},#{je},#{bz},#{shdz},#{kddh},#{sfyj},#{fkfs},#{sfhs},#{gd},#{zdr},#{shdwjjsr},#{jgf},#{kdf},#{hsdj},#{sd},#{whsdj},#{hjje},#{bzld},#{hjzl})")
//    boolean add(String riqi, String dh, String shdw, String mc, String mh, String gg, String js
//            , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
//                String zdr, String shdwjjsr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
//                String bzld, String hjzl);

    @Insert("insert into caogaoxiang(riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf,hsdj, sd, whsdj, hjje, bzld, hjzl) values(#{riqi},#{dh},#{shdw},#{mc},#{mh},#{gg},#{zl},#{dj},#{je},#{bz},#{shdz},#{kddh},#{sfyj},#{fkfs},#{sfhs},#{gd},#{zdr},#{jgf},#{kdf},#{hsdj},#{sd},#{whsdj},#{hjje},#{bzld},#{hjzl})")
    boolean add(String riqi, String dh, String shdw, String mc, String mh, String gg, String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd, String zdr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje, String bzld, String hjzl);



    @Select("select * from caogaoxiang where shdw=#{shdw} and dh=#{dh} and riqi=#{riqi}")
    List<Cgx> getListByShdw(String shdw, String dh, String riqi);



    @Select("select * from caogaoxiang where dh=#{dh} order by riqi desc")
    List<Cgx> getListdh(String dh);

    @Delete("delete from caogaoxiang where dh=#{dh}")
    boolean delete1(String dh);

//    @Select("select DISTINCT dj from xiaoshoudan where riqi = convert(DATE,riqi)")
//    List<Cgx> getDj(String dj);

//    @Select("select * from xiaoshoudan where shdw=#{shdw} and dh=#{dh} and riqi=#{riqi}")
//    List<Cgx> getListByShdw(String shdw,String dh,String riqi);
}
