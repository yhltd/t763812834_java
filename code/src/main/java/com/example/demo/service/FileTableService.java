package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.FileTable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface FileTableService extends IService<FileTable> {

    /**
     * 添加
     * */
    FileTable add(FileTable fileTable);

    /**
     *  下载文件
     * */
    List<FileTable> getFile(int glid);

    /**
     * 删除
     * */
    boolean delete(List<Integer>idList);

}
