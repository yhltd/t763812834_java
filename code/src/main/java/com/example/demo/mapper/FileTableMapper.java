package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.FileTable;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface FileTableMapper extends BaseMapper<FileTable> {

    @Select("select * from fileTable where glid=#{id}")
    List<FileTable> getFile(int glid);

    @Delete("delete from fileTable where glid=#{glid}")
    FileTable delete(int glid);

}
