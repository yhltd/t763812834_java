package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("mingxi")
public class Mx {
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
     * 进货数量
     */
    private String rksl;

    /**
     * 进货单价
     */
    private String rkdj;
    /**
     * 进货质量
     */
    private String rkzl;
    /**
     * 进货总金额
     */
    private String zje;
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
    private String je;
    private  String zl;
    /**
     * 结存数量
     */
    private String kcsl;
    /**
     * 公司名
     */
    private String gsm;
    /**
     * 库存总金额
     */
    private String kczje;

    private String ziduan;
    private String danhao;

}
