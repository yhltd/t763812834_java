package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Dskh;
import com.example.demo.entity.Yh;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface YhMapper extends BaseMapper<Yh> {

    @Select("select * from yinhang")
    List<Yh> getList();

    @Select("select * from yinhang where riqi >= convert(date,#{ksrq}) and riqi <= convert(date,#{jsrq})")
    List<Yh> queryList(String ksrq,String jsrq);

    @Update("update yinhang set riqi = #{riqi},xssr = #{xssr},yssr = #{yssr},zxsr = #{zxsr},rkzc = #{rkzc},fyzc = #{fyzc} where id = #{id}")
    boolean update(String riqi,String xssr,String yssr,String zxsr,String rkzc,String fyzc,int id);

    @Delete("delete from yinhang where id=#{id}")
    boolean delete(int id);

    @Insert("insert into yinhang(riqi,xssr,yssr,zxsr,rkzc,fyzc) values(#{riqi},#{xssr},#{yssr},#{zxsr},#{rkzc},#{fyzc})")
    boolean add(String riqi,String xssr,String yssr,String zxsr,String rkzc,String fyzc);

}
