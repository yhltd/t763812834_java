package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("caigoumingxi")
public class Cgmx {

    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;
    /**
     * 序号
     */
    /**
     * 客户名称
     */
    private String khcm;

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
     * 合同编号
     */
    private String htbh;

    /**
     * 备注
     */
    private String bz;
    /**
     * 备注
     */
    private String zbz;
    private String kprq;
    private String qkje;
    private String yfje;

}
