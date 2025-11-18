package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("caozuoquanxian")
public class Czqx {
    /**
     * id自增列
     */
    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;
    /**
     * 操作人
     */
    private String czr;
    /**
     * 表
     */
    private String biao;
    /**
     * 操作权限
     */
    private String czqx;
    /**
     * 是否允许
     */
    private String sfyx;
    /**
     * 操作id
     */
    private String czid;

}
