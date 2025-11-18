package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("gongyingshangziliao")
public class Gyszl {
    /**
     * id自增列
     */
    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;
    /**
     * 公司名
     */
    private String gsm;
    /**
     * 铜渣库存
     */
    private String tzkc;
    /**
     * 铜块库存
     */
    private String tkkc;
    /**
     * 应付金额
     */
    private String yfje;
    /**
     * 是否月结
     */
    private String sfyj;
}
