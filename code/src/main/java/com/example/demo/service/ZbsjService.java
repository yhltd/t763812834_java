package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Zbsj;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ZbsjService extends IService<Zbsj> {

    /**
     * 查询所有
     */
    List<Zbsj> getList();

    /**
     * 根据姓名和部门查询
     */
    List<Zbsj> queryList(String ksrq,String jsrq);

    /**
     * 删除
     *
     * @param idList 根据id集合删除
     * @return 是否删除成功
     */
    boolean delete(List<Integer> idList);

}
