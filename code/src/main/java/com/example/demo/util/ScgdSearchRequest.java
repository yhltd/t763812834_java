package com.example.demo.util;

import lombok.Data;

@Data
public class ScgdSearchRequest {
    private Integer pageNum = 1;
    private Integer pageSize = 20;
    private String khcm;      // 客户名称
    private String lxr;       // 联系人
    private String fzr;       // 负责人
    private String kpzt;      // 开票状态
    private String startDate; // 开始日期
    private String endDate;   // 结束日期
}
