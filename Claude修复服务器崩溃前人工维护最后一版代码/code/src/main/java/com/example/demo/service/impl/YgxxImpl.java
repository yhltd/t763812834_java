package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Ygxx;
import com.example.demo.mapper.YgxxMapper;
import com.example.demo.service.YgxxService;
import com.example.demo.util.PageRequestDTO;
import com.example.demo.util.PageResult;
import com.example.demo.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class YgxxImpl extends ServiceImpl<YgxxMapper, Ygxx> implements YgxxService {

    @Autowired
    YgxxMapper ygxxMapper;

    @Override
    public List<Ygxx> getList() {
        List<Ygxx> list = ygxxMapper.getList();
        // 不再清除id值，因为删除功能需要id
        // 但通过表格配置确保id列不显示
        return list;
    }

    @Override
    public PageResult<Ygxx> getYgxxPage(PageRequestDTO request) {
        return null;
    }

    @Override
    public List<Ygxx> queryList(String name) {
        // 如果姓名为空或null，返回所有用户列表
        if (StringUtils.isEmpty(name)) {
            return this.getList();
        }
        // 调用Mapper中的模糊查询方法
        List<Ygxx> list = ygxxMapper.selectUsersByName(name);
        return list;
    }

    // 在 YgxxImpl.java 中修改删除方法
    @Override
    public boolean delete(List<Integer> idList) {
        if (idList == null || idList.isEmpty()) {
            return false;
        }
        // 这里直接使用id进行删除
        Integer result = ygxxMapper.deleteBatchByIds(idList);
        return result != null && result > 0;
    }

    @Override
    public boolean update(Ygxx ygxx) {
        if (ygxx == null || ygxx.getId() == null) {
            return false;
        }

        try {
            // 检查用户是否存在
            Ygxx existingUser = ygxxMapper.selectById(ygxx.getId());
            if (existingUser == null) {
                return false;
            }
            // 检查工号是否重复（如果修改了工号）
            if (!existingUser.getGh().equals(ygxx.getGh())) {
                Integer count = ygxxMapper.checkGhExists(ygxx.getGh());
                if (count != null && count > 0) {
                    return false;
                }
            }
            // 执行更新
            Integer result = ygxxMapper.updateUser(ygxx);
            return result != null && result > 0;

        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public Ygxx add(Ygxx ygxx) {


        // 检查工号是否已存在
        Integer ghCount = ygxxMapper.checkGhExists(ygxx.getGh());
        if (ghCount != null && ghCount > 0) {
            return null; // 工号已存在
        }

        // 使用MyBatis Plus的save方法
        boolean success = this.save(ygxx);
        if (success) {
            // 返回时清除id值，确保前端不会显示id
            Ygxx result = new Ygxx();
//            result.setXh(ygxx.getXh());
            result.setXm(ygxx.getXm());
            result.setZw(ygxx.getZw());
            result.setBm(ygxx.getBm());
            result.setLxfs(ygxx.getLxfs());
            result.setBz(ygxx.getBz());
            result.setGh(ygxx.getGh());
            return result;
        }
        return null;
    }
}