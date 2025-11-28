package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("yejibaobiao")
public class Yjbb {

    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;
    /**
     * 员工姓名
     */
    private String fzr;
    /**
     * 员工号
     */
    private String gh;
    private String yiyue;
    private String eryue;
    private String sanyue;
    private String siyue;
    private String wuyue;
    private String liuyue;
    private String qiyue;
    private String bayue;
    private String jiiuyue;
    private String shiyue;
    private String shiyiyue;
    private String shieryue;
    private String month;
    private String year;
    private String zj;
    private String xm;

}