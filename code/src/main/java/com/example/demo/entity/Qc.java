package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("qichu")
public class Qc {
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
     * 商品名称
     */
    private String spmc;
    /**
     * 期出数量
     */
    private String qcsl;
    /**
     * 期初单价
     */
    private String qcdj;
    /**
     * 期初总金额
     */
    private String qczje;

}
