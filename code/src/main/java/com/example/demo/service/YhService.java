package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Dskh;
import com.example.demo.entity.Yh;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface YhService extends IService<Yh> {

    /**
     * 查询所有
     */
    List<Yh> getList();

    /**
     * 根据姓名和部门查询
     */
    List<Yh> queryList(String ksrq,String jsrq);

    /**
     * 修改
     */
    boolean update(Yh yh);

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
    Yh add(Yh yh);

}
