package com.example.demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Ddmx;
import com.example.demo.entity.Xdmx;
import com.example.demo.mapper.XdmxMapper;
import com.example.demo.service.DdmxService;
import com.example.demo.service.PzbService;
import com.example.demo.service.XdmxService;
import com.example.demo.util.PageResult;
import com.example.demo.util.SaveToOrderDetailRequest;
import com.example.demo.util.ScgdSearchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class XdmxImpl extends ServiceImpl<XdmxMapper, Xdmx> implements XdmxService {

    @Autowired
    private PzbService pzbService;

    @Override
    public PageResult<Xdmx> getScgdPage(ScgdSearchRequest request) {
        long startTime = System.currentTimeMillis();
        try {
            // 计算分页范围（注意：ROW_NUMBER 从1开始）
            long start = (long) (request.getPageNum() - 1) * request.getPageSize() + 1;
            long end = (long) request.getPageNum() * request.getPageSize();
            int pageSize = request.getPageSize();

            // 构建查询条件
            LambdaQueryWrapper<Xdmx> wrapper = buildQueryWrapper(request);

            // 使用 SQL Server 分页查询数据
            List<Xdmx> records = baseMapper.selectForPage(start, end, wrapper);

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
    public PageResult<Xdmx> getScgdPageYW(ScgdSearchRequest request, String fuzeren) {
        long startTime = System.currentTimeMillis();
        try {
            // 计算分页范围
            long start = (long) (request.getPageNum() - 1) * request.getPageSize() + 1;
            long end = (long) request.getPageNum() * request.getPageSize();
            int pageSize = request.getPageSize();

            // 构建查询条件
            LambdaQueryWrapper<Xdmx> wrapper = buildQueryWrapper(request);

            // 使用 SQL Server 分页查询数据
            List<Xdmx> records = baseMapper.selectForPageYW(start, end, wrapper, fuzeren);

            // 查询总记录数
            Long totalCount = baseMapper.selectCountForPageYW(wrapper, fuzeren);

            // 计算总页数
            Long totalPages = (totalCount + pageSize - 1) / pageSize;

            return new PageResult<>(records, totalCount, totalPages);
        } catch (Exception e) {
            log.error("分页查询失败", e);
            throw new RuntimeException("查询失败: " + e.getMessage());
        }
    }


    private LambdaQueryWrapper<Xdmx> buildQueryWrapper(ScgdSearchRequest request) {
        LambdaQueryWrapper<Xdmx> wrapper = Wrappers.lambdaQuery();

        // 客户名称查询
        if (StringUtils.hasText(request.getKhcm())) {
            wrapper.like(Xdmx::getKhcm, request.getKhcm().trim());
        }

        // 联系人查询
        if (StringUtils.hasText(request.getLxr())) {
            wrapper.like(Xdmx::getLxr, request.getLxr().trim());
        }

        // 负责人查询
        if (StringUtils.hasText(request.getFzr())) {
            wrapper.like(Xdmx::getFzr, request.getFzr().trim());
        }

        // 开票状态查询
        if (StringUtils.hasText(request.getKpzt())) {
            wrapper.eq(Xdmx::getKpzt, request.getKpzt().trim());
        }

        // 时间段查询
        if (StringUtils.hasText(request.getStartDate())) {
            wrapper.ge(Xdmx::getDdrq, request.getStartDate().trim());
        }
        if (StringUtils.hasText(request.getEndDate())) {
            wrapper.le(Xdmx::getDdrq, request.getEndDate().trim());
        }

        // 默认只查询下单状态
        wrapper.eq(Xdmx::getZt, "下单");

        return wrapper;
    }

    @Override
    public int insert(Xdmx shengchan) {
        if (shengchan == null) {
            return 0;
        }
        return baseMapper.insert(shengchan);
    }

    @Override
    public int update(Xdmx shengchan) {
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
    public boolean saveOrUpdateScgd(Xdmx shengchan) {
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
    public List<Xdmx> getListRE(String fuzeren){
        return baseMapper.getListRE(fuzeren);
    }

    @Override
    public Xdmx getWorkOrderInfo(Integer id) {
        try {
            return this.getById(id);
        } catch (Exception e) {
            log.error("获取工单信息失败", e);
            throw new RuntimeException("获取工单信息失败: " + e.getMessage());
        }
    }

    @Override
    public boolean generateWorkOrder(Integer id, String scgd, Integer printCount) {
        try {
            Xdmx entity = new Xdmx();
            entity.setId(id);

            // 如果前端传入的 scgd 为空，则自动生成
            if (scgd == null || scgd.trim().isEmpty()) {
                entity.setScgd(generateWorkOrderNumber());
            } else {
                entity.setScgd(scgd);
            }

            // 修改：printCount 改为字符串类型
            entity.setPrintCount(printCount != null ? printCount.toString() : "1");
            return this.updateById(entity);
        } catch (Exception e) {
            log.error("生成工单号失败", e);
            return false;
        }
    }

    @Override
    public Xdmx updatePrintCount(Integer id) {
        try {
            // 先获取当前记录
            Xdmx entity = this.getById(id);
            if (entity == null) {
                throw new RuntimeException("记录不存在");
            }

            // 修改：更新打印次数，处理字符串类型
            String currentCountStr = entity.getPrintCount();
            int currentCount = 0;

            if (currentCountStr != null && !currentCountStr.trim().isEmpty()) {
                try {
                    currentCount = Integer.parseInt(currentCountStr.trim());
                } catch (NumberFormatException e) {
                    currentCount = 0; // 如果解析失败，重置为0
                }
            }

            // 增加打印次数并保存为字符串
            entity.setPrintCount(String.valueOf(currentCount + 1));

            // 保存更新
            this.updateById(entity);

            // 返回更新后的记录
            return this.getById(id);

        } catch (Exception e) {
            log.error("更新打印次数失败", e);
            throw new RuntimeException("更新打印次数失败: " + e.getMessage());
        }
    }

    /**
     * 生成工单号 - 工具方法
     */
    public String generateWorkOrderNumber() {
        LocalDate currentDate = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String datePart = currentDate.format(formatter);

        // 查询当天最大的工单号
        String maxWorkOrderNumber = baseMapper.getMaxWorkOrderNumberByDate(datePart);

        int sequence = 1;
        if (maxWorkOrderNumber != null && maxWorkOrderNumber.startsWith("GD" + datePart)) {
            // 提取现有的序号
            String sequenceStr = maxWorkOrderNumber.substring(10); // 去掉 "GD" + "yyyyMMdd"
            try {
                sequence = Integer.parseInt(sequenceStr) + 1;
            } catch (NumberFormatException e) {
                sequence = 1;
            }
        }

        return "GD" + datePart + String.format("%03d", sequence);
    }

    @Override
    public int updateZtByHtbh(String htbh) {
        return baseMapper.updateZtByHtbh(htbh);
    }



}
