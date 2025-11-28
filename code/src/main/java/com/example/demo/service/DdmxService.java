package com.example.demo.service;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Ddmx;
import org.apache.ibatis.annotations.Param;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface DdmxService extends IService<Ddmx> {

    /**
     * 分页查询去重数据
     */
    Page<Map<String, Object>> selectDistinctByDdhPage(Page<Map<String, Object>> page,
                                                      @Param(Constants.WRAPPER) Wrapper<Map<String, Object>> queryWrapper);

    Page<Map<String, Object>> selectDistinctByDdhPageY(Page<Map<String, Object>> page,
                                                      @Param(Constants.WRAPPER) Wrapper<Map<String, Object>> queryWrapper,String fuzeren);

    /**
     * 根据订单号获取详细信息
     */
    List<Ddmx> getDetailByDdh(String ddh ,String ddrq);

    /**
     * 根据订单号更新字段
     */
    int updateByDdh(Map<String, Object> updateParams);



    boolean withdrawOrder(String ddh);
    /**
     * 上传PDF文件
     */
    Map<String, Object> uploadPdf(String ddh, MultipartFile file) throws Exception;

    Map<String, Object> downloadPdf(String ddh);
    boolean deletePdf(String ddh);
    Map<String, Object> getPdfInfo(String ddh);

}
