package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Czqx;
import com.example.demo.entity.Yh;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface CzqxMapper extends BaseMapper<Czqx> {

    @Select("select * from caozuoquanxian")
    List<Czqx> getList();

    @Select("select * from caozuoquanxian where czr = #{czr} and biao = #{biao} and czqx = #{czqx})")
    List<Czqx> queryList(String czr,String biao,String czqx);

    @Update("update caozuoquanxian set czr = #{czr},biao = #{biao},czqx = #{czqx},sfyx = #{sfyx} where id = #{id}")
    boolean update(String czr,String biao,String czqx,String sfyx,int id);

    @Delete("delete from caozuoquanxian where id=#{id}")
    boolean delete(int id);

    @Insert("insert into caozuoquanxian(czr,biao,czqx,czid) values(#{czr},#{biao},#{czqx},#{czid})")
    boolean add(String czr,String biao,String czqx,String czid);

}
