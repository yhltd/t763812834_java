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
    public boolean updateShipDate(Integer id, String shipDate, String ddh) {
        if (id == null || !StringUtils.hasText(shipDate)) {
            return false;
        }

        // 更新发货时间
        boolean updateSuccess = baseMapper.updateShipDate(id, shipDate);

        if (updateSuccess && StringUtils.hasText(ddh)) {
            // 检查并更新发货状态
            updateShipStatusByDdh(ddh);
        }

        return updateSuccess;
    }

    /**
     * 根据合同号更新发货状态
     */
    private void updateShipStatusByDdh(String ddh) {
        // 1. 获取合同号对应的总记录数
        Integer totalCount = baseMapper.countByDdh(ddh);

        // 2. 获取待发货的数量
        Integer pendingCount = baseMapper.countPendingByDdh(ddh);

        // 3. 根据条件更新发货状态
        if (pendingCount == null || totalCount == null || totalCount == 0) {
            return;
        }

        if (pendingCount == 0) {
            // 全部已发货
            baseMapper.updateShipStatus(ddh, "全部发货");
            System.out.println("合同号 " + ddh + " 已全部发货，更新状态为：全部发货");
        } else if (pendingCount < totalCount) {
            // 部分发货
            baseMapper.updateShipStatus(ddh, "部分发货");
            System.out.println("合同号 " + ddh + " 部分发货，更新状态为：部分发货");
        } else {
            // 全部未发货（理论上不会发生，因为刚发了货）
            baseMapper.updateShipStatus(ddh, "全部未发货");
            System.out.println("合同号 " + ddh + " 全部未发货，更新状态为：全部未发货");
        }
    }


    @Override
    public boolean batchUpdateShipDate(List<Integer> ids, String shipDate,String ddh) {
        if (ids == null || ids.isEmpty() || !StringUtils.hasText(shipDate)) {
            System.out.println("批量更新发货日期参数验证失败: ids=" + ids + ", shipDate=" + shipDate);
            return false;
        }

        try {
            System.out.println("开始批量更新发货日期: ids=" + ids + ", shipDate=" + shipDate);
            int affectedRows = baseMapper.batchUpdateShipDate(ids, shipDate);

            System.out.println("批量更新发货日期影响行数: " + affectedRows);
            if (affectedRows > 0) {
                // 检查并更新发货状态
                updateShipStatusByDdh(ddh);
            }
            return affectedRows > 0;
        } catch (Exception e) {
            System.out.println("批量更新发货日期异常: " + e.getMessage());
            log.error("批量更新发货日期失败", e);
            return false;
        }
    }
}