package com.example.demo.entity;


import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("control_soft_time")
public class Power {

    /**
     * id
     */
    private Integer _id;

    /**
     * 软件到期时间
     */
    private String endtime;

    /**
     * 是否买断
     */
    private String mark1;

    /**
     * 服务器到期时间
     */
    private String mark2;

    /**
     * 允许创建账号数量
     */
    private String mark3;

    /**
     * 数据库容量
     */
    private String mark4;
}
