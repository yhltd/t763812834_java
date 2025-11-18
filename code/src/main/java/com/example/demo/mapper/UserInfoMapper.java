package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.UserInfo;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface UserInfoMapper extends BaseMapper<UserInfo> {

    @Select("select * from userInfo")
    List<UserInfo> getList();

    @Select("select * from userinfo where name like '%'+#{name}+'%'")
    List<UserInfo> queryList(String name);

    @Update("update userinfo set name = #{name},username = #{username},password = #{password},power = #{power},caozuoquanxian = #{caozuoquanxian} where id = #{id}")
    boolean update(String name,String username,String password,String power,String caozuoquanxian,int id);

    @Delete("delete from userinfo where id=#{id}")
    boolean delete(int id);

    @Insert("insert into userinfo(name,username,password,power,caozuoquanxian) values(#{name},#{username},#{password},#{power},#{caozuoquanxian})")
    boolean add(String name,String username,String password,String power,String caozuoquanxian);



}
