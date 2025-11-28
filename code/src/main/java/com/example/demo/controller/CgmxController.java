package com.example.demo.controller;

import com.example.demo.entity.Cgmx;

import com.example.demo.service.CgmxService;

import com.example.demo.util.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/cgmx")
public class CgmxController {

    @Autowired
    private CgmxService cgmxService;

    /**
     * 分页查询客户信息
     */
    @PostMapping("/list")
    public Result<PageResult<Cgmx>> getKhxxList(HttpSession session, @RequestBody PageRequestDTO request) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            // 执行查询
            PageResult<Cgmx> result = cgmxService.getCgmxPage(request);
            return Result.success(result);

        } catch (Exception e) {
            log.error("查询客户信息失败", e);
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    /**
     * 根据ID获取详情
     */
    @PostMapping("/detail")
    public Result<Cgmx> getCgmxDetail(HttpSession session, @RequestBody DetailRequestDTO request) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            // 数据验证
            if (request.getId() == null) {
                return Result.error("客户ID不能为空");
            }

            // 查询详情
            Cgmx xiangqing = cgmxService.getById(request.getId());
            if (xiangqing == null) {
                return Result.error("客户信息不存在");
            }

            return Result.success(xiangqing);

        } catch (Exception e) {
            log.error("获取客户详情失败", e);
            return Result.error("获取详情失败: " + e.getMessage());
        }
    }

    /**
     * 查询采购明细（搜索专用）
     */
    @PostMapping("/queryList")
    public Result queryList(HttpSession session, @RequestBody Map<String, Object> params) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            String keyword = (String) params.get("keyword");
            Integer pageNum = (Integer) params.get("pageNum");
            Integer pageSize = (Integer) params.get("pageSize");

            Map<String, Object> result = cgmxService.searchCgmx(keyword, pageNum, pageSize);
            return Result.success(result);
        } catch (Exception e) {
            log.error("查询采购明细失败", e);
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    /**
     * 更新状态
     */


    /**
     * 删除客户信息
     */
    @PostMapping("/delete")
    public Result delete(@RequestBody Map<String, Object> params) {
        try {
            Integer id = (Integer) params.get("id");
            if (id == null) {
                return Result.error("ID不能为空");
            }

            boolean success = cgmxService.deleteById(id);
            if (success) {
                return Result.success("删除成功");
            } else {
                return Result.error("删除失败，记录不存在");
            }
        } catch (Exception e) {
            return Result.error("删除失败: " + e.getMessage());
        }
    }

    /**
     * 更新客户信息
     */
    @PostMapping("/update")
    public Result update(@RequestBody Cgmx cgmx) {
        try {
            if (cgmx.getKhcm() == null || cgmx.getKhcm().trim().isEmpty()) {
                return Result.error("客户名称不能为空");
            }

            // 修正：使用 MyBatis-Plus 自带的 saveOrUpdate 方法
            boolean success = cgmxService.saveOrUpdate(cgmx);
            if (success) {
                return Result.success("保存成功");
            } else {
                return Result.error("保存失败");
            }
        } catch (Exception e) {
            return Result.error("保存失败: " + e.getMessage());
        }
    }
}