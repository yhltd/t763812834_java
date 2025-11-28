package com.example.demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.entity.Qxgl;
import com.example.demo.mapper.QxglMapper;
import com.example.demo.service.QxglService;
import com.example.demo.util.GsonUtil;
import com.example.demo.util.PageRequestDTO;
import com.example.demo.util.PageResult;
import com.example.demo.util.StringUtils;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class QxglImpl extends ServiceImpl<QxglMapper, Qxgl> implements QxglService {

    @Override
    public Map<String, Object> login(String username, String password) {
        //条件构造器
        QueryWrapper<Qxgl> queryWrapper = new QueryWrapper<>();
        //账号
        queryWrapper.eq("E", username);
        //密码
        queryWrapper.eq("F", password);
        //获取User
        Qxgl qxgl = this.getOne(queryWrapper);
        //如果不为空
        String data = StringUtils.EMPTY;
        if (StringUtils.isNotNull(qxgl)) {
            //转JSON
            data = GsonUtil.toJson(qxgl);

            Map<String, Object> map = new HashMap<>();
            map.put("token", data);
            String this_power = "";
            return map;
        }
        return null;
    }

    @Override
    public List<Qxgl> getList() {
        return baseMapper.getList();
    }

    @Override
    public PageResult<Qxgl> getQxglPage(PageRequestDTO request) {
        return null;
    }


    @Override
    public List<Qxgl> queryList(String name) {
        // 如果姓名为空或null，返回所有用户列表
        if (StringUtils.isEmpty(name)) {
            return this.getList();
        }

        // 调用Mapper中的模糊查询方法
        return baseMapper.selectUsersByName(name);
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
    public boolean update(Qxgl qxgl) {
        if (qxgl == null || qxgl.getId() == null) {
            log.error("更新失败: 用户ID为空");
            return false;
        }

        try {
            // 检查用户是否存在
            Qxgl existingUser = baseMapper.selectById(qxgl.getId());

            // 检查用户名是否重复（排除当前用户）
            if (!existingUser.getE().equals(qxgl.getE())) {
                Integer count = baseMapper.checkUsernameExistsExcludeSelf(qxgl.getE(), qxgl.getId());
                if (count != null && count > 0) {
                    return false;
                }
            }

            // 执行更新
            Integer result = baseMapper.updateUser(qxgl);
            return result != null && result > 0;

        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public Qxgl add(Qxgl qxgl) {
        try {
            // 检查用户名是否已存在
            Integer count = baseMapper.checkUsernameExists(qxgl.getE());

            // 使用MyBatis Plus的save方法
            boolean success = this.save(qxgl);
            if (success) {
                return qxgl;
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

}
