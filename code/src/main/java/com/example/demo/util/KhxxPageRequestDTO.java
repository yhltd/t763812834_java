package com.example.demo.util;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class KhxxPageRequestDTO extends PageRequestDTO {
    /**
     * 客户名称
     */
    private String khmc;

    /**
     * 负责人
     */
    private String fzr;

    /**
     * 建档开始日期
     */
    private String jdrqStart;

    /**
     * 建档结束日期
     */
    private String jdrqEnd;

    /**
     * 客户代表人
     */
    private String lxr1;
}