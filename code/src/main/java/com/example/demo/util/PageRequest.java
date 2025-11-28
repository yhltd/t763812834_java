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
    private Date startDate;
    private Date endDate;
}
