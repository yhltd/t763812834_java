package com.example.demo.entity;


import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.util.Date;

@Data
@TableName("dingdanmingx")
public class Ddmx {


    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;
    @TableField("pdf_base64")
    private String pdfBase64;

    @TableField("pdf_file_name")
    private String pdfFileName;

    @TableField("pdf_file_size")
    private Long pdfFileSize;

    @TableField("pdf_upload_time")
    private Date pdfUploadTime;

    /**
     * 版本号，用于乐观锁
     */
    @Version
    private Integer version;
    /**
     * 序号
     */
    private String xh;
    /**
     * 订单日期
     */
    private String ddrq;
    /**
     * 订单号
     */
    private String ddh;
    /**
     * 客户简称
     */
    private String khjc;
    /**
     * 规格型号
     */
    private String ggxh;
    /**
     * 产品名称
     */
    private String pm;
    /**
     * 单位
     */
    private String dw;
    /**
     * 数量
     */
    private String sl;
    /**
     * 单价
     */
    private String dj;
    /**
     * 总价
     */
    private String zj;
    /**
     * 负责人
     */
    private String fzr;
    /**
     * 部门
     */
    private String bm;
    /**
     * 联系人
     */
    private String lxr;

    /**
     * 联系电话
     */
    private String lxdh;
    /**
     * 提成点
     */
    private String tcd;
    /**
     * 客户名称
     */
    private String khmc;
    /**
     * 开票时间
     */
    private String kpsj;
    /**
     * 应付时间
     */
    private String yingfu;
    /**
     * 已付
     */
    private String yifu;
    /**
     * 未付
     */
    private String wf;
    /**
     * 开票状态
     */
    private String sfkp;
    /**
     * 生产工单
     */
    private String scgd;
    /**
     * 备注
     */
    private String bz;
    /**
     * 物流单号
     */
    private String wldh;
    /**
     * 应付金额
     */
    private String yfsj;
    /**
     * 折扣
     */
    private String zk;
    /**
     * 发货时间
     */
    private String fhsj;


    // 用于前端显示的虚拟字段
    @TableField(exist = false)
    private String pdfFile; // 完整的文件访问URL
}
