package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Qhd;
import com.example.demo.entity.Ysyf;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface QhdMapper extends BaseMapper<Qhd> {

    @Select("select * from qianhuidan order by bh desc")
    List<Qhd> getList();

//    @Select("select * from qianhuidan where riqi >= convert(date,#{ksrq}) and riqi <= convert(date,#{jsrq}) and gsm = #{gsm}")
//    List<Qhd> queryList(String ksrq,String jsrq,String gsm);
@Select("select * from qianhuidan where riqi >= convert(date,#{ksrq}) and riqi <= convert(date,#{jsrq}) and gsm like '%'+#{gsm}+'%'")
List<Qhd> queryList(String ksrq,String jsrq,String gsm);

    @Update("update qianhuidan set riqi = #{riqi},gsm = #{gsm},pm = #{pm},zl = #{zl},dj = #{dj},je = #{je} where id = #{id}")
    boolean update(String riqi,String gsm,String pm,String zl,String dj,String je,int id);

    @Delete("delete from qianhuidan where id=#{id}")
    boolean delete(int id);

//    @Insert("insert into qianhuidan(riqi,gsm,pm,zl,dj,je,ysyf) values(#{riqi},#{gsm},#{pm},#{zl},#{dj},#{je})")
//    boolean add(String riqi,String gsm,String pm,String zl,String dj,String je);

    @Insert("insert into qianhuidan(riqi,gsm,ysje,bz,bh,zys) values(#{riqi},#{gsm},#{ysje},#{bz},#{bh},#{zys})")
    boolean add1(String riqi,String gsm,String ysje,String bz,String bh,String zys);

}
