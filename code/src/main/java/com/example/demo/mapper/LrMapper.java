package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Lr;
import com.example.demo.entity.Yh;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface LrMapper extends BaseMapper<Lr> {

    @Select("select * from lirun")
    List<Lr> getList();

    @Select("select * from lirun where riqi >= convert(date,#{ksrq}) and riqi <= convert(date,#{jsrq})")
    List<Lr> queryList(String ksrq,String jsrq);

    @Update("update lirun set riqi = #{riqi},xslr = #{xslr},zxlr = #{zxlr},htlr = #{htlr} where id = #{id}")
    boolean update(String riqi,String xslr,String zxlr,String htlr,int id);

    @Delete("delete from lirun where id=#{id}")
    boolean delete(int id);

    @Insert("insert into lirun(riqi,xslr,zxlr,htlr) values(#{riqi},#{xslr},#{zxlr},#{htlr})")
    boolean add(String riqi,String xslr,String zxlr,String htlr);

}
