package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Kc;
import com.example.demo.entity.Khzl;
import com.example.demo.entity.Rk;
import com.example.demo.entity.Xsd;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface KcMapper extends BaseMapper<Kc> {
    @Select("select * from kucun")
    List<Kc> getList();

    @Select("select * from kucun where riqi >= convert(date,#{ksrq}) and riqi <= convert(date,#{jsrq}) and mc like '%'+#{mc}+'%'")
    List<Kc> queryList(String ksrq, String jsrq, String mc);

    @Select("select * from kucun where mc= #{mc})")
    List<Kc> spmcList(String mc);

    @Update("update kucun set riqi = #{riqi},spmc = #{spmc},qcsl= #{qcsl},qcdj = #{qcdj},jhsl = #{jhsl},jhdj = #{jhdj},jhzje = #{jhzje},cksl = #{cksl},ckdj = #{ckdj},ckzje = #{ckzje},jcsl = #{jcsl},jcdj = #{jcdj},jczje = #{jczje},qczje = #{qczje} where id = #{id}")
    boolean update(String riqi,String spmc,String qcsl,String qcdj,String jhsl,String jhdj,String jhzje,String ckdj,String ckzje,String jcsl,String jcdj,String jczje,String qczje,int id);

    @Delete("delete from kucun where id=#{id}")
    boolean delete(int id);

    @Insert("insert into kucun(riqi,mc,qcsl,qcdj,#{qczje})")
    boolean add(String riqi,String mc,String qcsl,String qcdj,String qczje);

//
//    @Insert("insert into kucun(riqi,mc,qcsl,qcdj,rksl,rkdj,rkzje,js,dj,zje,jcsl,jcdj,jczje,qczje) values(#{riqi},#{mc}, #{qcsl}, #{qcdj},#{rksl},#{rkdj},#{rkzje},#{js}, #{dj}, #{zje}, #{jcsl}, #{jcdj},#{jczje},#{qczje})")
//    boolean add1(String riqi,String mc,String qcsl,String qcdj,String rksl,String rkdj,String rkzje,String js,String dj,String zje,String jcsl,String jcdj,String jczje,String qczje);
 @Select("select rk.riqi,rk.mc,rk.rksl,rk.rkdj,rk.zje,xsd.js,xsd.dj,xsd.je from ruku as rk,xiaoshoudan as xsd where rk.mc=xsd.mc")
 List<Kc> getList1();
    @Select("select mx.riqi,qc.qcsl,qc.qcdj,qc.qczje,mx.mc,mx.rksl,mx.rkdj,mx.zje,mx.dj,mx.js,mx.je,sum(cast(qc.qcsl as DECIMAL(10)))+(sum(cast(mx.rksl as DECIMAL(10)))) as jcsl,sum(cast(qc.qczje as DECIMAL(10)))+sum(cast(mx.zje as DECIMAL(10)))-sum(cast(mx.je as DECIMAL(10))) as jczje,cast((sum(cast(qc.qczje as DECIMAL(10)))+sum(cast(mx.zje as DECIMAL(10)))-sum(cast(mx.je as DECIMAL(10))))/(sum(cast(qc.qcsl as DECIMAL(10)))+(sum(cast(mx.rksl as DECIMAL(10)))))as DECIMAL(10,2)) as jcdj from mingxi as mx,qichu as qc where mx.mc=qc.spmc group by mx.riqi,qc.qcsl,qc.qcdj,qc.qczje,mx.mc,mx.rksl,mx.rkdj,mx.zje,mx.dj,mx.js,mx.je")
    List<Kc> getList2();


    @Select("select * from kucun")
    List<Kc> hqxlMc();

}
