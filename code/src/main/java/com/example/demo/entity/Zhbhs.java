package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("xiaoshoudan")
public class Zhbhs {
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
     * 税点
     */
    private String sd;
    /**
     * 不含税金额
     */
    private String bhsje;
}
