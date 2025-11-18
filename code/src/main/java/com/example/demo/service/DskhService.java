package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Dskh;
import com.example.demo.entity.Gyszl;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DskhService extends IService<Dskh> {

    /**
     * 查询所有
     */
    List<Dskh> getList();

    /**
     * 根据姓名和部门查询
     */
    List<Dskh> queryList(String khmc,String kddh);

    /**
     * 修改
     */
    boolean update(Dskh dskh);

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
    Dskh add(Dskh dskh);

    /**
     * 添加操作权限
     */
//    Dskh addCzqx(Dskh dskh);

}
