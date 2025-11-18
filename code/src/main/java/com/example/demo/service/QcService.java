package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Kc;
import com.example.demo.entity.Qc;

import java.util.List;

public interface QcService extends IService<Qc> {
    /**
     * 查询所有
     */
    List<Qc> getList();

    /**
     * 根据日期查询
     */
    List<Qc> queryList(String ksrq,String jsrq);
    /**
     * 根据商品名称查询
     */
    List<Qc> mcList(String spmc);
    /**
     * 修改
     */
    boolean update(Qc qc);

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
    Qc add(Qc qc);
}

