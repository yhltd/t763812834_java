package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Ddmx;
import com.example.demo.entity.Dzd;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

@Mapper
public interface DzdjlMapper extends BaseMapper<Dzd> {

    @Select("<script>" +
            "SELECT * FROM (" +
            "    SELECT ROW_NUMBER() OVER (ORDER BY khmc ASC, MAX(ddrq) DESC) as rn, " +
            "           MAX(ddrq) as ddrq, " +
            "           khmc, " +
            "           MAX(fzr) as fzr, " +
            "           CONVERT(DECIMAL(18,2), " +
            "               SUM(yfsj_distinct)" +
            "           ) as yfsj, " +
            "           CONVERT(DECIMAL(18,2), " +
            "               SUM(yifu_distinct)" +
            "           ) as yifu, " +
            "           CONVERT(DECIMAL(18,2), " +
            "               SUM(yfsj_distinct) - SUM(yifu_distinct)" +
            "           ) as wf, " +
            "           MAX(kpsj) as kpsj, " +
            "           sfkp, " +
            "           duizhangdanhao, " +
            "           MAX(dzzt) as dzzt, " +
            "           MAX(lxr) as lxr, " +
            "           MAX(pdf_file_name) as pdf_file_name, " +
            "           duizhangriqi, " +
            "           MAX(dzscwj) as dzscwj " +
            "    FROM (" +
            "        SELECT *, " +
            "               CASE WHEN ROW_NUMBER() OVER (PARTITION BY duizhangdanhao, ddh ORDER BY ddrq DESC) = 1 " +
            "                    THEN CASE WHEN yfsj LIKE '%[^0-9.]%' OR yfsj IS NULL OR yfsj = '' THEN 0 " +
            "                             ELSE CONVERT(DECIMAL(18,2), yfsj) END " +
            "                    ELSE 0 END as yfsj_distinct, " +
            "               CASE WHEN ROW_NUMBER() OVER (PARTITION BY duizhangdanhao, ddh ORDER BY ddrq DESC) = 1 " +
            "                    THEN CASE WHEN yifu LIKE '%[^0-9.]%' OR yifu IS NULL OR yifu = '' THEN 0 " +
            "                             ELSE CONVERT(DECIMAL(18,2), yifu) END " +
            "                    ELSE 0 END as yifu_distinct " +
            "        FROM dingdanmingx " +
            "        <where>" +
            "          <if test='ew != null'>${ew.sqlSegment}</if>" +
            "        </where>" +
            "    ) distinct_data " +
            "    GROUP BY duizhangdanhao, khmc, sfkp, duizhangriqi " +
            ") temp " +
            "WHERE temp.rn BETWEEN #{start} + 1 AND #{start} + #{end}" +
            "</script>")
    List<Map<String, Object>> selectDistinctByDdhForPage(@Param("start") long start,
                                                         @Param("end") long end,
                                                         @Param("ew") Wrapper<Map<String, Object>> wrapper);

    @Select("<script>" +
            "SELECT * FROM (" +
            "    SELECT ROW_NUMBER() OVER (ORDER BY khmc ASC, ddrq DESC) as rn, " +
            "           * " +
            "    FROM dingdanmingx " +
            "    <where>" +
            "      <if test='ew != null and ew.sqlSegment != null and ew.sqlSegment != \"\"'>" +
            "        ${ew.sqlSegment}" +
            "      </if>" +
            "    </where>" +
            ") temp " +
            "WHERE temp.rn BETWEEN #{start} + 1 AND #{start} + #{end}" +
            "</script>")
    List<Map<String, Object>> daochuexcel(@Param("start") long start,
                                          @Param("end") long end,
                                          @Param("ew") Wrapper<Map<String, Object>> wrapper);
    /**
     * 获取去重后的总记录数（根据ddh去重）
     */
    @Select("<script>" +
            "SELECT COUNT(*) FROM (" +
            "   SELECT duizhangdanhao FROM dingdanmingx " +  // 改为duizhangdanhao字段
            "   <where>" +
            "     <if test='ew != null'>${ew.sqlSegment}</if>" +
            "   </where>" +
            "   GROUP BY duizhangdanhao" +  // 改为根据duizhangdanhao分组
            ") as temp" +
            "</script>")
    Long selectDistinctCount(@Param("ew") Wrapper<Map<String, Object>> wrapper);


    @Select("<script>" +
            "SELECT * FROM (" +
            "    SELECT ROW_NUMBER() OVER (ORDER BY khmc ASC, MAX(ddrq) DESC) as rn, " +
            "           MAX(ddrq) as ddrq, " +
            "           khmc, " +
            "           MAX(fzr) as fzr, " +
            "           CONVERT(DECIMAL(18,2), " +
            "               SUM(yfsj_distinct)" +
            "           ) as yfsj, " +
            "           CONVERT(DECIMAL(18,2), " +
            "               SUM(yifu_distinct)" +
            "           ) as yifu, " +
            "           CONVERT(DECIMAL(18,2), " +
            "               SUM(yfsj_distinct) - SUM(yifu_distinct)" +
            "           ) as wf, " +
            "           MAX(kpsj) as kpsj, " +
            "           sfkp, " +
            "           duizhangdanhao, " +
            "           MAX(dzzt) as dzzt, " +
            "           MAX(lxr) as lxr, " +
            "           MAX(pdf_file_name) as pdf_file_name, " +
            "           duizhangriqi, " +
            "           MAX(dzscwj) as dzscwj " +
            "    FROM (" +
            "        SELECT *, " +
            "               CASE WHEN ROW_NUMBER() OVER (PARTITION BY duizhangdanhao, ddh ORDER BY ddrq DESC) = 1 " +
            "                    THEN CASE WHEN yfsj LIKE '%[^0-9.]%' OR yfsj IS NULL OR yfsj = '' THEN 0 " +
            "                             ELSE CONVERT(DECIMAL(18,2), yfsj) END " +
            "                    ELSE 0 END as yfsj_distinct, " +
            "               CASE WHEN ROW_NUMBER() OVER (PARTITION BY duizhangdanhao, ddh ORDER BY ddrq DESC) = 1 " +
            "                    THEN CASE WHEN yifu LIKE '%[^0-9.]%' OR yifu IS NULL OR yifu = '' THEN 0 " +
            "                             ELSE CONVERT(DECIMAL(18,2), yifu) END " +
            "                    ELSE 0 END as yifu_distinct " +
            "        FROM dingdanmingx " +
            "        <where>" +
            "          (fzr = #{fuzeren} OR #{fuzeren} = '' OR #{fuzeren} IS NULL) " +
            "          <if test='ew != null and ew.sqlSegment != null and ew.sqlSegment != \"\"'>" +
            "            AND ${ew.sqlSegment}" +
            "          </if>" +
            "        </where>" +
            "    ) distinct_data " +
            "    GROUP BY duizhangdanhao, khmc, sfkp, duizhangriqi " +
            ") temp " +
            "WHERE temp.rn BETWEEN #{start} + 1 AND #{start} + #{end}" +
            "</script>")
    List<Map<String, Object>> selectDistinctByDdhForPageY(@Param("start") long start,
                                                          @Param("end") long end,
                                                          @Param("ew") Wrapper<Map<String, Object>> wrapper,
                                                          @Param("fuzeren") String fuzeren);

    @Select("<script>" +
            "SELECT * FROM (" +
            "    SELECT ROW_NUMBER() OVER (ORDER BY khmc ASC, ddrq DESC) as rn, " +
            "           * " +
            "    FROM dingdanmingx " +
            "    <where>" +
            "      <if test='ew != null and ew.sqlSegment != null and ew.sqlSegment != \"\"'>" +
            "        ${ew.sqlSegment}" +
            "      </if>" +
            "      <if test='fuzeren != null and fuzeren != \"\"'>" +
            "        AND (fzr = #{fuzeren} OR #{fuzeren} = '')" +
            "      </if>" +
            "    </where>" +
            ") temp " +
            "WHERE temp.rn BETWEEN #{start} + 1 AND #{start} + #{end}" +
            "</script>")
    List<Map<String, Object>> daochuexcely(@Param("start") long start,
                                           @Param("end") long end,
                                           @Param("ew") Wrapper<Map<String, Object>> wrapper,
                                           @Param("fuzeren") String fuzeren);

    /**
     * 获取去重后的总记录数（根据ddh去重）
     */
    @Select("<script>" +
            "SELECT COUNT(*) FROM (" +
            "   SELECT duizhangdanhao FROM dingdanmingx " +  // 改为duizhangdanhao字段
            "   <where>" +
            "       fzr = #{fuzeren} " +
            "       <if test='ew != null and ew.sqlSegment != null and ew.sqlSegment != \"\"'>" +
            "           AND ${ew.sqlSegment}" +
            "       </if>" +
            "   </where>" +
            "   GROUP BY duizhangdanhao" +  // 改为根据duizhangdanhao分组
            ") as temp" +
            "</script>")
    Long selectDistinctCountY(@Param("ew") Wrapper<Map<String, Object>> wrapper, @Param("fuzeren") String fuzeren);

    @Select("SELECT ddh,ggxh,pm,dw,sl,dj,fhsj,zj,lxr FROM dingdanmingx WHERE duizhangdanhao=#{duizhangdanhao}")
    List<Ddmx> getDetailByDdh(String duizhangdanhao);


    @Update("UPDATE dingdanmingx SET sfkp = #{sfkp}, duizhangdanhao = '', duizhangriqi = '', kpsj = '' WHERE duizhangdanhao = #{duizhangdanhao}")
    boolean updateDzztStatusByDuizhangdanhao(@Param("duizhangdanhao") String duizhangdanhao, @Param("sfkp") String sfkp);

//    @Select("SELECT DISTINCT dzscwj FROM dingdanmingx WHERE duizhangdanhao = #{duizhangdanhao}")
    @Select("SELECT DISTINCT ISNULL(dzscwj, '') FROM dingdanmingx WHERE duizhangdanhao = #{duizhangdanhao}")
    String getpdffilename(@Param("duizhangdanhao") String duizhangdanhao);

    @Update("update dingdanmingx set dzscwj = #{dzscwj} where duizhangdanhao = #{duizhangdanhao}")
    boolean updatePdfFileNameByDdh(@Param("duizhangdanhao") String duizhangdanhao, @Param("dzscwj") String dzscwj);

}