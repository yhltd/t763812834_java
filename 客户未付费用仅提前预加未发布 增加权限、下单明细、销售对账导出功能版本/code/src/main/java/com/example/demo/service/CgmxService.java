package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Cgmx;
import com.example.demo.entity.Scgd;
import com.example.demo.util.PageRequestDTO;
import com.example.demo.util.PageResult;

import java.util.List;
import java.util.Map;

public interface CgmxService extends IService<Cgmx> {
    /**
     * 分页查询客户信息
     */
    PageResult<Cgmx> getCgmxPage(PageRequestDTO request);

    Map<String, Object> searchCgmx(String keyword, Integer pageNum, Integer pageSize);


    /**
     * 新增记录
     */
    int insert(Cgmx cgmx);

    /**
     * 更新记录
     */
    int update(Cgmx cgmx);

    /**
     * 根据ID删除
     */
    boolean deleteById(Integer id);


}