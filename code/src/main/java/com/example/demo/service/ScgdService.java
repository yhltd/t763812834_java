package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Scgd;
import com.example.demo.util.PageRequestDTO;
import com.example.demo.util.PageResult;
import com.example.demo.util.ScgdSearchRequest;

import java.util.List;

public interface ScgdService extends IService<Scgd> {
    /**
     * 分页查询客户信息
     */
    PageResult<Scgd> getScgdPage(ScgdSearchRequest request);

    /**
     * 新增记录
     */
    int insert(Scgd shengchan);

    /**
     * 更新记录
     */
    int update(Scgd shengchan);

    /**
     * 根据ID删除
     */
    boolean deleteById(Integer id);

    /**
     * 更新状态
     */
    boolean updateStatus(Integer id, String zt);

    List<Scgd> getListRE(String fuzeren);
}