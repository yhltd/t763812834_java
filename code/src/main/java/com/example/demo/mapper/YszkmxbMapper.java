package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Yh;
import com.example.demo.entity.Ysyf;
import com.example.demo.entity.Yszkmxb;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface YszkmxbMapper extends BaseMapper<Yszkmxb> {

    @Select("select * from yingshouzhangkuanmingxi")
    List<Yszkmxb> getList();


    @Select("insert INTO yingshouzhangkuanmingxi(gsm,qcye,sfyj,sfhs,ys1,ys2,ys3,ys4,ys5,ys6,ys7,ys8,ys9,ys10,ys11,ys12,nian) \n" +
            "SELECT\n" +
            "\t qhd.gsm as gsm,\n" +
            "\tkhzl.qcye as qcye,\n" +
            "\tkhzl.sfyj as sfyj,\n" +
            "\tkhzl.sfhs as sfhs,\n" +
            "\t SUM ( CASE WHEN MONTH ( qhd.riqi ) = 1 THEN CONVERT ( FLOAT, qhd.ysje ) ELSE 0 END ) AS ys1,  \n" +
            "\tSUM ( CASE WHEN MONTH ( qhd.riqi ) = 2 THEN CONVERT ( FLOAT, qhd.ysje ) ELSE 0 END ) AS ys2,  \n" +
            "\t SUM ( CASE WHEN MONTH ( qhd.riqi ) = 3 THEN CONVERT ( FLOAT, qhd.ysje ) ELSE 0 END ) AS ys3,  \n" +
            "\t SUM ( CASE WHEN MONTH ( qhd.riqi ) = 4 THEN CONVERT ( FLOAT, qhd.ysje ) ELSE 0 END ) AS ys4,  \n" +
            "\t SUM ( CASE WHEN MONTH ( qhd.riqi ) = 5 THEN CONVERT ( FLOAT, qhd.ysje ) ELSE 0 END ) AS ys5,   \n" +
            "\t SUM ( CASE WHEN MONTH ( qhd.riqi ) = 6 THEN CONVERT ( FLOAT, qhd.ysje ) ELSE 0 END ) AS ys6,  \n" +
            "\t SUM ( CASE WHEN MONTH ( qhd.riqi ) = 7 THEN CONVERT ( FLOAT, qhd.ysje ) ELSE 0 END ) AS ys7,   \n" +
            "\t SUM ( CASE WHEN MONTH ( qhd.riqi ) = 8 THEN CONVERT ( FLOAT, qhd.ysje ) ELSE 0 END ) AS ys8,  \n" +
            "\t SUM ( CASE WHEN MONTH ( qhd.riqi ) = 9 THEN CONVERT ( FLOAT, qhd.ysje ) ELSE 0 END ) AS ys9,   \n" +
            "\t SUM ( CASE WHEN MONTH ( qhd.riqi ) = 10 THEN CONVERT ( FLOAT, qhd.ysje ) ELSE 0 END ) AS ys10,   \n" +
            " SUM ( CASE WHEN MONTH ( qhd.riqi ) = 11 THEN CONVERT ( FLOAT, qhd.ysje ) ELSE 0 END ) AS ys11,  \n" +
            " SUM ( CASE WHEN MONTH ( qhd.riqi ) = 12 THEN CONVERT ( FLOAT, qhd.ysje ) ELSE 0 END ) AS ys12 ,\n" +
            "\tyear(qhd.riqi) as nian\n" +
            "\n" +
            "FROM\n" +
            "\tqianhuidan AS qhd\n" +
            "\tJOIN \n" +
            "\t kehuziliao AS khzl ON qhd.gsm = khzl.fuzhu \n" +
            "GROUP BY\n" +
            "\tqhd.gsm,\n" +
            "\tkhzl.qcye,\n" +
            "\tkhzl.sfyj,\n" +
            "\tkhzl.sfhs,\n" +
            "\tyear(qhd.riqi)")
    List<Yszkmxb> getList1();
    @Select("SELECT  \n" +
            "ysyf.gsm as gsm,\n" +
            "    SUM(CASE WHEN MONTH(ysyf.fkriqi) = 1 THEN CONVERT(FLOAT, ysyf.skje) ELSE 0 END) AS yf1,  \n" +
            "    SUM(CASE WHEN MONTH(ysyf.fkriqi) = 2 THEN CONVERT(FLOAT,ysyf.skje) ELSE 0 END) AS yf2,  \n" +
            "    SUM(CASE WHEN MONTH(ysyf.fkriqi) = 3 THEN CONVERT(FLOAT, ysyf.skje) ELSE 0 END) AS yf3,  \n" +
            "\t\t SUM(CASE WHEN MONTH(ysyf.fkriqi) = 4 THEN CONVERT(FLOAT,ysyf.skje) ELSE 0 END) AS yf4,  \n" +
            "    SUM(CASE WHEN MONTH(ysyf.fkriqi) = 5 THEN CONVERT(FLOAT, ysyf.skje) ELSE 0 END) AS yf5,  \n" +
            "    SUM(CASE WHEN MONTH(ysyf.fkriqi) = 6 THEN CONVERT(FLOAT, ysyf.skje) ELSE 0 END) AS yf6,  \n" +
            "\t\t SUM(CASE WHEN MONTH(ysyf.fkriqi) = 7 THEN CONVERT(FLOAT, ysyf.skje) ELSE 0 END) AS yf7,  \n" +
            "    SUM(CASE WHEN MONTH(ysyf.fkriqi) = 8 THEN CONVERT(FLOAT,ysyf.skje) ELSE 0 END) AS yf8,  \n" +
            "    SUM(CASE WHEN MONTH(ysyf.fkriqi) = 9 THEN CONVERT(FLOAT,ysyf.skje) ELSE 0 END) AS yf9,  \n" +
            "\t\t SUM(CASE WHEN MONTH(ysyf.fkriqi) = 10 THEN CONVERT(FLOAT,ysyf.skje) ELSE 0 END) AS yf10,  \n" +
            "    SUM(CASE WHEN MONTH(ysyf.fkriqi) = 11 THEN CONVERT(FLOAT,ysyf.skje) ELSE 0 END) AS yf11,  \n" +
            "    SUM(CASE WHEN MONTH(ysyf.fkriqi) = 12 THEN CONVERT(FLOAT, ysyf.skje) ELSE 0 END) AS yf12,\n" +

            "\t\t year(ysyf.riqi) as nian\n" +
            "FROM  \n" +
            "    yingshouyingfu AS ysyf  group by ysyf.gsm,year(ysyf.riqi)\n")
    List<Yszkmxb> getList2();

    @Insert("insert into yingshouzhangkuanmingxi(gsm\n" +
            "\n" +
            "        sfyj\n" +
            "\n" +
            "        sfhs\n" +
            "        qcye\n" +
            "        yyys\n" +
            "        yyyf\n" +
            "        eyys\n" +
            "        eyyf\n" +
            "        syys\n" +
            "        syyf\n" +
            "        siyys\n" +
            "        siyyf\n" +
            "        wyys\n" +
            "        wyyf\n" +
            "        lyys\n" +
            "        lyyf\n" +
            "        qyys\n" +
            "        qyyf\n" +
            "        byys\n" +
            "        byyf\n" +
            "        jyys\n" +
            "        jyyf\n" +
            "        shiyys\n" +
            "        shiyyf\n" +
            "        syyys\n" +
            "        syyyf\n" +
            "        seyys\n" +
            "        seyyf\n" +
            "\n" +
            "        ljysje\n" +
            "\n" +
            "        bnysje\n" +
            "\n" +
            "        ysyehj\n" +
            "        yf\n" +
            "        skje\n" +
            "        ysje) values(#{gsm},#{sfyj},#{sfhs},#{qcye},#{yyys},#{yyyf},#{eyys},#{eyyf},#{syys},#{syyf},#{siyys},#{siyyf},#{wyys},#{wyyf},#{lyys},#{lyyf},#{qyys},#{qyyf},#{byys},#{byyf},#{jyys},#{jyyf},#{shiyys},#{shiyyf},#{syyys},#{syyyf},#{seyys},#{seyyf},#{ljysje},#{bnysje},#{ysyehj},#{yf},#{skje},#{ysje})")
    boolean add(String gsm,
                String sfyj,
                String sfhs,
                String qcye,
                String yyys,
                String yyyf,
                String eyys,
                String eyyf,
                String syys,
                String syyf,
                String siyys,
                String siyyf,
                String wyys,
                String wyyf,
                String lyys,
                String lyyf,
                String qyys,
                String qyyf,
                String byys,
                String byyf,
                String jyys,
                String jyyf,
                String shiyys,
                String shiyyf,
                String syyys,
                String syyyf,
                String seyys,
                String seyyf,
                String ljysje,
                String bnysje,
                String ysyehj,
                String yf,
                String skje,
                String ysje);

    @Delete("delete from yingshouzhangkuanmingxi ")
    void delete();

    @Select("SELECT qhd.gsm, khzl.sfyj, khzl.sfhs, SUM ( CONVERT ( FLOAT, qhd.ysje ) )AS ysje, MONTH ( qhd.riqi ) AS yf, SUM ( CONVERT ( FLOAT, ysyf.skje ) )AS skje, khzl.qcye AS qcye FROM qianhuidan AS qhd, yingshouyingfu AS ysyf, kehuziliao ASkhzl WHERE qhd.gsm= ysyf.gs m AND khzl.fuzhu = qhd.gsm AND khzl.fuzhu = ysyf.gsm AND qhd.bh = ysyf.bh group by qhd.gsm, khzl.sfyj, khzl.sfhs, khzl.qcye, qhd.riqi")
    List<Yszkmxb> getList3();
    @Update("update yingshouzhangkuanmingxi set yf1 = #{yf1},yf2 = #{yf2},yf3 = #{yf3},yf4 = #{yf4},yf5 = #{yf5},yf6 = #{yf6},yf7 = #{yf7},yf8 = #{yf8},yf9=#{yf9},yf10 = #{yf10},yf11 = #{yf11},yf12 = #{yf12},bnysje=#{bnysje} where gsm = #{gsm} and nian = #{nian}")
    boolean update(String yf1,String yf2,String yf3,String yf4,String yf5,String yf6,String yf7,String yf8,String yf9,String yf10,String yf11,String yf12,String bnysje,String gsm,String nian);
}
