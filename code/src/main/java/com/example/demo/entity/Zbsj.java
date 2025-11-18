package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("xiaoshoudan")
public class Zbsj {
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
     * 客户名
     */
    private String shdw;
    /**
     * 编号
     */
    private String bh;
    /**
     * 名称
     */
    private String mc;
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
     * 锯工费
     */
    private String jgf;
    /**
     * 快递费
     */
    private String kdf;
    /**
     * 付款方式
     */
    private String fkfs;
    /**
     * 是否含税
     */
    private String sfhs;
    /**
     * 是否月结
     */
    private String sfyj;
    /**
     * 不含税金额
     */
    private String bhsje;

}
