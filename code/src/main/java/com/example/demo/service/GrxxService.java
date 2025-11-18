package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Grxx;
import com.example.demo.entity.UserInfo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface GrxxService extends IService<Grxx> {

    /**
     * 查询所有
     */
    List<Grxx> queryList(String name);

    /**
     * 修改
     */
    boolean update(Grxx grxx);

    /**
     * 添加
     */
    Grxx add(Grxx grxx);

}
