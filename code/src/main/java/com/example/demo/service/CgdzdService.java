package com.example.demo.service;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Cgdzd;
import com.example.demo.entity.Cgmx;
import com.example.demo.entity.Ddmx;
import com.example.demo.entity.Dzd;
import com.example.demo.util.PageRequestDTO;
import com.example.demo.util.PageResult;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface CgdzdService extends IService<Cgdzd> {

    /**
     * 分页查询客户信息
     */
    PageResult<Cgmx> getCgmxPage(PageRequestDTO request);

    /**
     * 根据订单号获取详细信息
     */
    List<Cgmx> getDetailByDdh(String ddh);


    /**
     * 更新对账状态
     */
    boolean updateDzztStatus(String ddh, String dzzt);

}
