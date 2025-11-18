package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.FileTable;
import com.example.demo.mapper.FileTableMapper;
import com.example.demo.service.FileTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FileTableImpl extends ServiceImpl<FileTableMapper, FileTable> implements FileTableService {
    @Autowired
    FileTableMapper fileTableMapper;

    @Override
    public FileTable add(FileTable fileTable) {
        return save(fileTable) ? fileTable : null;
    }

    @Override
    public List<FileTable> getFile(int glid) {
        return fileTableMapper.getFile(glid);
    }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

}
