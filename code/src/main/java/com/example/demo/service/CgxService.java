package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Cgx;
import com.example.demo.entity.Xsd;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CgxService extends IService<Cgx> {

    /**
     * 查询所有
     */
    List<Cgx> getList();

    /**
     * 根据姓名和部门查询
     */
    List<Cgx> queryList(String ksrq,String jsrq);

    /**
     * 修改
     */
    boolean update(Cgx cgx);

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
//    boolean add(String riqi, String dh, String shdw, String mc, String mh, String gg, String js
//            , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
//                String zdr, String shdwjjsr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
//                String bzld, String hjzl);
    boolean add(String riqi, String dh, String shdw, String mc, String mh, String ggs
            , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
                String zdr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
                String bzld, String hjzl);

    List<Cgx> getListByShdw(String shdw,String dh,String riqi);
    List<Cgx> getListdh(String dh);
    boolean delete1(String dh);


    /**
     * 获取当天销售单单价
     */
//    List<Cgx> getDj(String dj);

//    List<Cgx> getListByShdw(String shdw,String dh,String riqi);

}
