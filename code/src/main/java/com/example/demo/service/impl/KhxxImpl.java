package com.example.demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Khxx;
import com.example.demo.mapper.KhxxMapper;
import com.example.demo.service.KhxxService;
import com.example.demo.util.KhxxPageRequestDTO;
import com.example.demo.util.PageResult;
import com.example.demo.util.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import java.util.List;

@Slf4j
@Service
public class KhxxImpl extends ServiceImpl<KhxxMapper, Khxx> implements KhxxService {

    @Override
    public PageResult<Khxx> getKhxxPage(KhxxPageRequestDTO request) {
        long startTime = System.currentTimeMillis();
        try {
            // 计算分页范围（注意：ROW_NUMBER 从1开始）
            long start = (long) (request.getPageNum() - 1) * request.getPageSize() + 1;
            long end = (long) request.getPageNum() * request.getPageSize();
            int pageSize = request.getPageSize();

            // 构建查询条件
            LambdaQueryWrapper<Khxx> wrapper = buildQueryWrapper(request);

            // 使用 SQL Server 分页查询数据
            List<Khxx> records = baseMapper.selectForPage(start, end, wrapper);

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
    public PageResult<Khxx> getKhxxPageY(KhxxPageRequestDTO request,String fuzeren) {
        long startTime = System.currentTimeMillis();
        try {
            // 计算分页范围（注意：ROW_NUMBER 从1开始）
            long start = (long) (request.getPageNum() - 1) * request.getPageSize() + 1;
            long end = (long) request.getPageNum() * request.getPageSize();
            int pageSize = request.getPageSize();

            // 构建查询条件
            LambdaQueryWrapper<Khxx> wrapper = buildQueryWrapper(request);

            // 使用 SQL Server 分页查询数据
            List<Khxx> records = baseMapper.selectForPageY(start, end, wrapper,fuzeren);

            // 查询总记录数
            Long totalCount = baseMapper.selectCountForPageY(wrapper,fuzeren);

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

    private LambdaQueryWrapper<Khxx> buildQueryWrapper(KhxxPageRequestDTO request) {
        LambdaQueryWrapper<Khxx> wrapper = Wrappers.lambdaQuery();

        // 客户名称筛选
        if (StringUtils.hasText(request.getKhmc())) {
            wrapper.like(Khxx::getKhmc, request.getKhmc().trim());
        }

        // 负责人筛选
        if (StringUtils.hasText(request.getFzr())) {
            wrapper.like(Khxx::getFzr, request.getFzr().trim());
        }

        // 建档日期时间段筛选
        if (StringUtils.hasText(request.getJdrqStart())) {
            wrapper.ge(Khxx::getJdrq, request.getJdrqStart().trim());
        }
        if (StringUtils.hasText(request.getJdrqEnd())) {
            wrapper.le(Khxx::getJdrq, request.getJdrqEnd().trim());
        }

        // 客户代表人筛选
        if (StringUtils.hasText(request.getLxr1())) {
            wrapper.like(Khxx::getLxr1, request.getLxr1().trim());
        }

        return wrapper;
    }

    @Override
    public List<Khxx> getKH() {
        return baseMapper.getKH();
    }

    /**
     * 带乐观锁检查的更新方法
     */
    public Result<String> updateWithLock(Khxx khxx) {
        try {
            // 检查数据是否存在
            Khxx existing = getById(khxx.getId());
            if (existing == null) {
                return Result.error("客户信息不存在");
            }

            // 如果前端没有传版本号，设置当前版本号
            if (khxx.getVersion() == null) {
                khxx.setVersion(existing.getVersion());
            }

            // 执行更新（MyBatis-Plus 会自动处理乐观锁）
            boolean success = updateById(khxx);
            if (success) {
                return Result.success("修改客户信息成功");
            } else {
                return Result.error("数据已被其他用户修改，请刷新后重试");
            }
        } catch (Exception e) {
            log.error("修改客户信息失败", e);
            return Result.error("修改失败: " + e.getMessage());
        }
    }

    public Long getLastId() {
        return baseMapper.getLastId();
    }

}