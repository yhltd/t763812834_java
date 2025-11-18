package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.UserInfo;
import com.example.demo.entity.Xsd;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface XsdMapper extends BaseMapper<Xsd> {

//    @Select("select distinct dh,riqi, shdw, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,hsdj, sd, whsdj, hjje, bzld, hjzl from xiaoshoudan order by riqi desc,dh desc")
//    List<Xsd> getList();
@Select("select distinct dh,riqi, shdw, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf,hsdj, sd, whsdj, hjje, bzld, hjzl from xiaoshoudan order by riqi desc,dh desc")
List<Xsd> getList();

//    @Insert("insert into xiaoshoudan(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,hsdj, sd, whsdj, hjje, bzld, hjzl) values(#{riqi},#{dh},#{shdw},#{mc},#{mh},#{gg},#{js},#{zl},#{dj},#{je},#{bz},#{shdz},#{kddh},#{sfyj},#{fkfs},#{sfhs},#{gd},#{zdr},#{shdwjjsr},#{jgf},#{kdf},#{hsdj},#{sd},#{whsdj},#{hjje},#{bzld},#{hjzl})")
//    boolean add(String riqi, String dh, String shdw, String mc, String mh, String gg, String js
//            , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
//                String zdr, String shdwjjsr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
//                String bzld, String hjzl);
@Insert("insert into xiaoshoudan(riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf,hsdj, sd, whsdj, hjje, bzld, hjzl) values(#{riqi},#{dh},#{shdw},#{mc},#{mh},#{gg},#{zl},#{dj},#{je},#{bz},#{shdz},#{kddh},#{sfyj},#{fkfs},#{sfhs},#{gd},#{zdr},#{jgf},#{kdf},#{hsdj},#{sd},#{whsdj},#{hjje},#{bzld},#{hjzl})")
boolean add(String riqi, String dh, String shdw, String mc, String mh, String gg
        , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
            String zdr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
            String bzld, String hjzl);

//    @Select("select * from xiaoshoudan where riqi >= convert(date,#{ksrq}) and riqi <= convert(date,#{jsrq}) and shdw = #{shdw}")
//    List<Xsd> queryList(String ksrq,String jsrq,String shdw);
@Select("select * from xiaoshoudan where riqi >= convert(date,#{ksrq}) and riqi <= convert(date,#{jsrq}) and shdw like '%'+#{shdw}+'%'")
List<Xsd> queryList(String ksrq,String jsrq,String shdw);

//    @Update("update xiaoshoudan set riqi = #{riqi},dh = #{dh},shdw = #{shdw},mc = #{mc},mh = #{mh},gg = #{gg},js = #{js},zl = #{zl},dj = #{dj},je = #{je},bz = #{bz},shdz = #{shdz},kddh = #{kddh},sfyj = #{sfyj},fkfs = #{fkfs},sfhs = #{sfhs},gd = #{gd},zdr = #{zdr},shdwjjsr = #{shdwjjsr},jgf = #{jgf},kdf = #{kdf},hsdj = #{hsdj},sd = #{sd},whsdj = #{whsdj} where id = #{id}")
//    boolean update(String riqi,String dh,String shdw,String mc,String mh,String gg,String js,String zl,String dj,String je,String bz,String shdz,String kddh,String sfyj,String fkfs,String sfhs,String gd,String zdr,String shdwjjsr,String jgf,String kdf,String hsdj,String sd,String whsdj,int id);
@Update("update xiaoshoudan set riqi = #{riqi},dh = #{dh},shdw = #{shdw},mc = #{mc},mh = #{mh},gg = #{gg},zl = #{zl},dj = #{dj},je = #{je},bz = #{bz},shdz = #{shdz},kddh = #{kddh},sfyj = #{sfyj},fkfs = #{fkfs},sfhs = #{sfhs},gd = #{gd},zdr = #{zdr},jgf = #{jgf},kdf = #{kdf},hsdj = #{hsdj},sd = #{sd},whsdj = #{whsdj} where id = #{id}")
boolean update(String riqi,String dh,String shdw,String mc,String mh,String gg,String zl,String dj,String je,String bz,String shdz,String kddh,String sfyj,String fkfs,String sfhs,String gd,String zdr,String jgf,String kdf,String hsdj,String sd,String whsdj,int id);
    @Delete("delete from xiaoshoudan where id=#{id}")
    boolean delete(int id);

//    @Insert("insert into xiaoshoudan(riqi,dh,shdw,mc,mh,gg,js,zl,dj,je,bz,shdz,kddh,sfyj,fkfs,sfhs,gd,zdr,shdwjjsr,jgf,kdf,hsdj,sd,whsdj) values(#{riqi},#{dh},#{shdw},#{mc},#{mh},#{gg},#{js},#{zl},#{dj},#{je},#{bz},#{shdz},#{kddh},#{sfyj},#{fkfs},#{sfhs},#{gd},#{zdr},#{shdwjjsr},#{jgf},#{kdf},#{hsdj},#{sd},#{whsdj})")
//    boolean add(String riqi,String dh,String shdw,String mc,String mh,String gg,String js,String zl,String dj,String je,String bz,String shdz,String kddh,String sfyj,String fkfs,String sfhs,String gd,String zdr,String shdwjjsr,String jgf,String kdf,String hsdj,String sd,String whsdj);

//    @Insert("insert into mingxi(dh,mc,js,je,zl,dj,ziduan) values(#{dh},#{mc},#{js},#{je},#{zl},#{dj},#{ziduan}")
//    boolean add1(String dh,String mc,String js,String je,String zl,String dj,String ziduan);
@Insert("insert into mingxi(dh,mc,je,zl,dj,ziduan) values(#{dh},#{mc},#{je},#{zl},#{dj},#{ziduan}")
boolean add1(String dh,String mc,String je,String zl,String dj,String ziduan);


    @Select("select DISTINCT dj from xiaoshoudan where riqi = convert(DATE,riqi)")
    List<Xsd> getDj(String dj);

    @Select("select * from xiaoshoudan where shdw=#{shdw} and dh=#{dh} and riqi=#{riqi}")
    List<Xsd> getListByShdw(String shdw,String dh,String riqi);

//    @Update("update mingxi set mc = #{mc},js = #{js},zl = #{zl},je = #{je},dj = #{dj} where danhao = #{danhao}")
//    boolean update2(String mc,String js,String zl,String je,String dj,String danhao);
@Update("update mingxi set mc = #{mc},zl = #{zl},je = #{je},dj = #{dj} where danhao = #{danhao}")
boolean update2(String mc,String zl,String je,String dj,String danhao);




    @Select("select * from xiaoshoudan where dh=#{dh}")
    List<Xsd> getList2(String dh);

    @Delete("delete from xiaoshoudan where dh=#{dh}")
    boolean delete1(String dh);

}
