package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Qxgl;
import com.example.demo.util.PageRequestDTO;
import com.example.demo.util.PageResult;

import java.util.List;
import java.util.Map;

public interface QxglService extends IService<Qxgl> {
    Map<String, Object> login(String username, String password);

    /**
     * 查询所有用户
     */
    List<Qxgl> getList();

    /**
     * 分页查询用户
     */
    PageResult<Qxgl> getQxglPage(PageRequestDTO request);


    /**
     * 根据姓名模糊查询用户列表
     * @param name 姓名
     * @return 用户列表
     */
    List<Qxgl> queryList(String name);

    /**
     * 更新用户信息
     */
    boolean update(Qxgl qxgl);

    /**
     * 添加用户
     */
    Qxgl add(Qxgl qxgl);

    /**
     * 删除用户
     */
    boolean delete(List<Integer> idList);

}
