package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.example.demo.entity.Dyshd;
import com.example.demo.entity.Yjbb;
import com.example.demo.util.PageRequestDTO;
import com.example.demo.util.PageResult;

import java.util.List;

public interface DyshdService extends IService<Dyshd> {

    List<Dyshd> getddh();
    PageResult<Dyshd> getshdlist(PageRequestDTO request);

    boolean updateShipDate(Integer id, String shipDate);
    boolean batchUpdateShipDate(List<Integer> ids, String shipDate);
}
