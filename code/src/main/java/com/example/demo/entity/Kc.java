package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
@Data
@TableName("kucun")
public class Kc {
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
    private String mc;
    /**
     * 期初数量
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
    /**
     * 进货数量
     */
    private String rksl;
    /**
     * 进货单价
     */
    private String rkdj;
    /**
     * 进货总金额
     */
    private String rkzje;
    /**
     * 出库数量
     */
    private String js;
    /**
     * 出库单价
     */
    private String dj;
    /**
     * 出库总金额
     */
    private String zje;
    /**
     * 结存数量
     */
    private String jcsl;
    /**
     * 结存单价
     */
    private String jcdj;
    /**
     * 结存总金额
     */
    private String jczje;
}
