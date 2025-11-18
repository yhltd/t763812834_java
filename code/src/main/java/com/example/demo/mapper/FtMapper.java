package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Ft;
import com.example.demo.entity.Rk;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface FtMapper extends BaseMapper<Ft> {

    @Select("select * from feitong order by riqi desc")
    List<Ft> getList();

    @Select("select * from feitong where riqi >= convert(date,#{ksrq}) and riqi <= convert(date,#{jsrq}) and khmc like '%'+#{khmc}+'%'")
    List<Ft> queryList(String ksrq,String jsrq,String khmc);

    @Update("update feitong set riqi = #{riqi},fths = #{fths},ftcl = #{ftcl},khmc = #{khmc},khct = #{khct},khqt = #{khqt},zjkc = #{zjkc},ftlr = #{ftlr} where id = #{id}")
    boolean update(String riqi,String fths,String ftcl,String khmc,String khct,String khqt,String zjkc,String ftlr,int id);

    @Delete("delete from feitong where id=#{id}")
    boolean delete(int id);

    @Insert("insert into feitong(riqi,fths,ftcl,khmc,khct,khqt,zjkc,ftlr) values(#{riqi},#{fths},#{ftcl},#{khmc},#{khct},#{khqt},#{zjkc},#{ftlr})")
    boolean add(String riqi,String fths,String ftcl,String khmc,String khct,String khqt,String zjkc,String ftlr);

}
