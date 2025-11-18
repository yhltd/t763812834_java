package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("kuaidigongsiduizhangdan")
public class Kdgsdzd {
    /**
     * id自增列
     */
    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;

    private String dh;

    private String sjgs;


    private String jshk;

    private String fkrq;

    private String fkfs;

    private String khmc;

    private String qjy;

    private String jjrq;
}
