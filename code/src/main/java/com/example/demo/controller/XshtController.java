package com.example.demo.controller;


import com.example.demo.entity.Khxx;
import com.example.demo.entity.Pzb;
import com.example.demo.entity.Scgd;
import com.example.demo.service.KhxxService;
import com.example.demo.service.PzbService;
import com.example.demo.service.ScgdService;
import com.example.demo.util.AuthUtil2;
import com.example.demo.util.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/hetong")
public class XshtController {

    @Autowired
    private PzbService pzbService;

    @Autowired
    private KhxxService khxxService;

    @Autowired
    private ScgdService scgdService;

    /**
     * 查询基础信息配置
     */
    @PostMapping("/list")
    public Result<List<Pzb>> getList(HttpSession session) {
        try {
            // 从 Session 中获取 D 值（管理员名称）
            String fuzeren = (String) session.getAttribute("D");
            if (fuzeren == null || fuzeren.trim().isEmpty()) {
                return Result.error("为获取身份信息，请重新登录");
            }

            // 执行查询，传入负责人作为查询条件
            List<Pzb> result = pzbService.getList(fuzeren);
            return Result.success(result);

        } catch (Exception e) {
            log.error("查询配置表信息失败", e);
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    /**
     * 查询基础信息配置
     */
    @PostMapping("/xiala")
    public Result<List<Pzb>> getXL(HttpSession session) {
        try {
            // 执行查询下拉内容
            List<Pzb> result = pzbService.getXL();
            return Result.success(result);

        } catch (Exception e) {
            log.error("查询配置表信息失败", e);
            return Result.error("查询失败: " + e.getMessage());
        }
    }
    /**
     * 查询基础信息配置
     */
    @PostMapping("/xialagl")
    public Result<List<Pzb>> getXLGL(HttpSession session) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            // 执行查询下拉内容
            List<Pzb> result = pzbService.getXLGL();
            return Result.success(result);

        } catch (Exception e) {
            log.error("查询配置表信息失败", e);
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    /**
     * 查询客户基础信息
     */
    @PostMapping("/kehu")
    public Result<List<Khxx>> getKH(HttpSession session) {
        try {

            // 执行查询下拉内容
            List<Khxx> result = khxxService.getKH();
            return Result.success(result);

        } catch (Exception e) {
            log.error("查询配置表信息失败", e);
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    /**
     * 保存数据
     */
    @PostMapping("/saveScgd")
    public Result<?> saveScgd(@RequestBody Scgd scgd, HttpSession session) {
        try {

            boolean success = scgdService.save(scgd);
            if (success) {
                return Result.success("保存成功");
            } else {
                return Result.error("保存失败");
            }
        } catch (Exception e) {
            log.error("保存销售订单失败", e);
            return Result.error("保存失败: " + e.getMessage());
        }
    }

    /**
     * 查询有无被驳回内容
     */
    @PostMapping("/returnlist")
    public Result<List<Scgd>> getListRE(HttpSession session) {
        try {

            // 从 Session 中获取 D 值（管理员名称）
            String fuzeren = (String) session.getAttribute("D");
            if (fuzeren == null || fuzeren.trim().isEmpty()) {
                return Result.error("为获取身份信息，请重新登录");
            }

            // 执行查询，传入负责人作为查询条件
            List<Scgd> result = scgdService.getListRE(fuzeren);
            return Result.success(result);

        } catch (Exception e) {
            log.error("查询配置表信息失败", e);
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    @PostMapping("/updateScgd")
    public Result updateScgd(@RequestBody Scgd scgd) {
        try {
            boolean success = scgdService.updateById(scgd);
            if (success) {
                return Result.success("数据修改成功");
            } else {
                return Result.error("数据修改失败");
            }
        } catch (Exception e) {
            return Result.error("修改失败: " + e.getMessage());
        }
    }

    @PostMapping("/deleteScgd")
    public Result deleteScgd(@RequestBody Map<String, Object> params) {
        try {
            Integer id = (Integer) params.get("id");
            if (id == null) {
                return Result.error("ID不能为空");
            }

            boolean success = scgdService.removeById(id);
            if (success) {
                return Result.success("数据删除成功");
            } else {
                return Result.error("数据删除失败");
            }
        } catch (Exception e) {
            return Result.error("删除失败: " + e.getMessage());
        }
    }


}
