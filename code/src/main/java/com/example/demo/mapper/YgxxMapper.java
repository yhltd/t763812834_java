package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Ygxx;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface YgxxMapper extends BaseMapper<Ygxx> {

    @Select("SELECT id, xm, zw, bm, lxfs, bz, gh FROM yuangongxinxi ORDER BY xh ASC")
    List<Ygxx> getList();

    /**
     * 根据姓名模糊查询用户列表
     * @param name 姓名
     * @return 用户列表
     */
    @Select("SELECT id, xm, zw, bm, lxfs, bz, gh FROM yuangongxinxi WHERE xm LIKE '%' + #{name} + '%'")
    List<Ygxx> selectUsersByName(@Param("name") String name);

    // 在 YgxxMapper.java 中修改删除方法
    /**
     * 根据ID列表批量删除用户
     * @param idList ID列表
     * @return 删除的记录数
     */
    @Update({
            "<script>",
            "DELETE FROM yuangongxinxi WHERE id IN",
            "<foreach collection='idList' item='id' open='(' separator=',' close=')'>",
            "#{id}",
            "</foreach>",
            "</script>"
    })
    Integer deleteBatchByIds(@Param("idList") List<Integer> idList);

    /**
     * 修改用户信息
     */
    @Update("UPDATE yuangongxinxi SET  zw = #{zw}, bm = #{bm}, lxfs = #{lxfs}, bz = #{bz}, gh = #{gh} WHERE id = #{id}")
    Integer updateUser(Ygxx ygxx);



    /**
     * 检查工号是否存在
     */
    @Select("SELECT COUNT(*) FROM yuangongxinxi WHERE gh = #{gh}")
    Integer checkGhExists(@Param("gh") String gh);

//    /**
//     * 根据工号查询
//     */
//    @Select("SELECT xh, xm, zw, bm, lxfs, bz, gh FROM yuangongxinxi WHERE gh = #{gh}")
//    Ygxx getUserByGh(@Param("gh") String gh);


//    /**
//     * 获取当前最大的序号
//     * @return 最大序号
//     */
//    @Select("SELECT MAX(CAST(xh AS UNSIGNED)) FROM yuangongxinxi")
//    Integer getMaxXh();



}