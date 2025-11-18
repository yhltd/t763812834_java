package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Rk;
import com.example.demo.entity.Spmc;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface SpmcMapper extends BaseMapper<Spmc> {

    @Select("select * from shangpinmingcheng")
    List<Spmc> getList();

    @Delete("delete from shanpinmingcheng where id=#{id}")
    boolean delete(int id);


    @Insert("insert into ruku(mc) values(#{mc})")
    boolean add(String mc);
}