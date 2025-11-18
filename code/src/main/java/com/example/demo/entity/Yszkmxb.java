package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("yingshouzhangkuanmingxi")
public class Yszkmxb {
    /**
     * id自增列
     */
    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;

    /**
     * 公司名
     */
    private String gsm;

    private String ys1;

    private String yf1;
    private String ys2;
    private String yf2;
    private String ys3;
    private String yf3;
    private String ys4;
    private String yf4;
    private String ys5;
    private String yf5;
    private String ys6;
    private String yf6;
    private String ys7;
    private String yf7;
    private String ys8;
    private String yf8;
    private String ys9;
    private String yf9;
    private String ys10;
    private String yf10;
    private String ys11;
    private String yf11;
    private String ys12;
    private String yf12;

    private String ljysje;

    private String bnysje;

    private String ysyehj;
    private String yf;
    private String sfyj;
    private String sfhs;
    private String qcye;
    private String skje;
    private String ysje;
    private String nian;

}
