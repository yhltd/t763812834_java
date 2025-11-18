package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("feiyong")
public class Fy {
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
     * 销售费用
     */
    private String xsfy;
    /**
     * 管理费用
     */
    private String glfy;
    /**
     * 财务费用
     */
    private String cwfy;
    /**
     * 合计费用
     */
    private String hjfy;
}
