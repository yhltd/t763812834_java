package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Mx;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface MxMapper extends BaseMapper<Mx> {
    @Select("select * from mingxi")
    List<Mx> getList();
    @Select("select * from mingxi where riqi >= convert(date,#{ksrq}) and riqi <= convert(date,#{jsrq}) and gsm like '%'+#{gsm}+'%'")
    List<Mx> queryList(String ksrq, String jsrq,String gsm);

    @Insert({"insert into mingxi(riqi,mc,rkzl,rksl,rkdj,zje,gsm,ziduan,danhao) " +
            "values(#{riqi},#{mc},#{rkzl},#{rksl},#{gsm},#{ziduan},#{danhao})"})
    boolean add(String mc,String rkzl,String rksl,String gsm,String ziduan,String danhao);

    @Insert("insert into mingxi(mc,js,je,zl,ziduan,danhao) values(#{mc},#{js},#{zl},#{je},#{ziduan},#{danhao})")
    boolean add1(String mc,String js,String zl,String je,String ziduan,String danhao);
    @Insert("insert into mingxi(mc,js,je,zl,ziduan,danhao) values(#{mc},#{js},#{zl},#{je},#{ziduan},#{danhao})")
    boolean add2(String mc,String js,String zl,String je,String ziduan,String danhao);
//    @Update("update mingxi set mc = #{mc},js = #{js},je = #{je},zl = #{zl} where danhao = #{danhao}")
//    boolean update(String mc,String js,String zl,String je,String danhao);

//    @Update("update mingxi set mc = #{mc},js = #{js},zl = #{zl},je = #{je},danhao = #{danhao} where id = #{id}")
//    boolean update1(String mc,String js,String zl,String je,String danhao,int id);

    @Delete("delete from mingxi where danhao=#{danhao}")
    boolean delete(String danhao);

//    @Delete("delete from mingxi where danhao=#{danhao}")
//    boolean deleteMingxi(String danhao);

    @Select("select * from mingxi where danhao=#{danhao}")
    List<Mx> queryListMingxi(String danhao);

    @Select("select * from mingxi where danhao=#{danhao}")
    List<Mx> queryListMingxi1(String danhao);

}
