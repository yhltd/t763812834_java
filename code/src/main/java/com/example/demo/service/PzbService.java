package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Pzb;

import java.util.List;

public interface PzbService extends IService<Pzb> {

    List<Pzb> getList(String fuzeren);
    List<Pzb> getXL();
    List<Pzb> getXLGL();
    List<Pzb> getDW();

    /**
     * 查询所有用户
     */
    List<Pzb> getListArr();

    /**id
     * 添加
     */
    boolean add();


    /**
     * 删除用户
     */
    boolean delete(List<Integer> idList);



    /**
     * 根据负责人姓名模糊查询配置列表
     * @param name 负责人姓名
     * @return 配置列表
     */
    List<Pzb> queryList(String name);


    /**
     * 添加
     */
    boolean update(String column,String value,int id);
}
