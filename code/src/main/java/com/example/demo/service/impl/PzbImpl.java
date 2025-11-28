package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Pzb;
import com.example.demo.mapper.PzbMapper;
import com.example.demo.service.PzbService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class PzbImpl extends ServiceImpl<PzbMapper, Pzb> implements PzbService {

    @Override
    public List<Pzb> getList(String fuzeren) {
        return baseMapper.getList(fuzeren);
    }

    @Override
    public List<Pzb> getXL() {
        return baseMapper.getXL();
    }

    @Override
    public List<Pzb> getXLGL(){return baseMapper.getXLGL();}

    @Override
    public List<Pzb> getDW(){return baseMapper.getDW();}


    @Override
    public List<Pzb> getListArr() {
        return baseMapper.getListArr();
    }

    @Override
    public boolean add() {
        return baseMapper.add();
    }



    @Override
    public boolean delete(List<Integer> idList) {
        if (idList == null || idList.isEmpty()) {
            return false;
        }
        Integer result = baseMapper.deleteBatchByIds(idList);
        return result != null && result > 0;
    }



    @Override
    public List<Pzb> queryList(String name) {
        // 如果姓名为空或null，返回空列表或所有数据（根据需求选择）
        if (com.example.demo.util.StringUtils.isEmpty(name)) {
            return this.getListArr();
        }

        // 调用Mapper中的模糊查询方法
        return baseMapper.selectUsersByName(name);
    }



    @Override
    public boolean update(String column,String value,int id) {
        return baseMapper.update(column,value,id);
    }

}
