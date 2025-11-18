package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Qhd;
import com.example.demo.entity.Ysyf;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface QhdService extends IService<Qhd> {

    /**
     * 查询所有
     */
    List<Qhd> getList();

    /**
     * 根据姓名和部门查询
     */
    List<Qhd> queryList(String ksrq,String jsrq,String gsm);

    /**
     * 修改
     */
    boolean update(Qhd qhd);

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
//    Qhd add(Qhd qhd);


    boolean add1(String riqi,String gsm,String ysj,String bz,String bh,String zys);

}
