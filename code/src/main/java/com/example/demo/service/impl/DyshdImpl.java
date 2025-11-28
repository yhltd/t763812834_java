package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.example.demo.entity.Dyshd;

import com.example.demo.entity.Yjbb;
import com.example.demo.mapper.DyshdMapper;
import com.example.demo.service.DyshdService;
import com.example.demo.util.PageRequestDTO;
import com.example.demo.util.PageResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Slf4j
@Service
public class DyshdImpl extends ServiceImpl<DyshdMapper, Dyshd> implements DyshdService {
    @Autowired
    DyshdMapper dyshdMapper;

    @Override
    public List<Dyshd> getddh() {
        return dyshdMapper.getddh();
    }

    @Override
    public PageResult<Dyshd> getshdlist(PageRequestDTO request){
        String ddh=request.getDdh();
        log.info("接收到的ddh参数值: {}", ddh);
        log.debug("请求参数详情 - ddh: {}, 完整request: {}", ddh, request);
        List<Dyshd> records = baseMapper.getshdlist(ddh);
        return new PageResult<>(records);
    }

    /**
     * 更新状态
     */
    @Override
    public boolean updateShipDate(Integer id, String shipDate) {
        if (id == null || !StringUtils.hasText(shipDate)) {
            return false;
        }
        return baseMapper.updateShipDate(id, shipDate);
    }


    @Override
    public boolean batchUpdateShipDate(List<Integer> ids, String shipDate) {
        if (ids == null || ids.isEmpty() || !StringUtils.hasText(shipDate)) {
            System.out.println("批量更新发货日期参数验证失败: ids=" + ids + ", shipDate=" + shipDate);
            return false;
        }

        try {
            System.out.println("开始批量更新发货日期: ids=" + ids + ", shipDate=" + shipDate);
            int affectedRows = baseMapper.batchUpdateShipDate(ids, shipDate);
            System.out.println("批量更新发货日期影响行数: " + affectedRows);
            return affectedRows > 0;
        } catch (Exception e) {
            System.out.println("批量更新发货日期异常: " + e.getMessage());
            log.error("批量更新发货日期失败", e);
            return false;
        }
    }
}