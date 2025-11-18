package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Fy;
import com.example.demo.entity.Rk;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface FyMapper extends BaseMapper<Fy> {

    @Select("select * from feiyong")
    List<Fy> getList();

    @Select("select * from feiyong where riqi >= convert(date,#{ksrq}) and riqi <= convert(date,#{jsrq})")
    List<Fy> queryList(String ksrq,String jsrq);

    @Update("update feiyong set riqi = #{riqi},xsfy = #{xsfy},glfy = #{glfy},cwfy = #{cwfy},hjfy = #{hjfy} where id = #{id}")
    boolean update(String riqi,String xsfy,String glfy,String cwfy,String hjfy,int id);

    @Delete("delete from feiyong where id=#{id}")
    boolean delete(int id);

    @Insert("insert into feiyong(riqi,xsfy,glfy,cwfy,hjfy) values(#{riqi},#{xsfy},#{glfy},#{cwfy},#{hjfy})")
    boolean add(String riqi,String xsfy,String glfy,String cwfy,String hjfy);

}
