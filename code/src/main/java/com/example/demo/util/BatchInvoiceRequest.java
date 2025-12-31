package com.example.demo.util;

import lombok.Data;

import java.util.List;

@Data
public class BatchInvoiceRequest {
    /**
     * 订单号列表
     */
    private List<Object> ddhs;

    /**
     * 开票时间
     */
    private String kpsj;

    /**
     * 开票状态
     */
    private String sfkp;
}