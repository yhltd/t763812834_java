package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("fileTable")
public class FileTable {
    /**
     * id自增列
     */
    @TableId(value = "id" , type = IdType.AUTO)
    private Integer id;

    /**
     * 头像
     */
    private String files;

    /**
     * 文件名
     */
    private String filename;

    /**
     * 关联id
     */
    private String glid;

}
