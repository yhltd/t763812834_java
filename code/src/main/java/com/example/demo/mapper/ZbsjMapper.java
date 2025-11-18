package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Zbsj;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface ZbsjMapper extends BaseMapper<Zbsj> {

    @Select("select riqi,shdw,mc,zl,dj,je,jgf,kdf,fkfs,sfhs,sfyj from xiaoshoudan where riqi <> CONVERT(DATE, GETDATE())")
    List<Zbsj> getList();

    @Select("select riqi,shdw,mc,zl,dj,je,jgf,kdf,fkfs,sfhs,sfyj from xiaoshoudan where riqi >= convert(date,#{ksrq}) and riqi <= convert(date,#{jsrq}) and riqi <> CONVERT(DATE, GETDATE())")
    List<Zbsj> queryList(String ksrq,String jsrq);

    @Delete("delete from xiaoshoudan where id=#{id}")
    boolean delete(int id);

}
