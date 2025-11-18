package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("gerenxinxi")
public class Grxx {
    /**
     * id自增列
     */
    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;
    /**
     * 用户名
     */
    private String username;
    /**
     * 电话
     */
    private String phone;
    /**
     * 姓名
     */
    private String name;
    /**
     * 昵称
     */
    private String nc;
    /**
     * Email
     */
    private String yx;
    /**
     * 地址
     */
    private String address;
    /**
     * 学历
     */
    private String xl;
    /**
     * 毕业院校
     */
    private String byyx;
    /**
     * 性别
     */
    private String xb;
    /**
     * 生日
     */
    private String sr;
    /**
     * 签名
     */
    private String qm;
    /**
     * 密码
     */
    private String password;

}
