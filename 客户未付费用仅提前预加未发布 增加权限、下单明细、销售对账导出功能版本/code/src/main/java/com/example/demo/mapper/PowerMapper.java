package com.example.demo.mapper;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Power;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;


@Mapper
@Repository
@DS("softtime")
public interface PowerMapper extends BaseMapper<Power> {
    @Select("select * from control_soft_time where name = 't763812834_java'")
    List<Power> getList();
}
