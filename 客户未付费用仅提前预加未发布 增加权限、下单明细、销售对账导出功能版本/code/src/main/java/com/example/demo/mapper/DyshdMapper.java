package com.example.demo.mapper;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Cgmx;
import com.example.demo.entity.Dyshd;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface DyshdMapper extends BaseMapper<Dyshd> {
    @Select("select ddh from dingdanmingx where fhsj IS NULL OR fhsj = '待发货'")
    List<Dyshd> getddh();

    @Select("SELECT id, pm, ggxh, sl, dw, khmc FROM dingdanmingx WHERE ddh = #{ddh} AND (fhsj IS NULL OR fhsj = '待发货')")
    List<Dyshd> getshdlist(@Param("ddh") String ddh);

    @Update("UPDATE dingdanmingx SET fhsj = #{shipDate} WHERE id = #{id}")
    boolean updateShipDate(@Param("id") Integer id, @Param("shipDate") String shipDate);

    @Update({
            "<script>",
            "UPDATE dingdanmingx SET fhsj = #{shipDate} WHERE id IN",
            "<foreach collection='ids' item='id' open='(' separator=',' close=')'>",
            "#{id}",
            "</foreach>",
            "</script>"
    })
    int batchUpdateShipDate(@Param("ids") List<Integer> ids, @Param("shipDate") String shipDate);

    @Select("SELECT COUNT(*) FROM dingdanmingx WHERE ddh = #{ddh}")
    Integer countByDdh(@Param("ddh") String ddh);

    @Select("SELECT COUNT(*) FROM dingdanmingx WHERE ddh = #{ddh} AND (fhsj = '待发货' OR fhsj IS NULL OR fhsj = '')")
    Integer countPendingByDdh(@Param("ddh") String ddh);

    @Update("UPDATE dingdanmingx SET fahuozhuangtai = #{status} WHERE ddh = #{ddh}")
    void updateShipStatus(@Param("ddh") String ddh, @Param("status") String status);
}
