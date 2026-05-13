package com.example.demo.util;

import lombok.Data;

@Data
public class WorkOrderRequest {
    private Integer id;
    private String scgd;
    private Integer printCount;
}