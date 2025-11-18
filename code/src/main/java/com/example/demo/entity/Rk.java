package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("ruku")
public class Rk {
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
     * 供应商
     */
    private String gys;
    /**
     * 商品名称
     */
    private String mc;
    /**
     * 数量
     */
    private String rksl;
    /**
     * 单价
     */
    private String rkdj;
    /**
     * 重量
     */
    private String rkzl;
    /**
     * 总金额
     */
    private String zje;
    /**
     * 付款方式
     */
    private String fkfs;
    /**
     * 库存均价
     */
    private String kcjj;
    private String danhao;
}
