package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Gyszl;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface GyszlMapper extends BaseMapper<Gyszl> {

    @Select("select * from gongyingshangziliao")
    List<Gyszl> getList();

    @Select("select * from gongyingshangziliao where gsm like '%'+#{gsm}+'%'")
    List<Gyszl> queryList(String gsm);

    @Update("update gongyingshangziliao set gsm = #{gsm},tzkc = #{tzkc},tkkc = #{tkkc},yfje = #{yfje},sfyj = #{sfyj} where id = #{id}")
    boolean update(String gsm,String tzkc,String tkkc,String yfje,String sfyj,int id);

    @Delete("delete from gongyingshangziliao where id=#{id}")
    boolean delete(int id);

    @Insert("insert into gongyingshangziliao(gsm,tzkc,tkkc,yfje,sfyj) values(#{gsm},#{tzkc},#{tkkc},#{yfje},#{sjyj})")
    boolean add(String gsm,String tzkc,String tkkc,String yfje,String sfyj);

}
