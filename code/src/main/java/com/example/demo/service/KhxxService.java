package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Khxx;
import com.example.demo.util.KhxxPageRequestDTO;
import com.example.demo.util.PageRequestDTO;
import com.example.demo.util.PageResult;
import com.example.demo.util.Result;

import java.util.List;

public interface KhxxService extends IService<Khxx> {

    /**
     * 分页查询客户信息
     */
    PageResult<Khxx> getKhxxPage(KhxxPageRequestDTO request);
    /**
     * 分页查询客户信息
     */
    PageResult<Khxx> getKhxxPageY(KhxxPageRequestDTO request,String fuzeren);
    /**
     * 客户基础信息
     */
    List<Khxx> getKH();
    /**
     * 带乐观锁检查的更新方法
     */
    Result<String> updateWithLock(Khxx khxx);
    /**
     * 获取最后一位id
     */
    Long getLastId();

}