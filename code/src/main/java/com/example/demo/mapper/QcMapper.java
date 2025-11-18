package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Kc;
import com.example.demo.entity.Qc;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;
@Mapper
@Repository
public interface QcMapper extends BaseMapper<Qc> {
    @Select("select * from qichu")
    List<Qc> getList();

    @Select("select * from qichu where riqi >= convert(date,#{ksrq}) and riqi <= convert(date,#{jsrq})")
    List<Qc> queryList(String ksrq, String jsrq);

    @Select("select * from qichu where spmc= #{spmc})")
    List<Qc> mcList(String spmc);

    @Update("update qichu set riqi = #{riqi},spmc = #{spmc},qcsl= #{qcsl},qcdj = #{qcdj},qczje = #{qczje} where id = #{id}")
    boolean update(String riqi,String spmc,String qcsl,String qcdj,String qczje,int id);

    @Delete("delete from qichu where id=#{id}")
    boolean delete(int id);

    @Insert("insert into qichu(riqi,spmc,qcsl,qcdj,qczje) values( #{riqi},#{spmc}, #{qcsl}, #{qcdj},#{qczje})")
    boolean add(String riqi,String spmc,String qcsl,String qcdj,String qczje);

}
