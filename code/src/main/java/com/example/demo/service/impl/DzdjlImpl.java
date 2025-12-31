package com.example.demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Ddmx;
import com.example.demo.entity.Dzd;
import com.example.demo.mapper.DzdjlMapper;
import com.example.demo.service.DzdjlService;
import com.example.demo.util.BatchInvoiceRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DzdjlImpl extends ServiceImpl<DzdjlMapper, Dzd> implements DzdjlService {

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
    public Page<Map<String, Object>> daochuexcel(Page<Map<String, Object>> page,
                                                 Wrapper<Map<String, Object>> queryWrapper) {

        // 计算分页参数
        long start = (page.getCurrent() - 1) * page.getSize();
        long end = page.getSize(); // 修正：这里应该是page size

        // 查询数据
        List<Map<String, Object>> records = baseMapper.daochuexcel(start, end, queryWrapper);

        // 查询总数
        Long total = baseMapper.selectDistinctCount(queryWrapper);

        // 设置分页结果
        page.setRecords(records);
        page.setTotal(total);

        return page;
    }

    @Override
    public Page<Map<String, Object>> daochuexcely(Page<Map<String, Object>> page,
                                                  Wrapper<Map<String, Object>> queryWrapper ,String fuzeren) {

        // 计算分页参数
        long start = (page.getCurrent() - 1) * page.getSize();
        long end = page.getSize(); // 修正：这里应该是page size

        // 查询数据
        List<Map<String, Object>> records = baseMapper.daochuexcely(start, end, queryWrapper,fuzeren);

        // 查询总数
        Long total = baseMapper.selectDistinctCountY(queryWrapper,fuzeren);

        // 设置分页结果
        page.setRecords(records);
        page.setTotal(total);

        return page;
    }

    @Override
    public List<Ddmx> getDetailByDdh(String duizhangdanhao) {
        return baseMapper.getDetailByDdh(duizhangdanhao);
    }

    @Override
    @Transactional
    public boolean updateDzztStatusByDuizhangdanhao(String duizhangdanhao, String sfkp) {
        try {
            // 根据对账单号更新
            boolean result = baseMapper.updateDzztStatusByDuizhangdanhao(duizhangdanhao, sfkp);
            System.out.println("更新结果，影响行数: " + result);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean batchUpdateInvoiceStatus(BatchInvoiceRequest request) {
        if (request == null || request.getDdhs() == null || request.getDdhs().isEmpty()) {
            throw new RuntimeException("开票数据不能为空");
        }

        List<Object> ddhsObj = request.getDdhs();  // 假设这是Object类型的列表

        // 转换为字符串列表，处理数字类型
        List<String> duizhangdanhaos = new ArrayList<>();

        for (Object obj : ddhsObj) {
            if (obj != null) {
                // 安全地转换为字符串
                String strValue;
                if (obj instanceof String) {
                    strValue = (String) obj;
                } else if (obj instanceof Integer) {
                    strValue = String.valueOf((Integer) obj);
                } else if (obj instanceof Long) {
                    strValue = String.valueOf((Long) obj);
                } else if (obj instanceof Double) {
                    // 如果是小数，去除小数部分
                    strValue = String.valueOf(((Double) obj).intValue());
                } else {
                    strValue = obj.toString();
                }

                if (!strValue.trim().isEmpty()) {
                    duizhangdanhaos.add(strValue);
                }
            }
        }

        if (duizhangdanhaos.isEmpty()) {
            throw new RuntimeException("没有有效的对账单号");
        }

        // 批量更新开票状态
        QueryWrapper<Dzd> wrapper = new QueryWrapper<>();
        wrapper.in("duizhangdanhao", duizhangdanhaos);  // 使用 in 条件，传入列表

        Dzd updateEntity = new Dzd();
        updateEntity.setSfkp(request.getSfkp()); // "已开票"
        updateEntity.setKpsj(request.getKpsj()); // 开票时间

        return this.update(updateEntity, wrapper);
    }

    @Override
    public String getCurrentPdfFileName(String duizhangdanhao) {
        return baseMapper.getpdffilename(duizhangdanhao);
    }

    @Override
    public boolean updatePdfFileNameByDdh(String duizhangdanhao, String dzscwj) {
        return baseMapper.updatePdfFileNameByDdh(duizhangdanhao,dzscwj);
    }

    @Override
    public int updateByDdh(Map<String, Object> updateParams) {
        String duizhangdanhao = (String) updateParams.get("duizhangdanhao");
        if (duizhangdanhao == null) {
            return 0;
        }

        // 移除ddh，因为它是条件不是更新字段
        updateParams.remove("duizhangdanhao");

        QueryWrapper<Dzd> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("duizhangdanhao", duizhangdanhao);

        Dzd updateEntity = new Dzd();


        return baseMapper.update(updateEntity, queryWrapper);
    }

}

