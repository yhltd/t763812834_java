package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Rk;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RkService extends IService<Rk> {

    /**
     * 查询所有
     */
    List<Rk> getList();

    /**
     * 根据姓名和部门查询
     */
    List<Rk> queryList(String ksrq,String jsrq,String mc);

    /**
     * 修改
     */
    boolean update(Rk rk);

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
    Rk add(Rk rk);
    Rk add1(Rk rk);
    /**
     * 查询库存均价
     */
    List<Rk> getKcjj();

    boolean update1(Rk rk);

}
