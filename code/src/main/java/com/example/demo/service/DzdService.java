package com.example.demo.service;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Ddmx;
import com.example.demo.entity.Dzd;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface DzdService extends IService<Dzd> {

    /**
     * 分页查询去重数据
     */
    Page<Map<String, Object>> selectDistinctByDdhPage(Page<Map<String, Object>> page,
                                                      @Param(Constants.WRAPPER) Wrapper<Map<String, Object>> queryWrapper);


    Page<Map<String, Object>> selectDistinctByDdhPageY(Page<Map<String, Object>> page,
                                                      @Param(Constants.WRAPPER) Wrapper<Map<String, Object>> queryWrapper,String fuzeren);


    /**
     * 根据订单号获取详细信息
     */
    List<Ddmx> getDetailByDdh(String ddh);

    /**
     * 更新对账状态
     */
    boolean updateDzztStatus(String ddh, String dzzt);

}
