package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Grxx;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface GrxxMapper extends BaseMapper<Grxx> {

    @Select("select * from gerenxinxi where name like '%'+#{name}+'%'")
    List<Grxx> queryList(String name);

//    @Update("update gerenxinxi set username = #{username},phone = #{phone},name = #{name},nc = #{nc},yx = #{yx},address = #{address},xl = #{xl},byyx = #{byyx},xb = #{xb},sr = #{sr},qm = #{qm},password = #{password} where id = #{id}")
    @Update("update gerenxinxi set username = #{username},phone = #{phone},name = #{name},nc = #{nc},yx = #{yx},address = #{address},xl = #{xl},byyx = #{byyx},xb = #{xb},sr = #{sr},qm = #{qm},password = #{password} where name = #{name}")
    boolean update(String username, String phone,String name, String nc,String yx,String address, String xl, String byyx, String xb, String sr, String qm,String password);

    @Insert("insert into gerenxinxi(username,name,password) values(#{username},#{name},#{password})")
    boolean add(String username,String name,String password);

}
