package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Pzb;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PzbMapper extends BaseMapper<Pzb> {

    @Select("SELECT fuzeren,dianhua,bianhao FROM peizhibiao WHERE fuzeren = #{fuzeren}")
    List<Pzb> getList(@Param("fuzeren") String fuzeren);

    @Select("SELECT chanpinmingcheng,fukuanfangshi FROM peizhibiao")
    List<Pzb> getXL();

    @Select("SELECT fuzeren,dianhua FROM peizhibiao")
    List<Pzb> getXLGL();

    @Select("SELECT chanpinmingcheng,danwei FROM peizhibiao")
    List<Pzb> getDW();


    /**
     * 获取所有配置信息，按负责人排序
     */
    @Select("SELECT id, fuzeren, fukuanfangshi, dianhua, bianhao, bumen, chanpinmingcheng, danwei, zhiwei,cgyf FROM peizhibiao ORDER BY fuzeren DESC")
    List<Pzb> getListArr();

    @Insert("insert into peizhibiao default values")
    boolean add();

    /**
     * 根据ID列表批量删除用户
     * @param idList ID列表
     * @return 删除的记录数
     */
    @Update({
            "<script>",
            "DELETE FROM peizhibiao WHERE id IN",
            "<foreach collection='idList' item='id' open='(' separator=',' close=')'>",
            "#{id}",
            "</foreach>",
            "</script>"
    })
    Integer deleteBatchByIds(@Param("idList") List<Integer> idList);

    /**
     * 根据负责人姓名模糊查询配置列表
     * @param name 负责人姓名
     * @return 配置列表
     */
    @Select("SELECT id, fukuanfangshi, fuzeren, dianhua, bianhao, bumen, chanpinmingcheng, danwei, zhiwei,cgyf " +
            "FROM peizhibiao " +
            "WHERE fuzeren LIKE '%' + #{name} + '%'")
    List<Pzb> selectUsersByName(@Param("name") String name);

    @Update("update peizhibiao set ${column} = #{value} where id = #{id}")
    boolean update(String column, String value, int id);

}
