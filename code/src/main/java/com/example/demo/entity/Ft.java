package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("feitong")
public class Ft {
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
     * 废铜回收
     */
    private String fths;
    /**
     * 废铜处理
     */
    private String ftcl;
    /**
     * 客户名称
     */
    private String khmc;
    /**
     * 客户存铜
     */
    private String khct;
    /**
     * 客户欠铜
     */
    private String khqt;
    /**
     * 自己库存
     */
    private String zjkc;
    /**
     * 废铜利润
     */
    private String ftlr;
}
