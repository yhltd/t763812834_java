package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Yjbb;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface YjbbMapper extends BaseMapper<Yjbb> {

    /**
     * 分页查询 - 使用兼容的 SQL Server 分页语法
     */
    @Select("<script>" +
            "SELECT * FROM (" +
            "   SELECT ROW_NUMBER() OVER (ORDER BY year DESC, month DESC, d.fzr) as row_num, " +
            "    year, month, d.fzr, y.gh, zj " +
            "FROM (" +
            "    SELECT fzr, " +
            "        CAST(LEFT(ddrq, 4) AS INT) AS year, " +
            "        CAST(SUBSTRING(ddrq, CHARINDEX('/', ddrq) + 1, " +
            "            CHARINDEX('/', ddrq, CHARINDEX('/', ddrq) + 1) - CHARINDEX('/', ddrq) - 1) AS INT) AS month, " +
            "        SUM(CASE WHEN ISNUMERIC(zj) = 1 THEN CAST(zj AS NUMERIC(12,2)) ELSE 0 END) AS zj " +
            "    FROM dingdanmingx " +
            "    WHERE ddrq IS NOT NULL " +
            "        AND zj IS NOT NULL " +
            "        AND fzr IS NOT NULL " +
            "        AND ddrq LIKE '%/%' " +
            "        AND ISNUMERIC(LEFT(ddrq, 4)) = 1 " +
            "        AND CHARINDEX('/', ddrq, CHARINDEX('/', ddrq) + 1) > 0 " +
            "        AND ISNUMERIC(SUBSTRING(ddrq, CHARINDEX('/', ddrq) + 1, " +
            "            CHARINDEX('/', ddrq, CHARINDEX('/', ddrq) + 1) - CHARINDEX('/', ddrq) - 1)) = 1 " +
            "        <if test='selectedYear != null'> " +
            "          AND CAST(LEFT(ddrq, 4) AS INT) = #{selectedYear} " +
            "        </if> " +
            "    GROUP BY CAST(LEFT(ddrq, 4) AS INT), " +
            "        CAST(SUBSTRING(ddrq, CHARINDEX('/', ddrq) + 1, " +
            "            CHARINDEX('/', ddrq, CHARINDEX('/', ddrq) + 1) - CHARINDEX('/', ddrq) - 1) AS INT), fzr " +
            ") d " +
            "LEFT JOIN yuangongxinxi y ON d.fzr = y.xm " +
            ") as temp " +
            "WHERE row_num BETWEEN #{start} AND #{end}" +
            "</script>")

    List<Yjbb> selectForPage(@Param("start") long start,
                             @Param("end") long end,
                             @Param("selectedYear") String selectedYear,
                             @Param("ew") Wrapper<Yjbb> wrapper);

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
    Long selectCountForPage(@Param("ew") Wrapper<Yjbb> wrapper);

    @Select("select xm from yuangongxinxi")
    List<Yjbb> getfzr();
}