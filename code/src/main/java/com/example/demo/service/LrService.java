package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Lr;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface LrService extends IService<Lr> {

    /**
     * 查询所有
     */
    List<Lr> getList();

    /**
     * 根据姓名和部门查询
     */
    List<Lr> queryList(String ksrq,String jsrq);

    /**
     * 修改
     */
    boolean update(Lr lr);

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
    Lr add(Lr lr);

}
