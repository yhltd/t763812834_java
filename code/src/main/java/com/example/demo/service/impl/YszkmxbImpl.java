package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Yh;
import com.example.demo.entity.Ysyf;
import com.example.demo.entity.Yszkmxb;
import com.example.demo.mapper.YhMapper;
import com.example.demo.mapper.YsyfMapper;
import com.example.demo.mapper.YszkmxbMapper;
import com.example.demo.service.YhService;
import com.example.demo.service.YsyfService;
import com.example.demo.service.YszkmxbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class YszkmxbImpl extends ServiceImpl<YszkmxbMapper, Yszkmxb> implements YszkmxbService {
    @Autowired
   YszkmxbMapper yszkmxbMapper;

    @Override
    public List<Yszkmxb> getList() {
        return yszkmxbMapper.getList();
    }
    @Override
    public List<Yszkmxb> getList1() {
        return yszkmxbMapper.getList1();
    }

    @Override
    public List<Yszkmxb> getList2() {
        return yszkmxbMapper.getList2();
    }

    @Override
    public Yszkmxb add(Yszkmxb yszkmxb) { return save(yszkmxb) ? yszkmxb : null; }
    @Override
    public void delete() {
        yszkmxbMapper.delete();
    }
    @Override
    public void update(String yf1,String yf2,String yf3,String yf4,String yf5,String yf6,String yf7,String yf8,String yf9,String yf10,String yf11,String yf12,String bnysje,String gsm,String nian) {
        yszkmxbMapper.update(yf1,yf2,yf3,yf4,yf5,yf6,yf7,yf8,yf9,yf10,yf11,yf12,bnysje,gsm,nian);
    }
}
