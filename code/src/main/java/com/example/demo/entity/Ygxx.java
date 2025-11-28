package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("yuangongxinxi")
public class Ygxx {
    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;
    /**
     * 序号
     */
    private String xh;
    /**
     * 姓名
     */
    private String xm;
    /**
     * 职位
     */
    private String zw;
    /**
     * 部门
     */
    private String bm;
    /**
     * 联系方式
     */
    private String lxfs;
    /**
     * 备注
     */
    private String bz;
    /**
     * 工号
     */
    private String gh;

}
