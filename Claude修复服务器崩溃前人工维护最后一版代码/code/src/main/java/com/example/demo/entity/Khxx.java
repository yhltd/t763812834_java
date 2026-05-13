package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.Version;
import lombok.Data;

@Data
@TableName("kehuxinxi")
public class Khxx {

    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;
    /**
     * 版本号，用于乐观锁
     */
    @Version
    private Integer version;
    /**
     * 客户编号
     */
    private String khbh;
    /**
     * 客户简称
     */
    private String khjc;
    /**
     * 客户名称
     */
    private String khmc;
    /**
     * 建档日期
     */
    private String jdrq;
    /**
     * 联系人1
     */
    private String lxr1;
    /**
     * 联系电话1
     */
    private String lxdh1;
    /**
     * 联系人2
     */
    private String lxr2;
    /**
     * 联系电话2
     */
    private String lxdh2;
    /**
     * 地址1
     */
    private String dz1;
    /**
     * 地址2
     */
    private String dz2;
    /**
     * 地址3
     */
    private String dz3;
    /**
     * 地址4
     */
    private String dz4;
    /**
     * 地址5
     */
    private String dz5;

    /**
     * 付款方式
     */
    private String fkfs;
    /**
     * 负责人
     */
    private String fzr;
    /**
     * 乙方要求
     */
    private String yq;
    /**
     * 开行户
     */
    private String khh;
    /**
     * 账号
     */
    private String zh;
    /**
     * 税号
     */
    private String sh;
    /**
     * 默认地址
     */
    private String dz;
    /**
     * 客户注意
     */
    private String khzy;

}
