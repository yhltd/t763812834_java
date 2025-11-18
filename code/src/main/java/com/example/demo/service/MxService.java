package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Mx;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MxService extends IService<Mx> {
    /**
     * 查询所有
     */
    List<Mx> getList();
    /**
     * 根据日期查询
     */
    List<Mx> queryList(String ksrq, String jsrq,String gsm);

    //增加
    Mx add(Mx mx);

    boolean add1(String mc,String js,String zl,String je,String ziduan,String danhao);
    Mx add2(Mx mx);
    /**
     * 修改
     */
//    boolean update(String mc,String js,String zl,String je,String danhao);
//    boolean update(Mx mx);
    boolean update1(Mx mx);

    boolean update2(Mx mx);

    /**
     * 删除
     *
     * @param idList 根据id集合删除
     * @return 是否删除成功
     */
    boolean delete(List<Integer> idList);

//    boolean deleteMingxi(String danhao);

    List<Mx> queryListMingxi(String danhao);

    List<Mx> queryListMingxi1(String danhao);

}
