package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Xdmx;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;


@Mapper
@Repository
public interface XdmxMapper extends BaseMapper<Xdmx> {
    /**
     * 分页查询 - 使用兼容的 SQL Server 分页语法
     */
    @Select("<script>" +
            "SELECT * FROM (" +
            "   SELECT ROW_NUMBER() OVER (ORDER BY sc.id ASC) as row_num, " +
            "          sc.id, sc.khcm, sc.lxr, sc.lxdh, sc.ddrq, sc.hj, sc.fzr, sc.htbh, sc.zt, " +
            "          sc.zbz, sc.pp, sc.cpxh, sc.sl, sc.dj, sc.bz, sc.yq, sc.kpzt, sc.scgd, " +
            "          y.bm as bm " +
            "   FROM shengchangongdan sc " +
            "   LEFT JOIN yuangongxinxi y ON sc.fzr = y.xm " +
            "   <where>" +
            "     sc.zt = '下单' " +
            "     <if test='ew != null and ew.sqlSegment != null and ew.sqlSegment != \"\"'>" +
            "       AND ${ew.sqlSegment}" +
            "     </if>" +
            "   </where>" +
            ") as temp " +
            "WHERE row_num BETWEEN #{start} AND #{end}" +
            "</script>")
    List<Xdmx> selectForPage(@Param("start") long start,
                             @Param("end") long end,
                             @Param("ew") Wrapper<Xdmx> wrapper);


    /**
     * 获取总记录数
     */
    @Select("<script>" +
            "SELECT COUNT(*) " +
            "FROM shengchangongdan " +
            "<where>" +
            "  zt = '下单' " +
            "  <if test='ew != null and ew.sqlSegment != null and ew.sqlSegment != \"\"'>" +
            "    AND ${ew.sqlSegment}" +
            "  </if>" +
            "</where>" +
            "</script>")
    Long selectCountForPage(@Param("ew") Wrapper<Xdmx> wrapper);


    /**
     * 分页查询 - 使用兼容的 SQL Server 分页语法
     */
    @Select("<script>" +
            "SELECT * FROM (" +
            "   SELECT ROW_NUMBER() OVER (ORDER BY sc.id ASC) as row_num, " +
            "          sc.id, sc.khcm, sc.lxr, sc.lxdh, sc.ddrq, sc.hj, sc.fzr, sc.htbh, sc.zt, " +
            "          sc.zbz, sc.pp, sc.cpxh, sc.sl, sc.dj, sc.bz, sc.yq, sc.kpzt, sc.scgd, " +
            "          y.bm as bm " +
            "   FROM shengchangongdan sc " +
            "   LEFT JOIN yuangongxinxi y ON sc.fzr = y.xm " +
            "   <where>" +
            "     sc.zt = '下单' " +
            "     AND sc.fzr = #{fuzeren} " +
            "     <if test='ew != null and ew.sqlSegment != null and ew.sqlSegment != \"\"'>" +
            "       AND ${ew.sqlSegment}" +
            "     </if>" +
            "   </where>" +
            ") as temp " +
            "WHERE row_num BETWEEN #{start} AND #{end}" +
            "</script>")
    List<Xdmx> selectForPageYW(@Param("start") long start,
                             @Param("end") long end,
                             @Param("ew") Wrapper<Xdmx> wrapper,
                             @Param("fuzeren") String fuzeren);


    /**
     * 获取总记录数
     */
    @Select("<script>" +
            "SELECT COUNT(*) " +
            "FROM shengchangongdan " +
            "<where>" +
            "  zt = '下单' " +
            "  AND fzr = #{fuzeren} " +
            "  <if test='ew != null and ew.sqlSegment != null and ew.sqlSegment != \"\"'>" +
            "    AND ${ew.sqlSegment}" +
            "  </if>" +
            "</where>" +
            "</script>")
    Long selectCountForPageYW(@Param("ew") Wrapper<Xdmx> wrapper,@Param("fuzeren") String fuzeren);

    /**
     * 查询驳回内
     */
    @Select("SELECT * FROM shengchangongdan WHERE fzr = #{fuzeren} AND zt = '驳回' ")
    List<Xdmx> getListRE(@Param("fuzeren") String fuzeren);

    /**
     * 更新状态
     */
    @Update("UPDATE shengchangongdan SET zt = #{zt} WHERE id = #{id}")
    boolean updateStatusById(@Param("id") Integer id, @Param("zt") String zt);

    /**
     * 根据ID删除
     */
    @Delete("DELETE FROM shengchangongdan WHERE id = #{id}")
    boolean deleteById(@Param("id") Integer id);

    /**
     * 更新记录
     */
    @Update({"<script>",
            "UPDATE shengchangongdan",
            "<set>",
            "   <if test='khcm != null'>khcm = #{khcm},</if>",
            "   <if test='lxr != null'>lxr = #{lxr},</if>",
            "   <if test='lxdh != null'>lxdh = #{lxdh},</if>",
            "   <if test='ddrq != null'>ddrq = #{ddrq},</if>",
            "   <if test='pp != null'>pp = #{pp},</if>",
            "   <if test='cpxh != null'>cpxh = #{cpxh},</if>",
            "   <if test='sl != null'>sl = #{sl},</if>",
            "   <if test='dj != null'>dj = #{dj},</if>",
            "   <if test='hj != null'>hj = #{hj},</if>",
            "   <if test='fzr != null'>fzr = #{fzr},</if>",
            "   <if test='htbh != null'>htbh = #{htbh},</if>",
            "   <if test='zt != null'>zt = #{zt},</if>",
            "   <if test='bz != null'>bz = #{bz},</if>",
            "   <if test='zbz != null'>zbz = #{zbz},</if>",
            "   <if test='yq != null'>yq = #{yq},</if>",
            "   <if test='kpzt != null'>kpzt = #{kpzt},</if>",
            "</set>",
            "WHERE id = #{id}",
            "</script>"})
    int update(Xdmx shengchan);

    /**
     * 新增记录
     */
    @Insert("INSERT INTO shengchangongdan (khcm, lxr, lxdh, ddrq, pp, cpxh, sl, dj, hj, fzr, htbh, zt, bz, zbz,yq,kpzt) " +
            "VALUES (#{khcm}, #{lxr}, #{lxdh}, #{ddrq}, #{pp}, #{cpxh}, #{sl}, #{dj}, #{hj}, #{fzr}, #{htbh}, #{zt}, #{bz}, #{zbz}, #{yq}, #{kpzt})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Xdmx shengchan);


    @Insert("SELECT MAX(scgd) " +
            "FROM shengchangongdan WHERE scgd LIKE CONCAT('GD', #{datePart}, '%' ")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    String getMaxWorkOrderNumberByDate(@Param("datePart") String datePart);

    /**
     * 根据合同编号更新状态为下单
     */
    @Update("UPDATE shengchangongdan SET zt = '下单' WHERE htbh = #{htbh}")
    int updateZtByHtbh(@Param("htbh") String htbh);

}
