package com.example.demo.mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Qxgl;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface QxglMapper extends BaseMapper<Qxgl> {

    @Select("SELECT id, C, D, E, F FROM qvanxianguanli ORDER BY C DESC")
    List<Qxgl> getList();

    /**
     * 根据姓名模糊查询用户列表
     */
    @Select("SELECT id, C, D, E, F FROM qvanxianguanli WHERE D LIKE '%' + #{name} + '%'")
    List<Qxgl> selectUsersByName(@Param("name") String name);

    /**
     * 根据ID列表批量删除用户
     */
    @Delete({
            "<script>",
            "DELETE FROM qvanxianguanli WHERE id IN",
            "<foreach collection='idList' item='id' open='(' separator=',' close=')'>",
            "#{id}",
            "</foreach>",
            "</script>"
    })
    Integer deleteBatchByIds(@Param("idList") List<Integer> idList);

    /**
     * 修改用户信息
     */
    @Update("UPDATE qvanxianguanli SET C = #{c}, D = #{d}, E = #{e}, F = #{f} WHERE id = #{id}")
    Integer updateUser(Qxgl qxgl);

    /**
     * 检查用户名是否存在
     */
    @Select("SELECT COUNT(*) FROM qvanxianguanli WHERE E = #{username}")
    Integer checkUsernameExists(@Param("username") String username);

    /**
     * 检查用户名是否存在（排除当前用户）
     */
    @Select("SELECT COUNT(*) FROM qvanxianguanli WHERE E = #{username} AND id != #{excludeId}")
    Integer checkUsernameExistsExcludeSelf(@Param("username") String username, @Param("excludeId") Integer excludeId);
}
