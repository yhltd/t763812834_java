package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.example.demo.entity.Ddmx;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

@Mapper
public interface DdmxMapper extends BaseMapper<Ddmx> {

    @Select("<script>" +
            "SELECT * FROM (" +
            "    SELECT ROW_NUMBER() OVER (ORDER BY ddh ASC, ddrq ASC) as rn, " +
            "           ddrq, ddh, khjc, ggxh, fzr, bm, lxr, lxdh, tcd, khmc, kpsj, yingfu, yifu, wf, sfkp, scgd, bz, wldh, yfsj, zk, fhsj, pdf_file_name, " +
            "           CASE " +
            "               WHEN ISNULL(fahuozhuangtai, '') = '' THEN '全部未发货' " +
            "               ELSE fahuozhuangtai " +
            "           END AS fahuozhuangtai " +
            "    FROM (" +
            "        SELECT d1.* " +
            "        FROM dingdanmingx d1 " +
            "        WHERE d1.id = (" +
            "            SELECT TOP 1 id " +
            "            FROM dingdanmingx d2 " +
            "            WHERE d2.ddh = d1.ddh " +
            "            ORDER BY ddrq ASC, id ASC" +
            "        ) " +
            "    ) t " +
            "    <where>" +
            "      <if test='ew != null'>${ew.sqlSegment}</if>" +
            "    </where>" +
            ") temp " +
            "WHERE temp.rn BETWEEN #{start} + 1 AND #{start} + #{end}" +
            "</script>")
    List<Map<String, Object>> selectDistinctByDdhForPage(@Param("start") long start,
                                                         @Param("end") long end,
                                                         @Param("ew") Wrapper<Map<String, Object>> wrapper);

    @Select("<script>" +
            "SELECT * FROM (" +
            "    SELECT ROW_NUMBER() OVER (ORDER BY ddh ASC, ddrq ASC, id ASC) as rn, " +
            "           * " +
            "    FROM dingdanmingx " +
            "    <where>" +
            "      <if test='ew != null'>${ew.sqlSegment}</if>" +
            "    </where>" +
            ") temp " +
            "WHERE temp.rn BETWEEN #{start} + 1 AND #{start} + #{end}" +
            "</script>")
    List<Map<String, Object>> daochuexcel(@Param("start") long start,
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
     * 分页查询（根据ddh和ddrq去重，有PDF文件的优先显示）
     */
    @Select("<script>" +
            "SELECT * FROM (" +
            "    SELECT ROW_NUMBER() OVER (ORDER BY ddh ASC, ddrq ASC) as rn, " +
            "           ddrq, ddh, khjc, ggxh, fzr, bm, lxr, lxdh, tcd, khmc, kpsj, yingfu, yifu, wf, sfkp, scgd, bz, wldh, yfsj, zk, fhsj, pdf_file_name, " +
            "           CASE " +
            "               WHEN ISNULL(fahuozhuangtai, '') = '' THEN '全部未发货' " +
            "               ELSE fahuozhuangtai " +
            "           END AS fahuozhuangtai " +
            "    FROM (" +
            "        SELECT d1.* " +
            "        FROM dingdanmingx d1 " +
            "        WHERE d1.id = (" +
            "            SELECT TOP 1 id " +
            "            FROM dingdanmingx d2 " +
            "            WHERE d2.ddh = d1.ddh " +
            "            ORDER BY " +
            "                CASE WHEN d2.pdf_file_name IS NOT NULL AND d2.pdf_file_name != '' THEN 0 ELSE 1 END, " +
            "                d2.id DESC" +
            "        ) " +
            "        AND d1.fzr = #{fuzeren} " +
            "    ) t " +
            "    <where>" +
            "      <if test='ew != null'>${ew.sqlSegment}</if>" +
            "    </where>" +
            ") temp " +
            "WHERE temp.rn BETWEEN #{start} + 1 AND #{start} + #{end}" +
            "</script>")
    List<Map<String, Object>> selectDistinctByDdhForPageY(@Param("start") long start,
                                                          @Param("end") long end,
                                                          @Param("ew") Wrapper<Map<String, Object>> wrapper,
                                                          @Param("fuzeren") String fuzeren);

    @Select("<script>" +
            "SELECT * FROM (" +
            "    SELECT ROW_NUMBER() OVER (ORDER BY ddh ASC, ddrq ASC) as rn, " +
            "           * " +  // 改为 * 返回所有字段
            "    FROM dingdanmingx " +
            "    <where>" +
            "      fzr = #{fuzeren} " +
            "      <if test='ew != null'>AND ${ew.sqlSegment}</if>" +
            "    </where>" +
            ") temp " +
            "WHERE temp.rn BETWEEN #{start} + 1 AND #{start} + #{end}" +
            "</script>")
    List<Map<String, Object>> daochuexcely(@Param("start") long start,
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


    @Update("update dingdanmingx set pdf_file_name = #{pdfFileName} where ddh = #{ddh}")
    boolean updatePdfFileNameByDdh(@Param("ddh") String ddh, @Param("pdfFileName") String pdfFileName);

    @Select("SELECT pdf_file_name FROM dingdanmingx  WHERE ddh = #{ddh}")
    String getpdffilename(@Param("ddh") String ddh);


}
