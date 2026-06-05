package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Caigou;
import com.example.demo.entity.Yjbb;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
@Mapper
public interface CaigouMapper extends BaseMapper<Caigou> {
    @Select("select cgyf from peizhibiao")
    List<Caigou> getyifang();
}
