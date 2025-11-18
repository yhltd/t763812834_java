package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Kc;
import com.example.demo.entity.Khzl;
import com.example.demo.entity.Qc;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface KcService extends IService<Kc> {
    /**
     * 查询所有
     */
    List<Kc> getList();
    List<Kc> getList1();
    List<Kc> getList2();
    /**
     * 根据日期查询
     */
    List<Kc> queryList(String ksrq,String jsrq,String mc);
    /**
     * 根据商品名称查询
     */
    List<Kc> spmcList(String mc);
    /**
     * 修改
     */
    boolean update(Kc kc);

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
    Kc add(Kc kc);

    List<Kc> hqxlMc();

}
