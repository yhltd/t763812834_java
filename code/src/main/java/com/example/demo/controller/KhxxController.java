package com.example.demo.controller;

import com.example.demo.entity.Khxx;
import com.example.demo.entity.Pzb;
import com.example.demo.service.KhxxService;
import com.example.demo.service.PzbService;
import com.example.demo.util.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/kehu")
public class KhxxController {

    @Autowired
    private KhxxService khxxService;
    @Autowired
    private PzbService pzbService;

    /**
     * 分页查询客户信息
     */
    @PostMapping("/list")
    public Result<PageResult<Khxx>> getKhxxList(HttpSession session, @RequestBody KhxxPageRequestDTO request) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                // 从 Session 中获取 D 值（管理员名称）
                String fuzeren = (String) session.getAttribute("D");
                if (fuzeren == null || fuzeren.trim().isEmpty()) {
                    return Result.error("为获取身份信息，请重新登录");
                }

                // 执行查询
                PageResult<Khxx> result = khxxService.getKhxxPageY(request,fuzeren);
                return Result.success(result);
            }

            // 执行查询
            PageResult<Khxx> result = khxxService.getKhxxPage(request);
            return Result.success(result);

        } catch (Exception e) {
            log.error("查询客户信息失败", e);
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    /**
     * 新增客户信息
     */
    @PostMapping("/add")
    public Result<String> addKhxx(HttpSession session, @RequestBody Khxx khxx) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            // 数据验证
            if (khxx.getKhmc() == null || khxx.getKhmc().trim().isEmpty()) {
                return Result.error("客户名称不能为空");
            }

            // 执行新增
            boolean success = khxxService.save(khxx);
            if (success) {
                return Result.success("新增客户信息成功");
            } else {
                return Result.error("新增客户信息失败");
            }

        } catch (Exception e) {
            log.error("新增客户信息失败", e);
            return Result.error("新增失败: " + e.getMessage());
        }
    }

    @PostMapping("/update")
    public Result<String> updateKhxx(HttpSession session, @RequestBody Khxx khxx) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            // 数据验证
            if (khxx.getId() == null) {
                return Result.error("客户ID不能为空");
            }
            if (khxx.getKhmc() == null || khxx.getKhmc().trim().isEmpty()) {
                return Result.error("客户名称不能为空");
            }

            // 使用带乐观锁的更新方法
            Result<String> updateResult = khxxService.updateWithLock(khxx);
            return updateResult;

        } catch (Exception e) {
            log.error("修改客户信息失败", e);
            return Result.error("修改失败: " + e.getMessage());
        }
    }

    /**
     * 删除客户信息
     */
    @PostMapping("/delete")
    public Result<String> deleteKhxx(HttpSession session, @RequestBody DeleteRequestDTO request) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            // 数据验证
            if (request.getId() == null) {
                return Result.error("客户ID不能为空");
            }

            // 检查记录是否存在
            Khxx existing = khxxService.getById(request.getId());
            if (existing == null) {
                return Result.error("客户信息不存在");
            }

            // 执行删除
            boolean success = khxxService.removeById(request.getId());
            if (success) {
                return Result.success("删除客户信息成功");
            } else {
                return Result.error("删除客户信息失败");
            }

        } catch (Exception e) {
            log.error("删除客户信息失败", e);
            return Result.error("删除失败: " + e.getMessage());
        }
    }

    /**
     * 根据ID获取客户详情
     */
    @PostMapping("/detail")
    public Result<Khxx> getKhxxDetail(HttpSession session, @RequestBody DetailRequestDTO request) {
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
            Khxx khxx = khxxService.getById(request.getId());
            if (khxx == null) {
                return Result.error("客户信息不存在");
            }

            return Result.success(khxx);

        } catch (Exception e) {
            log.error("获取客户详情失败", e);
            return Result.error("获取详情失败: " + e.getMessage());
        }
    }

    /**
     * 查询基础信息配置
     */
    @PostMapping("/xiala")
    public Result<List<Pzb>> getXL(HttpSession session) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            // 执行查询下拉内容
            List<Pzb> result = pzbService.getXL();
            return Result.success(result);

        } catch (Exception e) {
            log.error("查询配置表信息失败", e);
            return Result.error("查询失败: " + e.getMessage());
        }
    }
    /**
     * 获取最后一位id
     */
    @PostMapping("/getLastId")
    public Result getLastId() {
        try {
            Long lastId = khxxService.getLastId();
            return Result.success(lastId);
        } catch (Exception e) {
            return Result.error("获取最后ID失败");
        }
    }

}