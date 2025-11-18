package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Kdgsdzd;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;
@Mapper
@Repository
public interface KdgsdzdMapper extends BaseMapper<Kdgsdzd> {

//    @Select("select kd.drriqi,xsd.riqi,kd.drkhmc,xsd.shdw as khmc,kd.drdsje,xsd.je as dsje,kd.drkddh,xsd.dh as kddh,kd.drkdf,xsd.kdf from xiaoshoudan as xsd,kuaidigongsiduizhangdan as kd")
//    List<Kdgsdzd> getList();

//    @Select("select * from kuaidigongsiduizhangdan ")
//    List<Kdgsdzd> getList();
@Select("select * from kuaidigongsiduizhangdan")
List<Kdgsdzd> getList();

//    @Select("select drriqi,drkhmc,drdsje,drkddh,drkdf from kuaidigongsiduizhangdan")
//    List<Kdgsdzd> getDrList();

//    @Select("select * from kuaidigongsiduizhangdan where drkhmc like '%'+#{drkhmc}+'%' and drkddh like '%''+#{drkddh}+%'")
//    List<Kdgsdzd> queryList(String drkhmc,String drkddh);
@Select("select * from kuaidigongsiduizhangdan where drkhmc like '%'+#{drkhmc}+'%' and drkddh like '%'+#{drkddh}+'%'")
List<Kdgsdzd> queryList(String drkhmc,String drkddh);


//    @Update("update kuaidigongsiduizhangdan set riqi = #{riqi},khmc = #{khmc},dsje = #{dsje},kddh = #{kddh},kdf = #{kdf} where id = #{id}")
//    boolean update(String riqi,String khmc,String dsje,String kddh,String kdf,int id);

    @Delete("delete from kuaidigongsiduizhangdan where id=#{id}")
    boolean delete(int id);

//    @Insert("insert into kuaidigongsiduizhangdan(riqi,khmc,dsje,kddh,ksd) values(#{riqi},#{khmc},#{dsje},#{kddh},#{kdf})")
//    boolean add(String riqi,String khmc,String dsje,String kddh,String kdf);

}
