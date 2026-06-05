package com.example.demo.entity;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.Version;
import lombok.Data;

@Data
@TableName("caigoumingxi")
public class Cgdzd {

    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;
    /**
     * 版本号，用于乐观锁
     */
    @Version
    private Integer version;

    /**
     * 订单日期
     */
    private String ddrq;
    /**
     * 客户名称
     */
    private String khcm;
    /**
     * 产品名称
     */
    private String pp;
    /**
     * 规格型号
     */
    private String cpxh;
    /**
     * 数量
     */
    private String sl;
    /**
     * 单价
     */
    private String dj;
    /**
     * 总价
     */
    private String hj;

    private String htbh;

    private String bz;

    private String zbz;
    /**
     * 开票时间
     */
    private String kprq;

    private String qkje;

    private String yfje;
    private String dzzt;
}
