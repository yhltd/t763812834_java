package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Dskh;
import com.example.demo.entity.Kdgsdzd;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface KdgsdzdService extends IService<Kdgsdzd> {

    /**
     * 查询所有
     */
    List<Kdgsdzd> getList();

//    List<Kdgsdzd> getDrList();

    /**
     * 根据姓名和部门查询
     */
    List<Kdgsdzd> queryList(String khmc,String kddh);

    /**
     * 修改
     */
    boolean update(Kdgsdzd kdgsdzd);

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
    Kdgsdzd add(Kdgsdzd kdgsdzd);

}
