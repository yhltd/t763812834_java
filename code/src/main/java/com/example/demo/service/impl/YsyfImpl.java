package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Yh;
import com.example.demo.entity.Ysyf;
import com.example.demo.mapper.YhMapper;
import com.example.demo.mapper.YsyfMapper;
import com.example.demo.service.YhService;
import com.example.demo.service.YsyfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class YsyfImpl extends ServiceImpl<YsyfMapper, Ysyf> implements YsyfService {
    @Autowired
    YsyfMapper ysyfMapper;

    @Override
    public List<Ysyf> getList() {
        return ysyfMapper.getList();
    }

    @Override
    public List<Ysyf> queryList(String ksrq,String jsrq,String gsm) {
        return ysyfMapper.queryList(ksrq,jsrq,gsm);
    }

    @Override
    public boolean update(Ysyf ysyf) { return updateById(ysyf); }

    @Override
    public boolean delete(List<Integer> idList) {
        return removeByIds(idList);
    }

    @Override
    public Ysyf add(Ysyf ysyf) { return save(ysyf) ? ysyf : null; }

}
