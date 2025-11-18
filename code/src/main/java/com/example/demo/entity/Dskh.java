package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("daishoukehu")
public class Dskh {
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
     * 编号
     */
    private String khmc;
    /**
     * 联系电话
     */
    private String dsje;
    /**
     * 地址
     */
    private String kddh;
}
