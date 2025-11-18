package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Khzl;
import com.example.demo.entity.UserInfo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface KhzlService extends IService<Khzl> {

    /**
     * 查询所有
     */
    List<Khzl> getList();

    /**
     * 根据姓名和部门查询
     */
    List<Khzl> queryList(String gsm);

    /**
     * 修改
     */
    boolean update(Khzl khzl);

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
    Khzl add(Khzl khzl);

    List<Khzl> hqxlGsm();

//    String hqgd(String shdw);
String hqgd(String shdw);


    List<Khzl> getListByGsm(String gsm);

    boolean tkkc(String tkkc,String gsm);

    boolean tzkc(String tzkc,String gsm);


    String gettkkc(String gsm);

    String gettzkc(String gsm);

    String hqdz(String shdw);
    String getysje(String fuzhu);
    boolean upysje(String ysje,String fuzhu);


}
