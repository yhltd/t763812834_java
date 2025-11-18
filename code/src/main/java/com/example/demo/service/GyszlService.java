package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Gyszl;
import com.example.demo.entity.Khzl;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface GyszlService extends IService<Gyszl> {

    /**
     * 查询所有
     */
    List<Gyszl> getList();

    /**
     * 根据姓名和部门查询
     */
    List<Gyszl> queryList(String gsm);

    /**
     * 修改
     */
    boolean update(Gyszl gyszl);

    /**
     * 删除
     *
     * @param idList 根据id集合删除
     * @return 是否删除成功
     */
    boolean delete(List<Integer> idList);

    /**
     * 添加
     */
    Gyszl add(Gyszl gyszl);

}
