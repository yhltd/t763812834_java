package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * @author hui
 * @date 2024/8/7 18:25
 */
@Data
@TableName("shdprint")
public class Shdp {
    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;
    /**
     * 商品名称
     */
    private String riqi;
    private String dh;
    private String shdw;
    private String mc;
    private String mh;
    private String gg;
    private String js;
    private String zl;
    private String dj;
    private String je;
    private String bz;
    private String shdz;
    private String kddh;
    private String sfyj;
    private String fkfs;
    private String sfhs;
    private String gd;
    private String zdr;
    private String shdwjjsr;
    private String jgf;
    private String kdf;
    private String hsdj;
    private String sd;
    private String whsdj;
    private String hjje;
    private String bzld;
    private String hjzl;

}
