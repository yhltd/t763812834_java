package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("qianhuidan")
public class Qhd {
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
     * 公司名
     */
    private String gsm;
    /**
     * 品名
     */
    private String pm;
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


    private String ysje;

    private String zys;

    private String bz;

    private String bh;

}
