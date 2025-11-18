package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Rk;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface RkMapper extends BaseMapper<Rk> {

    @Select("select * from ruku")
    List<Rk> getList();

    @Select("select * from ruku where riqi >= convert(date,#{ksrq}) and riqi <= convert(date,#{jsrq}) and mc like '%'+#{mc}+'%'")
    List<Rk> queryList(String ksrq, String jsrq,String mc);

    @Update("update ruku set riqi=#{riqi},gsm=#{gsm},gys=#{gys},mc=#{mc},rksl=#{sl},rkdj=#{rkdj},rkzl=#{rkzl},zje=#{zje},fkfs=#{fkfs} where id = #{id}")
    boolean update(String riqi, String gsm,String gys, String mc, String rksl, String rkdj, String rkzl, String zje, String fkfs, int id);

    @Delete("delete from ruku where id=#{id}")
    boolean delete(int id);

    @Insert("insert into ruku(riqi,gsm,gys,mc,rksl,rkdj,rkzl,zje,fkfs,danhao) values(#{riqi},#{gsm},#{gys},#{mc},#{rksl},#{rkdj},#{rkzl},#{zje},#{fkfs},#{danhao})")
    boolean add(String riqi, String gsm, String gys,String mc, String rksl, String rkdj, String rkzl, String zje, String fkfs,String danhao);


    //@Select("select ((select SUM(cast(zje as FLOAT)) from ruku where riqi = CAST(DATEADD(day,-1,GETDATE()) as date))-(select SUM(cast(rkzl as FLOAT)) from xiaoshoudan where riqi = CAST(GETDATE() AS DATE))*(select round(sum(cast(sl AS FLOAT)) / sum(cast(zje AS FLOAT)),2) from ruku where riqi = CAST(DATEADD(day,-1,GETDATE()) as date))-(select round((SELECT SUM(cast(zje AS FLOAT)) FROM ruku WHERE riqi = CAST(GETDATE() AS DATE)) / (SELECT SUM(cast(rkzl AS FLOAT)) FROM ruku WHERE riqi = CAST(DATEADD(day,-1,GETDATE()) as DATE)),2))-(select sum(cast(rkzl AS FLOAT)) from xiaoshoudan where riqi = CAST(GETDATE() as date))+(select sum(cast(rkzl AS FLOAT)) from ruku where riqi = CAST(GETDATE() as date)))")
    @Select("select (select SUM(convert(float,zje)) as zje from ruku where riqi = CAST(DATEADD(day,-1,GETDATE()) as date))-(select SUM(convert(float,rkzl)) as rkzl from xiaoshoudan where riqi = convert(date,GETDATE()))*(select round(sum(convert(float,rksl))/sum(convert(float,zje)),2) as cs from ruku where riqi = CAST(DATEADD(day,-1,GETDATE()) as date))-(SELECT round((SELECT SUM(convert(float,zje)) FROM ruku WHERE riqi = convert(date,GETDATE()))/(SELECT SUM(convert(float,rkzl)) FROM ruku WHERE riqi = CAST(DATEADD(day,-1,GETDATE()) as DATE)),2) as cs)-(select sum(convert(float,rkzl)) as rkzl from xiaoshoudan where riqi = convert(date,GETDATE()))+(select sum(convert(float,rkzl)) as rkzl from ruku where riqi = convert(date,GETDATE()))kcjj")
    List<Rk> getKcjj();

//    @Update("update mingxi set mc = #{mc},js = #{js},zl = #{zl},je = #{je} where danhao = #{danhao}")
//    boolean update1(String mc,String js,String zl,String je,String danhao);

    @Update("update mingxi set mc = #{mc},rksl = #{rksl},rkzl = #{rkzl},zje = #{zje} where danhao = #{danhao}")
    boolean update1(String mc,String rksl,String rkzl,String zje,String danhao);

}
