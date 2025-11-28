package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.example.demo.entity.Ddmx;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface DdmxMapper extends BaseMapper<Ddmx> {

    /**
     * 分页查询（根据ddh和ddrq去重）
     */
    /**
     * 分页查询（根据ddh和ddrq去重，有PDF文件的优先显示）
     */
    @Select("<script>" +
            "SELECT * FROM (" +
            "   SELECT ROW_NUMBER() OVER (ORDER BY ddh ASC, ddrq ASC) as rn, " +
            "          ddrq, ddh, khjc, ggxh, fzr, bm, lxr, lxdh, tcd, khmc, kpsj, yingfu, yifu, wf, sfkp, scgd, bz, wldh, yfsj, zk, fhsj, pdf_file_name " +
            "   FROM (" +
            "       SELECT ROW_NUMBER() OVER (PARTITION BY ddh, ddrq ORDER BY " +
            "           CASE WHEN pdf_file_name IS NOT NULL AND pdf_file_name != '' THEN 0 ELSE 1 END, " +  // 有PDF文件的优先
            "           id DESC" +  // 其次按ID降序
            "       ) as row_num, " +
            "              ddrq, ddh, khjc, ggxh, fzr, bm, lxr, lxdh, tcd, khmc, kpsj, yingfu, yifu, wf, sfkp, scgd, bz, wldh, yfsj, zk, fhsj, pdf_file_name " +
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
     * 获取去重后的总记录数
     */
    @Select("<script>" +
            "SELECT COUNT(*) FROM (" +
            "   SELECT ddh, ddrq FROM dingdanmingx " +
            "   <where>" +
            "     <if test='ew != null'>${ew.sqlSegment}</if>" +
            "   </where>" +
            "   GROUP BY ddh, ddrq" +
            ") as temp" +
            "</script>")
    Long selectDistinctCount(@Param("ew") Wrapper<Map<String, Object>> wrapper);

    /**
     * 分页查询（根据ddh和ddrq去重）
     */
    /**
     * 分页查询（根据ddh和ddrq去重，有PDF文件的优先显示）
     */
    @Select("<script>" +
            "SELECT * FROM (" +
            "   SELECT ROW_NUMBER() OVER (ORDER BY ddh ASC, ddrq ASC) as rn, " +
            "          ddrq, ddh, khjc, ggxh, fzr, bm, lxr, lxdh, tcd, khmc, kpsj, yingfu, yifu, wf, sfkp, scgd, bz, wldh, yfsj, zk, fhsj, pdf_file_name " +
            "   FROM (" +
            "       SELECT ROW_NUMBER() OVER (PARTITION BY ddh, ddrq ORDER BY " +
            "           CASE WHEN pdf_file_name IS NOT NULL AND pdf_file_name != '' THEN 0 ELSE 1 END, " +  // 有PDF文件的优先
            "           id DESC" +  // 其次按ID降序
            "       ) as row_num, " +
            "              ddrq, ddh, khjc, ggxh, fzr, bm, lxr, lxdh, tcd, khmc, kpsj, yingfu, yifu, wf, sfkp, scgd, bz, wldh, yfsj, zk, fhsj, pdf_file_name " +
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
     * 获取去重后的总记录数
     */
    @Select("<script>" +
            "SELECT COUNT(*) FROM (" +
            "   SELECT ddh, ddrq FROM dingdanmingx " +
            "   <where>" +
            "       fzr = #{fuzeren} " +
            "       <if test='ew != null and ew.sqlSegment != null and ew.sqlSegment != \"\"'>" +
            "           AND ${ew.sqlSegment}" +
            "       </if>" +
            "   </where>" +
            "   GROUP BY ddh, ddrq" +
            ") as temp" +
            "</script>")
    Long selectDistinctCountY(@Param("ew") Wrapper<Map<String, Object>> wrapper, @Param("fuzeren") String fuzeren);

    @Select("SELECT ggxh,pm,dw,sl,dj,zj,scgd,bz,fhsj FROM dingdanmingx WHERE ddh=#{ddh} AND ddrq=#{ddrq} ")
    List<Ddmx> getDetailByDdh(String ddh,String ddrq);

}
