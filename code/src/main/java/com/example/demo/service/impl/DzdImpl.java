package com.example.demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Ddmx;
import com.example.demo.entity.Dzd;
import com.example.demo.mapper.DzdMapper;
import com.example.demo.service.DzdService;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class DzdImpl extends ServiceImpl<DzdMapper, Dzd> implements DzdService {


    @Override
    public Page<Map<String, Object>> selectDistinctByDdhPage(Page<Map<String, Object>> page,
                                                             Wrapper<Map<String, Object>> queryWrapper) {

        // 计算分页参数
        long start = (page.getCurrent() - 1) * page.getSize();
        long end = page.getSize(); // 修正：这里应该是page size

        // 查询数据
        List<Map<String, Object>> records = baseMapper.selectDistinctByDdhForPage(start, end, queryWrapper);

        // 查询总数
        Long total = baseMapper.selectDistinctCount(queryWrapper);

        // 设置分页结果
        page.setRecords(records);
        page.setTotal(total);

        return page;
    }

    @Override
    public Page<Map<String, Object>> selectDistinctByDdhPageY(Page<Map<String, Object>> page,
                                                             Wrapper<Map<String, Object>> queryWrapper ,String fuzeren) {

        // 计算分页参数
        long start = (page.getCurrent() - 1) * page.getSize();
        long end = page.getSize(); // 修正：这里应该是page size

        // 查询数据
        List<Map<String, Object>> records = baseMapper.selectDistinctByDdhForPageY(start, end, queryWrapper,fuzeren);

        // 查询总数
        Long total = baseMapper.selectDistinctCountY(queryWrapper,fuzeren);

        // 设置分页结果
        page.setRecords(records);
        page.setTotal(total);

        return page;
    }

    @Override
    public List<Ddmx> getDetailByDdh(String ddh) {
        return baseMapper.getDetailByDdh(ddh);
    }

    @Override
    @Transactional
    public boolean updateDzztStatus(String ddh, String dzzt) {
        try {
            // 根据订单号更新对账状态
            int result = baseMapper.updateDzztStatusByDdh(ddh, dzzt);
            return result > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
