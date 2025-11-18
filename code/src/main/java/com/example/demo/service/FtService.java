package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Ft;
import com.example.demo.entity.Yh;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface FtService extends IService<Ft> {

    /**
     * 查询所有
     */
    List<Ft> getList();

    /**
     * 根据姓名和部门查询
     */
    List<Ft> queryList(String ksrq,String jsrq,String khmc);

    /**
     * 修改
     */
    boolean update(Ft ft);

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
    Ft add(Ft ft);

}
