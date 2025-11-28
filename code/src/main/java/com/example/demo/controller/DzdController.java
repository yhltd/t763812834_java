package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.entity.Ddmx;
import com.example.demo.service.DzdService;
import com.example.demo.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/dzd")
public class DzdController {

    @Autowired
    private DzdService dzdService;

    /**
     * 分页查询去重订单数据
     */
    @PostMapping("/distinctPage")
    public Result<Page<Map<String, Object>>> distinctPage(HttpSession session,@RequestBody PageRequest pageRequest) {

        // 创建分页对象
        Page<Map<String, Object>> page = new Page<>(pageRequest.getPageNum(), pageRequest.getPageSize());

        // 构建查询条件
        QueryWrapper<Map<String, Object>> queryWrapper = new QueryWrapper<>();

        // 添加查询条件
        if (StringUtils.isNotBlank(pageRequest.getDdh())) {
            queryWrapper.like("ddh", pageRequest.getDdh());
        }
        if (StringUtils.isNotBlank(pageRequest.getKhmc())) {
            queryWrapper.like("khmc", pageRequest.getKhmc());
        }
        if (StringUtils.isNotBlank(pageRequest.getFzr())) {
            queryWrapper.eq("fzr", pageRequest.getFzr());
        }
        if (StringUtils.isNotBlank(pageRequest.getBm())) {
            queryWrapper.eq("bm", pageRequest.getBm());
        }
        if (pageRequest.getStartDate() != null && pageRequest.getEndDate() != null) {
            queryWrapper.between("ddrq", pageRequest.getStartDate(), pageRequest.getEndDate());
        }

        Result<?> authResult = AuthUtil2.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            String fuzeren = (String) session.getAttribute("D");
            if (fuzeren == null || fuzeren.trim().isEmpty()) {
                return Result.error("为获取身份信息，请重新登录");
            }

            Page<Map<String, Object>> result = dzdService.selectDistinctByDdhPageY(page, queryWrapper,fuzeren);

            return Result.success(result);
        }

        // 执行查询 - 通过Service调用
        Page<Map<String, Object>> result = dzdService.selectDistinctByDdhPage(page, queryWrapper);

        return Result.success(result);
    }

    /**
     * 根据订单号获取详细信息
     */
    @PostMapping("/getDetailByDdh")
    public Result getDetailByDdh(@RequestBody Map<String, Object> params) {
        try {
            String ddh = (String) params.get("ddh");
            if (ddh == null) {
                return Result.error("订单号和订单日期不能为空");
            }

            List<Ddmx> detailList = dzdService.getDetailByDdh(ddh);
            return Result.success(detailList);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("获取详情失败: " + e.getMessage());
        }
    }

    /**
     * 更新对账状态
     */
    @PostMapping("/updateDzztStatus")
    public Result updateDzztStatus(HttpSession session,@RequestBody Map<String, Object> params) {

        // 权限检查
        Result<?> authResult = AuthUtil.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }
        try {
            String ddh = (String) params.get("ddh");
            String dzzt = (String) params.get("dzzt");

            if (ddh == null || dzzt == null) {
                return Result.error("订单号和对账状态不能为空");
            }

            boolean success = dzdService.updateDzztStatus(ddh, dzzt);
            if (success) {
                return Result.success("更新对账状态成功");
            } else {
                return Result.error("更新对账状态失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("更新对账状态失败: " + e.getMessage());
        }
    }

}
