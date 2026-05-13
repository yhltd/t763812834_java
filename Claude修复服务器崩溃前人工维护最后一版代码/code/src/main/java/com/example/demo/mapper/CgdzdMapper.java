package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Cgdzd;
import com.example.demo.entity.Cgmx;
import com.example.demo.entity.Ddmx;
import com.example.demo.entity.Dzd;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

@Mapper
public interface CgdzdMapper extends BaseMapper<Cgdzd> {

    /**
     * 分页查询 - 使用兼容的 SQL Server 分页语法
     */
    @Select("<script>" +
            "SELECT * FROM (" +
            "   SELECT ROW_NUMBER() OVER (ORDER BY id ASC) as row_num, " +
            "          id, khcm, ddrq, hj, htbh, zbz, pp, cpxh, sl, dj, bz, kprq, qkje, yfje, dzzt " +
            "   FROM caigoumingxi " +
            "   <where>" +
            "     <if test='startdate != null and startdate != \"\" and enddate != null and enddate != \"\"'>" +
            "       AND ddrq BETWEEN #{startdate} AND #{enddate}" +
            "     </if>" +
            "     <if test='khmc != null and khmc != \"\"'>" +
            "       AND khcm LIKE '%' + #{khmc} + '%'" +
            "     </if>" +
            "     <if test='ddh != null and ddh != \"\"'>" +
            "       AND htbh LIKE '%' + #{ddh} + '%'" +
            "     </if>" +
            "     <if test='ew != null and ew.sqlSegment != null and ew.sqlSegment != \"\"'>" +
            "       AND ${ew.sqlSegment}" +
            "     </if>" +
            "   </where>" +
            ") as temp " +
            "WHERE row_num BETWEEN #{start} AND #{end}" +
            "</script>")
    List<Cgdzd> selectForPage(@Param("start") long start,
                             @Param("end") long end,
                             @Param("startdate") String startdate,
                             @Param("enddate") String enddate,
                             @Param("ddh") String ddh,
                             @Param("khmc") String khmc,
                             @Param("ew") Wrapper<Cgdzd> wrapper);

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
    Long selectCountForPage(@Param("ew") Wrapper<Cgdzd> wrapper);

    @Select("SELECT * FROM caigoumingxi WHERE htbh=#{ddh}")
    List<Cgdzd> getDetailByDdh(String ddh);


    @Update("UPDATE caigoumingxi SET dzzt = #{dzzt} WHERE htbh = #{ddh}")
    int updateDzztStatusByDdh(@Param("ddh") String ddh, @Param("dzzt") String dzzt);





}
