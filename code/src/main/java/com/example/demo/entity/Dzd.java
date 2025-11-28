package com.example.demo.entity;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.Version;
import lombok.Data;

@Data
@TableName("dingdanmingx")
public class Dzd {

    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;
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
     * 客户名称
     */
    private String khmc;
    /**
     * 产品名称
     */
    private String pm;
    /**
     * 规格型号
     */
    private String ggxh;
    /**
     * 单位
     */
    private String dw;
    /**
     * 单价
     */
    private String dj;
    /**
     * 数量
     */
    private String sl;
    /**
     * 负责人
     */
    private String fzr;
    /**
     * 总价
     */
    private String yfsj;
    /**
     * 已付
     */
    private String yifu;
    /**
     * 未付
     */
    private String wf;
    /**
     * 开票时间
     */
    private String kpsj;
    /**
     * 开票状态
     */
    private String sfkp;
    /**
     * 发货时间
     */
    private String fhsj;
    /**
     * 订单号
     */
    private String ddh;
    /**
     * 对账状态
     */
    private String dzzt;
}
