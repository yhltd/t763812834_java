package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Shdp;
import com.example.demo.entity.Spmc;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author hui
 * @date 2024/8/7 18:24
 */
@Mapper
@Repository
public interface ShdpMapper extends BaseMapper<Shdp> {
    @Select("select * from shdprint")
    List<Shdp> getList();

    @Select("select count(*) from shdprint")
    int count1();

//    @Insert("insert into shdprint(riqi,dh,shdw,mc,mh,gg,js,zl,dj,je,bz,shdz,kddh,sfyj,fkfs,sfhs,gd,zdr,shdwjjsr,jgf,kdf,hsdj,sd,whsdj,hjje,bzld,hjzl)" +
//            " values(#{riqi},#{dh},#{shdw},NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,#{kddh},#{sfyj},#{fkfs},#{sfhs},NULL,#{zdr},#{shdwjjsr},NULL,#{kdf},NULL,#{sd},NULL,NULL,#{bzld},NULL)")
//    void add(String riqi,String dh,String kddh,String shdwjjsr,String shdw,String sfyj,String fkfs,String sfhs,String sd,String zdr,String kdf,String bzld);
//
//    @Update("update shdprint set mc = #{mc},mh = #{mh},gg = #{gg},js = #{js},zl = #{zl},dj = #{dj},je = #{je},bz = #{bz},shdz = #{shdz},gd = #{gd},jgf = #{jgf},hsdj = #{hsdj},whsdj = #{whsdj},hjje=#{hjje},hjzl=#{hjzl} where id=#{id}")
//    boolean update(String mc, String mh, String gg, String js, String zl, String dj, String je, String bz, String shdz, String gd, String jgf, String hsdj, String whsdj, String hjje, String hjzl, int id);
//
//    @Delete("delete from shdprint ")
//    void delete();

    @Insert("insert into shdprint(riqi,dh,shdw,mc,mh,gg,zl,dj,je,bz,shdz,kddh,sfyj,fkfs,sfhs,gd,zdr,jgf,kdf,hsdj,sd,hjje,bzld,hjzl) values(#{riqi},#{dh},#{shdw},NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,#{kddh},#{sfyj},#{fkfs},#{sfhs},NULL,#{zdr},NULL,#{kdf},NULL,#{sd},NULL,#{bzld},NULL)")
    void add(String riqi,String dh,String kddh,String shdw,String sfyj,String fkfs,String sfhs,String sd,String zdr,String kdf,String bzld);

    @Update("update shdprint set mc = #{mc},mh = #{mh},gg = #{gg},zl = #{zl},dj = #{dj},je = #{je},bz = #{bz},shdz = #{shdz},gd = #{gd},jgf = #{jgf},hsdj = #{hsdj},whsdj = #{whsdj},hjje=#{hjje},hjzl=#{hjzl} where id=#{id}")
    boolean update(String mc, String mh, String gg, String zl, String dj, String je, String bz, String shdz, String gd, String jgf, String hsdj, String whsdj, String hjje, String hjzl, int id);

    @Delete("delete from shdprint")
    void delete();


    @Select("select riqi from shdprint where id=#{id}")
    String getriqi(int id);
    @Select("select dh from shdprint where id=#{id}")
    String getdh(int id);
    @Select("select shdw from shdprint where id=#{id}")
    String getshdw(int id);
    @Select("select fkfs from shdprint where id=#{id}")
    String getfkfs(int id);
    @Select("select sfhs from shdprint where id=#{id}")
    String getsfhs(int id);
    @Select("select kdf from shdprint where id=#{id}")
    String getkdf(int id);
    @Select("select sd from shdprint where id=#{id}")
    String getsd(int id);
    @Select("select kddh from shdprint where id=#{id}")
    String getkddh(int id);
    @Select("select shdwjjsr from shdprint where id=#{id}")
    String getshdwjjsr(int id);
    @Select("select sfyj from shdprint where id=#{id}")
    String getsfyj(int id);

    @Select("select bzld from shdprint where id=#{id}")
    String getbzld(int id);
//    @Insert("insert into shdprint(riqi,dh,shdw,mc,mh,gg,js,zl,dj,je,bz,shdz,kddh,sfyj,fkfs,sfhs,gd,zdr,shdwjjsr,jgf,kdf,hsdj,sd,whsdj,hjje,bzld,hjzl)" +
//            " values(#{riqi},#{dh},#{shdw},#{mc},#{mh},#{gg},#{js},#{zl},#{dj},#{je},#{bz},#{shdz},#{kddh},#{sfyj},#{fkfs},#{sfhs},#{gd},#{zdr},#{shdwjjsr},#{jgf},#{kdf},#{hsdj},#{sd},#{whsdj},#{hjje},#{bzld},#{hjzl})")
//    void add1(String riqi, String dh, String shdw, String mc, String mh, String gg, String js
//            , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
//              String zdr, String shdwjjsr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
//              String bzld, String hjzl);

    @Insert("insert into shdprint(riqi,dh,shdw,mc,mh,gg,zl,dj,je,bz,shdz,kddh,sfyj,fkfs,sfhs,gd,zdr,jgf,kdf,hsdj,sd,whsdj,hjje,bzld,hjzl)" +
            " values(#{riqi},#{dh},#{shdw},#{mc},#{mh},#{gg},#{zl},#{dj},#{je},#{bz},#{shdz},#{kddh},#{sfyj},#{fkfs},#{sfhs},#{gd},#{zdr},#{jgf},#{kdf},#{hsdj},#{sd},#{whsdj},#{hjje},#{bzld},#{hjzl})")
    void add1(String riqi, String dh, String shdw, String mc, String mh, String gg, String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
              String zdr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje, String bzld, String hjzl);

}
//    #{riqi},#{dh},#{shdw},#{mc},#{mh},#{gg},#{js},#{zl},#{dj},#{je},#{bz},#{shdz},#{kddh},#{sfyj},#{fkfs},#{sfhs}" +
//            ",,#{gd},#{zdr},#{shdwjjsr},#{jgf},#{kdf},#{hsdj},#{sd},#{whsdj}