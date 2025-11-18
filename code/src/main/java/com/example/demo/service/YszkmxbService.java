package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Yh;
import com.example.demo.entity.Ysyf;
import com.example.demo.entity.Yszkmxb;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface YszkmxbService extends IService<Yszkmxb> {

    /**
     * 查询所有
     */
    List<Yszkmxb> getList();
    List<Yszkmxb> getList1();
    List<Yszkmxb> getList2();

    Yszkmxb add(Yszkmxb yszkmxb);
    void delete();
    void update(String yf1,String yf2,String yf3,String yf4,String yf5,String yf6,String yf7,String yf8,String yf9,String yf10,String yf11,String yf12,String bnysje,String gsm,String nian);
}
