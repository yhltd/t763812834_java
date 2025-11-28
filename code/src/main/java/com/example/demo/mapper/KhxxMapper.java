package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.example.demo.entity.Khxx;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface KhxxMapper extends BaseMapper<Khxx> {

    /**
     * 分页查询
     */
    @Select("<script>" +
            "SELECT * FROM (" +
            "   SELECT ROW_NUMBER() OVER (ORDER BY id ASC) as row_num, " +
            "          id, khbh, khjc, khmc, jdrq,khh,zh,sh,dz, lxr1, lxdh1,yq , dz1, dz2,dz3 ,dz4,dz5, fkfs, fzr,khzy,version " +
            "   FROM kehuxinxi " +
            "   <where>" +
            "     <if test='ew != null'>${ew.sqlSegment}</if>" +
            "   </where>" +
            ") as temp " +
            "WHERE row_num BETWEEN #{start} AND #{end}" +
            "</script>")
    List<Khxx> selectForPage(@Param("start") long start,
                             @Param("end") long end,
                             @Param("ew") Wrapper<Khxx> wrapper);

    /**
     * 分页查询 - 带负责人限制
     */
    @Select("<script>" +
            "SELECT * FROM (" +
            "   SELECT ROW_NUMBER() OVER (ORDER BY id ASC) as row_num, " +
            "          id, khbh, khjc, khmc, jdrq,khh,zh,sh,dz, lxr1, lxdh1,yq , dz1, dz2,dz3 ,dz4,dz5, fkfs, fzr,khzy,version " +
            "   FROM kehuxinxi " +
            "   <where>" +
            "     fzr = #{fuzeren} " +
            "     <if test='ew != null and ew.sqlSegment != null and ew.sqlSegment != \"\"'>" +
            "       AND ${ew.sqlSegment}" +
            "     </if>" +
            "   </where>" +
            ") as temp " +
            "WHERE row_num BETWEEN #{start} AND #{end}" +
            "</script>")
    List<Khxx> selectForPageY(@Param("start") long start,
                              @Param("end") long end,
                              @Param("ew") Wrapper<Khxx> wrapper,
                              @Param("fuzeren") String fuzeren);


    /**
     * 获取总记录数
     */
    @Select("<script>" +
            "SELECT COUNT(*) " +
            "FROM kehuxinxi " +
            "<where>" +
            "  <if test='ew != null'>${ew.sqlSegment}</if>" +
            "</where>" +
            "</script>")
    Long selectCountForPage(@Param("ew") Wrapper<Khxx> wrapper);

    /**
     * 获取总记录数 - 带负责人限制
     */
    @Select("<script>" +
            "SELECT COUNT(*) " +
            "FROM kehuxinxi " +
            "<where>" +
            "  fzr = #{fuzeren} " +
            "  <if test='ew != null and ew.sqlSegment != null and ew.sqlSegment != \"\"'>" +
            "    AND ${ew.sqlSegment}" +
            "  </if>" +
            "</where>" +
            "</script>")
    Long selectCountForPageY(@Param("ew") Wrapper<Khxx> wrapper,
                             @Param("fuzeren") String fuzeren);

    /**
     * 获取客户信息
     */
    @Select("SELECT khmc,lxr1,lxdh1,dz,dz1,dz2,dz3,dz4,dz5,yq,khh,zh,sh,fkfs,khzy FROM kehuxinxi")
    List<Khxx> getKH();

    /**
     * 获取最后一位id
     */
    @Select("SELECT MAX(id) FROM kehuxinxi")
    Long getLastId();
}








