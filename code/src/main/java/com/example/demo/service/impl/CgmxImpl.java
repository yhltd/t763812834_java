package com.example.demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Cgmx;

import com.example.demo.mapper.CgmxMapper;

import com.example.demo.service.CgmxService;

import com.example.demo.util.PageRequestDTO;
import com.example.demo.util.PageResult;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CgmxImpl extends ServiceImpl<CgmxMapper, Cgmx> implements CgmxService {

    @Override
    public PageResult<Cgmx> getCgmxPage(PageRequestDTO request) {
        long startTime = System.currentTimeMillis();
        try {
            // 计算分页范围（注意：ROW_NUMBER 从1开始）
            long start = (long) (request.getPageNum() - 1) * request.getPageSize() + 1;
            long end = (long) request.getPageNum() * request.getPageSize();
            int pageSize = request.getPageSize();

            // 构建查询条件
            LambdaQueryWrapper<Cgmx> wrapper = buildQueryWrapper(request);

            // 使用 SQL Server 分页查询数据
            List<Cgmx> records = baseMapper.selectForPage(start, end, wrapper);

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

    private LambdaQueryWrapper<Cgmx> buildQueryWrapper(PageRequestDTO request) {
        LambdaQueryWrapper<Cgmx> wrapper = Wrappers.lambdaQuery();

        // 关键词搜索
        if (StringUtils.hasText(request.getKeyword())) {
            String keyword = request.getKeyword().trim();
            wrapper.and(w -> w
                    .like(Cgmx::getCpxh, keyword)
                    .or()
                    .like(Cgmx::getDj, keyword)
                    .or()
                    .like(Cgmx::getKhcm, keyword)
            );
        }
        // 修正：返回 wrapper 而不是 null
        return wrapper;
    }

    @Override
    public Map<String, Object> searchCgmx(String keyword, Integer pageNum, Integer pageSize) {
        Map<String, Object> result = new HashMap<>();

        try {
            // 设置默认值
            if (pageNum == null) pageNum = 1;
            if (pageSize == null) pageSize = 20;

            // 计算分页范围
            long start = (long) (pageNum - 1) * pageSize + 1;
            long end = (long) pageNum * pageSize;

            // 构建查询条件 - 主要查询 khcm 字段
            LambdaQueryWrapper<Cgmx> wrapper = Wrappers.lambdaQuery();
            if (StringUtils.hasText(keyword)) {
                wrapper.like(Cgmx::getKhcm, keyword); // 主要查询客户名称字段
            }

            // 查询数据
            List<Cgmx> list = baseMapper.selectForPage(start, end, wrapper);
            // 查询总数
            Long total = baseMapper.selectCountForPage(wrapper);
            // 计算总页数
            Long pages = (total + pageSize - 1) / pageSize;

            result.put("list", list);
            result.put("total", total);
            result.put("pages", pages);
            result.put("pageNum", pageNum);
            result.put("pageSize", pageSize);

        } catch (Exception e) {
            log.error("搜索采购明细失败", e);
            throw new RuntimeException("搜索失败: " + e.getMessage());
        }

        return result;
    }



    @Override
    public int insert(Cgmx cgmx) {
        if (cgmx == null) {
            return 0;
        }
        return baseMapper.insert(cgmx);
    }

    @Override
    public int update(Cgmx cgmx) {
        if (cgmx == null || cgmx.getId() == null) {
            return 0;
        }
        return baseMapper.update(cgmx);
    }



    /**
     * 根据ID删除
     */
    @Override
    public boolean deleteById(Integer id) {
        if (id == null) {
            return false;
        }

        // 修正：Mapper 返回 boolean，直接返回
        return baseMapper.deleteById(id);
    }

    /**
     * 保存或更新 - 使用 MyBatis-Plus 自带的方法
     * 注意：这里重命名方法避免与接口冲突
     */
    public boolean saveOrUpdateCgmx(Cgmx cgmx) {
        if (cgmx == null) {
            return false;
        }

        if (cgmx.getId() != null && cgmx.getId() > 0) {
            // 更新
            int affectedRows = baseMapper.update(cgmx);
            return affectedRows > 0;
        } else {
            // 新增
            int affectedRows = baseMapper.insert(cgmx);
            return affectedRows > 0;
        }
    }


}