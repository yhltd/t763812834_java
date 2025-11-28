package com.example.demo.util;

import lombok.Data;
import java.util.Map;

@Data
public class PageRequestDTO {
    private Integer pageNum = 1;
    private Integer pageSize = 20;
    private String keyword;
    private String selectedYear;
    private String startDate;
    private String endDate;
    private String khmc;
    private String ddh;
    private Map<String, Object> filters;

}