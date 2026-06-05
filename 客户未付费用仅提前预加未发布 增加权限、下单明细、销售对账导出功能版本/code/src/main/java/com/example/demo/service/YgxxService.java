package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Ygxx;
import com.example.demo.util.PageRequestDTO;
import com.example.demo.util.PageResult;

import java.util.List;

public interface YgxxService extends IService<Ygxx> {

    /**
     * 查询所有用户
     */
    List<Ygxx> getList();

    /**
     * 分页查询用户
     */
    PageResult<Ygxx> getYgxxPage(PageRequestDTO request);



    /**
     * 根据姓名模糊查询用户列表
     * @param name 姓名
     * @return 用户列表
     */
    List<Ygxx> queryList(String name);

    /**
     * 更新用户信息
     */
    boolean update(Ygxx ygxx);

    /**
     * 添加用户
     */
    Ygxx add(Ygxx ygxx);

    /**
     * 删除用户
     */
    boolean delete(List<Integer> idList);
}





