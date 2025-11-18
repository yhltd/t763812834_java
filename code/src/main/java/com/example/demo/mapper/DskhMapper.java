package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Dskh;
import com.example.demo.entity.Khzl;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface DskhMapper extends BaseMapper<Dskh> {

    @Select("select * from daishoukehu")
    List<Dskh> getList();


    @Select("select * from daishoukehu where khmc like '%'+#{khmc}+'%' and kddh like '%'+#{kddh}+'%'")
    List<Dskh> queryList(String khmc,String kddh);

//    @Select("select * from daishoukehu where khmc like '%'+#{khmc}+'%' and kddh like '%''+#{kddh}+%'")
//    List<Dskh> queryList(String khmc,String kddh);

    @Update("update daishoukehu set riqi = #{riqi},khmc = #{khmc},dsje = #{dsje},kddh = #{kddh} where id = #{id}")
    boolean update(String riqi,String khmc,String dsje,String kddh,int id);

    @Delete("delete from daishoukehu where id=#{id}")
    boolean delete(int id);

    @Insert("insert into daishoukehu(riqi,khmc,dsje,kddh) values(#{riqi},#{khmc},#{dsje},#{kddh})")
    boolean add(String riqi,String khmc,String dsje,String kddh);

//    @Insert("insert into caozuoquanxian(czr,biao,czqx,czid) values(#{czr},#{biao},#{czqx},#{czid})")
//    boolean addCzqx(String czr,String biao,String czqx,String czid);

}
