package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Xdmx;
import com.example.demo.util.PageResult;
import com.example.demo.util.SaveToOrderDetailRequest;
import com.example.demo.util.ScgdSearchRequest;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface XdmxService extends IService<Xdmx> {
    /**
     * 分页查询客户信息
     */
    PageResult<Xdmx> getScgdPage(ScgdSearchRequest request);
    PageResult<Xdmx> getScgdPageYW(ScgdSearchRequest request,String fuzeren);

    /**
     * 新增记录
     */
    int insert(Xdmx shengchan);

    /**
     * 更新记录
     */
    int update(Xdmx shengchan);

    /**
     * 根据ID删除
     */
    boolean deleteById(Integer id);

    /**
     * 更新状态
     */
    boolean updateStatus(Integer id, String zt);

    List<Xdmx> getListRE(String fuzeren);

    Xdmx getWorkOrderInfo(Integer id);

    boolean generateWorkOrder(Integer id, String scgd, Integer printCount);

    Xdmx updatePrintCount(Integer id);

    /**
     * 生成工单号 - 新增方法
     */
    String generateWorkOrderNumber();

    /**
     * 根据合同编号更新状态为下单
     */
    int updateZtByHtbh(String htbh);
}