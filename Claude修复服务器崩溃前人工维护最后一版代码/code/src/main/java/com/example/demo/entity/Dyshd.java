package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("dyshd")
public class Dyshd {
    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;

    private String ddh;
    private String pm;
    private String ggxh;
    private String sl;
    private String dw;
    private String khmc;
}
