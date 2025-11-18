package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Yh;
import com.example.demo.entity.Ysyf;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface YsyfService extends IService<Ysyf> {

    /**
     * 查询所有
     */
    List<Ysyf> getList();

    /**
     * 根据姓名和部门查询
     */
    List<Ysyf> queryList(String ksrq,String jsrq,String gsm);

    /**
     * 修改
     */
    boolean update(Ysyf ysyf);

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
    Ysyf add(Ysyf ysyf);

}
