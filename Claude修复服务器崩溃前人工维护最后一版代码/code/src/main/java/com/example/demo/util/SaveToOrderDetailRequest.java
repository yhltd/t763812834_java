package com.example.demo.util;

import lombok.Data;

@Data
public class SaveToOrderDetailRequest {
    /**
     * 订单ID
     */
    private Integer id;

    /**
     * 订单日期
     */
    private String ddrq;

    /**
     * 订单号
     */
    private String ddh;

    /**
     * 客户简称
     */
    private String khjc;

    /**
     * 负责人
     */
    private String fzr;

    /**
     * 部门
     */
    private String bm;

    /**
     * 联系人
     */
    private String lxr;

    /**
     * 联系电话
     */
    private String lxdh;

    /**
     * 客户名称
     */
    private String khmc;

    /**
     * 开票状态
     */
    private String sfkp;

    /**
     * 备注
     */
    private String bz;

    /**
     * 发货时间
     */
    private String fhsj;

    /**
     * 折扣
     */
    private String zk;

    /**
     * 已付款时间
     */
    private String yfsj;

    /**
     * 物流单号
     */
    private String wldh;

    /**
     * 未付
     */
    private String wf;

    /**
     * 已付
     */
    private String yifu;

    /**
     * 提成点
     */
    private String tcd;
}
