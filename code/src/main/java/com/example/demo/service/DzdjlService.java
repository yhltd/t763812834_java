package com.example.demo.service;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Ddmx;
import com.example.demo.entity.Dzd;
import com.example.demo.util.BatchInvoiceRequest;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface DzdjlService extends IService<Dzd> {

    /**
     * 分页查询去重数据
     */
    Page<Map<String, Object>> selectDistinctByDdhPage(Page<Map<String, Object>> page,
                                                      @Param(Constants.WRAPPER) Wrapper<Map<String, Object>> queryWrapper);


    Page<Map<String, Object>> selectDistinctByDdhPageY(Page<Map<String, Object>> page,
                                                       @Param(Constants.WRAPPER) Wrapper<Map<String, Object>> queryWrapper,String fuzeren);



    Page<Map<String, Object>> daochuexcel(Page<Map<String, Object>> page,
                                          @Param(Constants.WRAPPER) Wrapper<Map<String, Object>> queryWrapper);


    Page<Map<String, Object>> daochuexcely(Page<Map<String, Object>> page,
                                           @Param(Constants.WRAPPER) Wrapper<Map<String, Object>> queryWrapper,String fuzeren);

    /**
     * 根据订单号获取详细信息
     */
    List<Ddmx> getDetailByDdh(String duizhangdanhao);

    /**
     * 更新对账状态
     */
    boolean updateDzztStatusByDuizhangdanhao(String duizhangdanhao,String sfkp);

    /**
     * 批量更新开票状态
     * @param request 开票请求
     * @return 是否成功
     */
    boolean batchUpdateInvoiceStatus(BatchInvoiceRequest request);

    String getCurrentPdfFileName(String duizhangdanhao);
    boolean updatePdfFileNameByDdh(String duizhangdanhao, String dzscwj);

    int updateByDdh(Map<String, Object> updateParams);

}
