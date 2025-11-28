package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("shengchangongdan")
public class Scgd {

    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;
    /**
     * 序号
     */
    private String xh;
    /**
     * 客户名称
     */
    private String khcm;
    /**
     * 联系人
     */
    private String lxr;
    /**
     * 联系电话
     */
    private String lxdh;
    /**
     * 订单日期
     */
    private String ddrq;
    /**
     * 产品名称
     */
    private String pp;
    /**
     * 产品型号
     */
    private String cpxh;
    /**
     * 订购数量
     */
    private String sl;
    /**
     * 含税单价
     */
    private String dj;
    /**
     * 合计
     */
    private String hj;
    /**
     * 负责人
     */
    private String fzr;
    /**
     * 合同编号
     */
    private String htbh;
    /**
     * 状态
     */
    private String zt;
    /**
     * 备注
     */
    private String bz;
    /**
     * 备注
     */
    private String zbz;
    /**
     * 购方要求
     */
    private String yq;
    /**
     * 开票状态
     */
    private String kpzt;
    /**
     * 生产工单
     */
    private String scgd;

}
