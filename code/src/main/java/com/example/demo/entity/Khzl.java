package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("kehuziliao")
public class Khzl {
    /**
     * id自增列
     */
    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;
    /**
     * 公司名
     */
    private String gsm;
    /**
     * 编号
     */
    private String bh;
    /**
     * 联系人
     */
    private String lxr;
    /**
     * 联系电话
     */
    private String lxdh;
    /**
     * 地址
     */
    private String dz;
    /**
     * 是否含税
     */
    private String sfhs;
    /**
     * 是否月结
     */
    private String sfyj;
    /**
     * 起初余额
     */
    private String qcye;
    /**
     * 铜渣库存
     */
    private String tzkc;
    /**
     * 铜块库存
     */
    private String tkkc;
    /**
     * 应收金额
     */
    private String ysje;
    /**
     * 快递代收金额
     */
    private String kddsje;

    /**
     * 跟单
     */
    private String gd;
    /**
     * 公司名和编号辅助
     */
    private String fuzhu;

}
