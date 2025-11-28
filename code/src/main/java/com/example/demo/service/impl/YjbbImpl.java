package com.example.demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.example.demo.entity.Yjbb;

import com.example.demo.mapper.YjbbMapper;
import com.example.demo.service.YjbbService;

import com.example.demo.util.PageRequestDTO;
import com.example.demo.util.PageResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Slf4j
@Service
public class YjbbImpl extends ServiceImpl<YjbbMapper, Yjbb> implements YjbbService {
    @Autowired
    YjbbMapper yjbbMapper;
    @Override
    public PageResult<Yjbb> getYjbbPage(PageRequestDTO request) {
        long startTime = System.currentTimeMillis();
        try {
            // 计算分页范围（注意：ROW_NUMBER 从1开始）
            long start = (long) (request.getPageNum() - 1) * request.getPageSize() + 1;
            long end = (long) request.getPageNum() * request.getPageSize();
            int pageSize = request.getPageSize();
            String selectedYear=request.getSelectedYear();
            // 构建查询条件
            LambdaQueryWrapper<Yjbb> wrapper = buildQueryWrapper(request);

            // 使用 SQL Server 分页查询数据
            List<Yjbb> records = baseMapper.selectForPage(start, end,selectedYear, wrapper);

            // 查询总记录数
            Long totalCount = baseMapper.selectCountForPage(wrapper);

            // 计算总页数
            Long totalPages = (totalCount + pageSize - 1) / pageSize;

            log.info("SQL Server分页查询完成，页码: {}, 页大小: {}, 范围: {}-{}, 总记录数: {}, 耗时: {}ms",
                    request.getPageNum(), pageSize, start, end,
                    totalCount, System.currentTimeMillis() - startTime);

            return new PageResult<>(records, totalCount, totalPages);
        } catch (Exception e) {
            log.error("分页查询失败", e);
            throw new RuntimeException("查询失败: " + e.getMessage());
        }
    }

    @Override
    public List<Yjbb> getfzr() {

        return yjbbMapper.getfzr();
    }

    private LambdaQueryWrapper<Yjbb> buildQueryWrapper(PageRequestDTO request) {
        LambdaQueryWrapper<Yjbb> wrapper = Wrappers.lambdaQuery();

        // 关键词搜索
        if (StringUtils.hasText(request.getKeyword())) {
            String keyword = request.getKeyword().trim();
            wrapper.and(w -> w
                    .like(Yjbb::getGh, keyword)
                    .or()
                    .like(Yjbb::getLiuyue, keyword)
                    .or()
                    .like(Yjbb::getEryue, keyword)
            );
        }
        return null;
    }

}