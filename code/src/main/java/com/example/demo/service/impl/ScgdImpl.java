package com.example.demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Scgd;
import com.example.demo.mapper.ScgdMapper;
import com.example.demo.service.ScgdService;
import com.example.demo.util.PageResult;
import com.example.demo.util.ScgdSearchRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class ScgdImpl extends ServiceImpl<ScgdMapper, Scgd> implements ScgdService {

    @Override
    public PageResult<Scgd> getScgdPage(ScgdSearchRequest request) {
        long startTime = System.currentTimeMillis();
        try {
            // 计算分页范围（注意：ROW_NUMBER 从1开始）
            long start = (long) (request.getPageNum() - 1) * request.getPageSize() + 1;
            long end = (long) request.getPageNum() * request.getPageSize();
            int pageSize = request.getPageSize();

            // 构建查询条件
            LambdaQueryWrapper<Scgd> wrapper = buildQueryWrapper(request);

            // 使用 SQL Server 分页查询数据
            List<Scgd> records = baseMapper.selectForPage(start, end, wrapper);

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

    private LambdaQueryWrapper<Scgd> buildQueryWrapper(ScgdSearchRequest request) {
        LambdaQueryWrapper<Scgd> wrapper = Wrappers.lambdaQuery();

        // 客户名称查询
        if (StringUtils.hasText(request.getKhcm())) {
            wrapper.like(Scgd::getKhcm, request.getKhcm().trim());
        }

        // 联系人查询
        if (StringUtils.hasText(request.getLxr())) {
            wrapper.like(Scgd::getLxr, request.getLxr().trim());
        }

        // 负责人查询
        if (StringUtils.hasText(request.getFzr())) {
            wrapper.like(Scgd::getFzr, request.getFzr().trim());
        }

        // 开票状态查询
        if (StringUtils.hasText(request.getKpzt())) {
            wrapper.eq(Scgd::getKpzt, request.getKpzt().trim());
        }

        // 时间段查询
        if (StringUtils.hasText(request.getStartDate())) {
            wrapper.ge(Scgd::getDdrq, request.getStartDate().trim());
        }
        if (StringUtils.hasText(request.getEndDate())) {
            wrapper.le(Scgd::getDdrq, request.getEndDate().trim());
        }

        // 默认只查询待处理状态
        wrapper.eq(Scgd::getZt, "待处理");

        return wrapper;
    }

    @Override
    public int insert(Scgd shengchan) {
        if (shengchan == null) {
            return 0;
        }
        return baseMapper.insert(shengchan);
    }

    @Override
    public int update(Scgd shengchan) {
        if (shengchan == null || shengchan.getId() == null) {
            return 0;
        }
        return baseMapper.update(shengchan);
    }

    /**
     * 更新状态
     */
    @Override
    public boolean updateStatus(Integer id, String zt) {
        if (id == null || !StringUtils.hasText(zt)) {
            return false;
        }
        return baseMapper.updateStatusById(id, zt);
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
    public boolean saveOrUpdateScgd(Scgd shengchan) {
        if (shengchan == null) {
            return false;
        }

        if (shengchan.getId() != null && shengchan.getId() > 0) {
            // 更新
            int affectedRows = baseMapper.update(shengchan);
            return affectedRows > 0;
        } else {
            // 新增
            int affectedRows = baseMapper.insert(shengchan);
            return affectedRows > 0;
        }
    }
    @Override
    public List<Scgd> getListRE(String fuzeren){
        return baseMapper.getListRE(fuzeren);
    }

}