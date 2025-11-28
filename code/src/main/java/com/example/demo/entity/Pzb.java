package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("peizhibiao")
public class Pzb {
    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;
    /**
     * 付款方式
     */
    private String fukuanfangshi;
    /**
     * 负责人
     */
    private String fuzeren;
    /**
     * 单号
     */
    private String dianhua;
    /**
     * 编号
     */
    private String bianhao;
    /**
     * 部门
     */
    private String bumen;
    /**
     * 产品明细
     */
    private String chanpinmingcheng;
    /**
     * 单位
     */
    private String danwei;
    /**
     * 职位
     */
    private String zhiwei;
    /**
     * 税率
     */
    private String shuilv;
    /**
     * 合同印章
     */
    private String hetongyinzhang;
    /**
     * 采购乙方
     */
    private String cgyf;
}
