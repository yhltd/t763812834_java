package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Cgmx;

import com.example.demo.util.PageResult;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Mapper
@Repository
public interface CgmxMapper extends BaseMapper<Cgmx> {

    /**
     * 分页查询 - 使用兼容的 SQL Server 分页语法
     */
    @Select("<script>" +
            "SELECT * FROM (" +
            "   SELECT ROW_NUMBER() OVER (ORDER BY id ASC) as row_num, " +
            "          id, khcm,  ddrq, hj,htbh, zbz, pp, cpxh, sl, dj, bz,kprq,qkje,yfje " +
            "   FROM caigoumingxi " +
            "   <where>" +
            "     <if test='ew != null and ew.sqlSegment != null and ew.sqlSegment != \"\"'>" +
            "       AND ${ew.sqlSegment}" +
            "     </if>" +
            "   </where>" +
            ") as temp " +
            "WHERE row_num BETWEEN #{start} AND #{end}" +
            "</script>")
    List<Cgmx> selectForPage(@Param("start") long start,
                             @Param("end") long end,
                             @Param("ew") Wrapper<Cgmx> wrapper);

    /**
     * 获取总记录数
     */
    @Select("<script>" +
            "SELECT COUNT(*) " +
            "FROM caigoumingxi " +
            "<where>" +
            "  <if test='ew != null and ew.sqlSegment != null and ew.sqlSegment != \"\"'>" +
            "    AND ${ew.sqlSegment}" +
            "  </if>" +
            "</where>" +
            "</script>")
    Long selectCountForPage(@Param("ew") Wrapper<Cgmx> wrapper);

    /**
     * 查询采购明细列表
     */
    @Select({"<script>",
            "SELECT * FROM cgmx",
            "<where>",
            "  <if test='keyword != null and keyword != \"\"'>",
            "    AND (khcm LIKE #{keyword} OR htbh LIKE #{keyword} OR lxr LIKE #{keyword}",
            "         OR lxdh LIKE #{keyword} OR pp LIKE #{keyword} OR cpxh LIKE #{keyword}",
            "         OR zbz LIKE #{keyword})",
            "  </if>",
            "</where>",
            "ORDER BY id DESC",
            "<if test='pageSize != null and pageSize > 0'>",
            "  LIMIT #{start}, #{pageSize}",
            "</if>",
            "</script>"})
    List<Cgmx> selectCgmxList(Map<String, Object> params);



    /**
     * 根据ID删除
     */
    @Delete("DELETE FROM caigoumingxi WHERE id = #{id}")
    boolean deleteById(@Param("id") Integer id);

    /**
     * 更新记录
     */
    @Update({"<script>",
            "UPDATE caigoumingxi",
            "<set>",
            "   <if test='khcm != null'>khcm = #{khcm},</if>",

            "   <if test='ddrq != null'>ddrq = #{ddrq},</if>",
            "   <if test='pp != null'>pp = #{pp},</if>",
            "   <if test='cpxh != null'>cpxh = #{cpxh},</if>",
            "   <if test='sl != null'>sl = #{sl},</if>",
            "   <if test='dj != null'>dj = #{dj},</if>",
            "   <if test='hj != null'>hj = #{hj},</if>",

            "   <if test='htbh != null'>htbh = #{htbh},</if>",
            "   <if test='kprq != null'>kprq = #{kprq},</if>",
            "   <if test='qkje != null'>qkje = #{qkje},</if>",
            "   <if test='yfje != null'>yfje = #{yfje},</if>",
            "   <if test='bz != null'>bz = #{bz},</if>",
            "   <if test='zbz != null'>zbz = #{zbz},</if>",
            "</set>",
            "WHERE id = #{id}",
            "</script>"})
    int update(Cgmx cgmx);

    /**
     * 新增记录
     */
    @Insert("INSERT INTO caigoumingxi (khcm, ddrq, pp, cpxh, sl, dj, hj, htbh,bz, zbz) " +
            "VALUES (#{khcm}, #{ddrq}, #{pp}, #{cpxh}, #{sl}, #{dj}, #{hj}, #{htbh},#{bz}, #{zbz})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Cgmx cgmx);
}