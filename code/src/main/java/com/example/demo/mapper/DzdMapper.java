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
public interface DzdMapper extends BaseMapper<Dzd> {

    /**
     * 分页查询（根据ddh去重，有pdf_file_name的优先保留，相同khmc排在一起，按ddrq排序）
     */
    @Select("<script>" +
            "SELECT * FROM (" +
            "   SELECT ROW_NUMBER() OVER (ORDER BY khmc ASC, ddrq DESC) as rn, " +
            "          ddrq, khmc, fzr, yfsj, yifu, wf, kpsj, sfkp, ddh, dzzt, lxr, pdf_file_name " +
            "   FROM (" +
            "       SELECT ROW_NUMBER() OVER (PARTITION BY ddh ORDER BY " +
            "           CASE WHEN pdf_file_name IS NOT NULL AND pdf_file_name != '' THEN 0 ELSE 1 END, " +  // 有PDF文件的优先
            "           id DESC" +  // 其次按ID降序
            "       ) as row_num, " +
            "              ddrq, khmc, fzr, yfsj, yifu, wf, kpsj, sfkp, ddh, dzzt, lxr, pdf_file_name " +
            "       FROM dingdanmingx " +
            "       <where>" +
            "         <if test='ew != null'>${ew.sqlSegment}</if>" +
            "       </where>" +
            "   ) as inner_temp " +
            "   WHERE row_num = 1" +
            ") as outer_temp " +
            "WHERE rn BETWEEN #{start} + 1 AND #{start} + #{end}" +
            "</script>")
    List<Map<String, Object>> selectDistinctByDdhForPage(@Param("start") long start,
                                                         @Param("end") long end,
                                                         @Param("ew") Wrapper<Map<String, Object>> wrapper);

    /**
     * 获取去重后的总记录数（根据ddh去重）
     */
    @Select("<script>" +
            "SELECT COUNT(*) FROM (" +
            "   SELECT ddh FROM dingdanmingx " +
            "   <where>" +
            "     <if test='ew != null'>${ew.sqlSegment}</if>" +
            "   </where>" +
            "   GROUP BY ddh" +
            ") as temp" +
            "</script>")
    Long selectDistinctCount(@Param("ew") Wrapper<Map<String, Object>> wrapper);


    @Select("<script>" +
            "SELECT * FROM (" +
            "   SELECT ROW_NUMBER() OVER (ORDER BY khmc ASC, ddrq DESC) as rn, " +
            "          ddrq, khmc, fzr, yfsj, yifu, wf, kpsj, sfkp, ddh, dzzt, lxr, pdf_file_name " +
            "   FROM (" +
            "       SELECT ROW_NUMBER() OVER (PARTITION BY ddh ORDER BY " +
            "           CASE WHEN pdf_file_name IS NOT NULL AND pdf_file_name != '' THEN 0 ELSE 1 END, " +  // 有PDF文件的优先
            "           id DESC" +  // 其次按ID降序
            "       ) as row_num, " +
            "              ddrq, khmc, fzr, yfsj, yifu, wf, kpsj, sfkp, ddh, dzzt, lxr, pdf_file_name " +
            "       FROM dingdanmingx " +
            "       <where>" +
            "           fzr = #{fuzeren} " +
            "           <if test='ew != null and ew.sqlSegment != null and ew.sqlSegment != \"\"'>" +
            "               AND ${ew.sqlSegment}" +
            "           </if>" +
            "       </where>" +
            "   ) as inner_temp " +
            "   WHERE row_num = 1" +
            ") as outer_temp " +
            "WHERE rn BETWEEN #{start} + 1 AND #{start} + #{end}" +
            "</script>")
    List<Map<String, Object>> selectDistinctByDdhForPageY(@Param("start") long start,
                                                          @Param("end") long end,
                                                          @Param("ew") Wrapper<Map<String, Object>> wrapper,
                                                          @Param("fuzeren") String fuzeren);

    /**
     * 获取去重后的总记录数（根据ddh去重）
     */
    @Select("<script>" +
            "SELECT COUNT(*) FROM (" +
            "   SELECT ddh FROM dingdanmingx " +
            "   <where>" +
            "       fzr = #{fuzeren} " +
            "       <if test='ew != null and ew.sqlSegment != null and ew.sqlSegment != \"\"'>" +
            "           AND ${ew.sqlSegment}" +
            "       </if>" +
            "   </where>" +
            "   GROUP BY ddh" +
            ") as temp" +
            "</script>")
    Long selectDistinctCountY(@Param("ew") Wrapper<Map<String, Object>> wrapper, @Param("fuzeren") String fuzeren);

    @Select("SELECT ggxh,pm,dw,sl,dj,fhsj,zj,lxr FROM dingdanmingx WHERE ddh=#{ddh}")
    List<Ddmx> getDetailByDdh(String ddh);


    @Update("UPDATE dingdanmingx SET dzzt = #{dzzt} WHERE ddh = #{ddh}")
    int updateDzztStatusByDdh(@Param("ddh") String ddh, @Param("dzzt") String dzzt);





}
