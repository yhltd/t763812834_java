package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.UserInfo;
import com.example.demo.entity.Xsd;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface XsdService extends IService<Xsd> {

    /**
     * 查询所有
     */
    List<Xsd> getList();

    /**
     * 根据姓名和部门查询
     */
    List<Xsd> queryList(String ksrq,String jsrq,String shdw);

    /**
     * 修改
     */
//    boolean update(String riqi,String dh,String shdw,String mc,String mh,String gg,String js,String zl,String dj,String je,String bz,String shdz,String kddh,String sfyj,String fkfs,String sfhs,String gd,String zdr,String shdwjjsr,String jgf,String kdf,String hsdj,String sd,String whsdj,int id);
    boolean update(String riqi,String dh,String shdw,String mc,String mh,String gg,String zl,String dj,String je,String bz,String shdz,String kddh,String sfyj,String fkfs,String sfhs,String gd,String zdr,String jgf,String kdf,String hsdj,String sd,String whsdj,int id);
    /**
     * 删除
     *
     * @param idList 根据id集合删除
     * @return 是否删除成功
     */
    boolean delete(List<Integer> idList);

    /**
     * 添加
     */
//    Xsd add(Xsd xsd);
//    Xsd add1(Xsd xsd);
//    boolean add2(String riqi,String dh,String shdw,String mc,String mh,String gg,String js,String zl,String dj,String je,String bz,String shdz,String kddh,String sfyj,String fkfs,String sfhs,String gd,
//                 String zdr,String shdwjjsr ,String jgf,String kdf,String hsdj,String sd,String whsdj,String hjje,String bzld,
//                 String hjzl);
    /**
     * 获取当天销售单单价
     */
    List<Xsd> getDj(String dj);

    List<Xsd> getListByShdw(String shdw,String dh,String riqi);

    boolean update2(Xsd xsd);


//    boolean add(String riqi, String dh, String shdw, String mc, String mh, String gg, String js
//            , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
//                String zdr, String shdwjjsr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
//                String bzld, String hjzl);
boolean add(String riqi, String dh, String shdw, String mc, String mh, String gg
        , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
            String zdr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
            String bzld, String hjzl);


    List<Xsd> getList2(String dh);
    boolean delete1(String dh);

}
