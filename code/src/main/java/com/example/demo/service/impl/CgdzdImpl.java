package com.example.demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Cgdzd;
import com.example.demo.entity.Cgmx;


import com.example.demo.mapper.CgdzdMapper;
import com.example.demo.service.CgdzdService;
import com.example.demo.util.PageRequestDTO;
import com.example.demo.util.PageResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;

@Service
public class CgdzdImpl extends ServiceImpl<CgdzdMapper, Cgdzd> implements CgdzdService {


    @Override
    public PageResult<Cgdzd> getCgmxPage(PageRequestDTO request) {
        long startTime = System.currentTimeMillis();
        try {
            // 计算分页范围（注意：ROW_NUMBER 从1开始）
            long start = (long) (request.getPageNum() - 1) * request.getPageSize() + 1;
            long end = (long) request.getPageNum() * request.getPageSize();
            int pageSize = request.getPageSize();
            String startdate=request.getStartDate();
            String enddate=request.getEndDate();
            String ddh=request.getDdh();
            String khmc=request.getKhmc();
            // 构建查询条件
            LambdaQueryWrapper<Cgdzd> wrapper = buildQueryWrapper(request);

            // 使用 SQL Server 分页查询数据
            List<Cgdzd> records = baseMapper.selectForPage(start, end,startdate,enddate,ddh,khmc, wrapper);

            // 查询总记录数
            Long totalCount = baseMapper.selectCountForPage(wrapper);

            // 计算总页数
            Long totalPages = (totalCount + pageSize - 1) / pageSize;

            return new PageResult<>(records, totalCount, totalPages);
        } catch (Exception e) {
            log.error("分页查询失败", e);
            throw new RuntimeException("查询失败: " + e.getMessage());
        }
    }
    @Override
    public List<Cgdzd> getDetailByDdh(String ddh) {
        return baseMapper.getDetailByDdh(ddh);
    }


    private LambdaQueryWrapper<Cgdzd> buildQueryWrapper(PageRequestDTO request) {
        LambdaQueryWrapper<Cgdzd> wrapper = Wrappers.lambdaQuery();

        // 关键词搜索
        if (StringUtils.hasText(request.getKeyword())) {
            String keyword = request.getKeyword().trim();
            wrapper.and(w -> w
                    .like(Cgdzd::getCpxh, keyword)
                    .or()
                    .like(Cgdzd::getDj, keyword)
                    .or()
                    .like(Cgdzd::getKhcm, keyword)
            );
        }
        // 修正：返回 wrapper 而不是 null
        return wrapper;
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
