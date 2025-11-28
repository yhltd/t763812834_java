package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.entity.Cgdzd;
import com.example.demo.entity.Cgmx;
import com.example.demo.entity.Ddmx;
import com.example.demo.service.CgdzdService;
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
@RequestMapping("/cgdzd")
public class CgdzdController {

    @Autowired
    private CgdzdService cgdzdService;

    /**
     * 分页查询客户信息
     */
    @PostMapping("/distinctPage")
    public Result<PageResult<Cgmx>> getKhxxList(HttpSession session, @RequestBody PageRequestDTO request) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            // 执行查询
            PageResult<Cgmx> result = cgdzdService.getCgmxPage(request);
            return Result.success(result);

        } catch (Exception e) {
            return Result.error("查询失败: " + e.getMessage());
        }
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

            List<Cgmx> detailList = cgdzdService.getDetailByDdh(ddh);
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
    public Result updateDzztStatus(@RequestBody Map<String, Object> params) {
        try {
            String ddh = (String) params.get("ddh");
            String dzzt = (String) params.get("dzzt");

            if (ddh == null || dzzt == null) {
                return Result.error("订单号和对账状态不能为空");
            }

            boolean success = cgdzdService.updateDzztStatus(ddh, dzzt);
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
