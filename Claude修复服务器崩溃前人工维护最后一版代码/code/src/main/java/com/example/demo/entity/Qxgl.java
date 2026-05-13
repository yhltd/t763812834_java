package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;


@Data
@TableName("qvanxianguanli")
public class Qxgl {

    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;
    /**
     * 身份
     */
    private String C;
    /**
     * 人名
     */
    private String D;
    /**
     * 账号
     */
    private String E;
    /**
     * 密码
     */
    private String F;


}
