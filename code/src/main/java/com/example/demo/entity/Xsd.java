package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("xiaoshoudan")
public class Xsd {
    /**
     * id自增列
     */
    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;
    /**
     * 日期
     */
    private String riqi;
    /**
     * 单号
     */
    private String dh;
    /**
     * 收货单位
     */
    private String shdw;
    /**
     * 名称
     */
    private String mc;
    /**
     * 模号
     */
    private String mh;
    /**
     * 规格
     */
    private String gg;
    /**
     * 件数
     */
    private String js;
    /**
     * 重量
     */
    private String zl;
    /**
     * 单价
     */
    private String dj;
    /**
     * 金额
     */
    private String je;
    /**
     * 备注
     */
    private String bz;
    /**
     * 送货地址
     */
    private String shdz;
    /**
     * 快递单号
     */
    private String kddh;
    /**
     * 是否月结
     */
    private String sfyj;
    /**
     * 付款方式
     */
    private String fkfs;
    /**
     * 是否含税
     */
    private String sfhs;
    /**
     * 跟单
     */
    private String gd;
    /**
     * 制单人
     */
    private String zdr;
    /**
     * 收货单位及经手人
     */
    private String shdwjjsr;
    /**
     * 锯工费
     */
    private String jgf;
    /**
     * 快递费
     */
    private String kdf;
    /**
     * 含税单价
     */
    private String hsdj;
    /**
     * 税点
     */
    private String sd;
    /**
     * 未含税单价
     */
    private String whsdj;


    private String hjje;

    private String bzld;
    private String hjzl;
}
