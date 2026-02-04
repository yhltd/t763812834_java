package com.example.demo.util;

import lombok.Data;

import java.util.Date;

@Data
public class PageRequest {
    private Integer pageNum = 1;
    private Integer pageSize = 10;
    private String ddh;
    private String khmc;
    private String fzr;
    private String bm;
    private String startDate;
    private String endDate;
    private String yingfuStartDate;  // 付款开始日期
    private String yingfuEndDate;    // 付款结束日期
    private Boolean weifuZero;       // 未付金额为0
    private String sortField;
    private String sortOrder;
    private String duizhangdanhao;
    private String sfkp;
}
