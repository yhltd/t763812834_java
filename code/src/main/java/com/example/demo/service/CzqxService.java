package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Czqx;
import com.example.demo.entity.Yh;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CzqxService extends IService<Czqx> {

    /**
     * 查询所有
     */
    List<Czqx> getList();

    /**
     * 查询
     */
    List<Czqx> queryList(String czr,String biao,String czqx);

    /**
     * 修改
     */
    boolean update(Czqx czqx);

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
    Czqx add(Czqx czqx);

}
