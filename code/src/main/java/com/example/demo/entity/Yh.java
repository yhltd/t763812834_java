package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("yinhang")
public class Yh {
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
     * 销售收入
     */
    private String xssr;
    /**
     * 应收收入
     */
    private String yssr;
    /**
     * 杂项收入
     */
    private String zxsr;
    /**
     * 入库支出
     */
    private String rkzc;
    /**
     * 费用支出
     */
    private String fyzc;
}
