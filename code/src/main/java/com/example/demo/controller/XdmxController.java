package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.demo.entity.Ddmx;
import com.example.demo.entity.Pzb;
import com.example.demo.entity.Xdmx;
import com.example.demo.service.DdmxService;
import com.example.demo.service.PzbService;
import com.example.demo.service.XdmxService;
import com.example.demo.util.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/xiadan")
public class XdmxController {

    @Autowired
    private XdmxService xdmxService;

    @Autowired
    private PzbService pzbService;

    @Autowired
    private DdmxService ddmxService;

    /**
     * 分页查询客户信息
     */
    @PostMapping("/list")
    public Result<PageResult<Xdmx>> getKhxxList(HttpSession session, @RequestBody ScgdSearchRequest request) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                // 从 Session 中获取 D 值（管理员名称）
                String fuzeren = (String) session.getAttribute("D");
                if (fuzeren == null || fuzeren.trim().isEmpty()) {
                    return Result.error("为获取身份信息，请重新登录");
                }

                PageResult<Xdmx> result = xdmxService.getScgdPageYW(request,fuzeren);
                return Result.success(result);
            }

            // 执行查询
            PageResult<Xdmx> result = xdmxService.getScgdPage(request);
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
    public Result<Xdmx> getScgdDetail(HttpSession session, @RequestBody DetailRequestDTO request) {
        try {

            // 数据验证
            if (request.getId() == null) {
                return Result.error("客户ID不能为空");
            }

            // 查询详情
            Xdmx xiangqing = xdmxService.getById(request.getId());
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
     * 更新状态
     */
    @PostMapping("/updateStatus")
    public Result updateStatus(HttpSession session,@RequestBody Map<String, Object> params) {
        // 权限检查
        Result<?> authResult = AuthUtil2.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            // 获取ID参数，支持多种类型
            Integer id = null;
            Object idObj = params.get("id");
            if (idObj instanceof Integer) {
                id = (Integer) idObj;
            } else if (idObj instanceof String) {
                try {
                    id = Integer.parseInt((String) idObj);
                } catch (NumberFormatException e) {
                    return Result.error("ID格式不正确");
                }
            } else if (idObj != null) {
                try {
                    id = Integer.parseInt(idObj.toString());
                } catch (NumberFormatException e) {
                    return Result.error("ID格式不正确");
                }
            }

            String zt = (String) params.get("zt");

            if (id == null) {
                return Result.error("ID不能为空");
            }
            if (zt == null || zt.trim().isEmpty()) {
                return Result.error("状态不能为空");
            }

            boolean success = xdmxService.updateStatus(id, zt);
            if (success) {
                return Result.success("状态更新成功");
            } else {
                return Result.error("状态更新失败");
            }
        } catch (Exception e) {
            log.error("状态更新失败", e);
            return Result.error("状态更新失败: " + e.getMessage());
        }
    }

    /**
     * 删除客户信息
     */
    @PostMapping("/delete")
    public Result delete(HttpSession session,@RequestBody Map<String, Object> params) {
        // 权限检查
        Result<?> authResult = AuthUtil.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            Integer id = (Integer) params.get("id");
            if (id == null) {
                return Result.error("ID不能为空");
            }

            boolean success = xdmxService.deleteById(id);
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
    public Result update(HttpSession session,@RequestBody Xdmx shengchan) {

        // 权限检查
        Result<?> authResult = AuthUtil.checkAdminAuth(session);
        if (!authResult.isSuccess()) {
            return Result.error(authResult.getCode(), authResult.getMessage());
        }

        try {
            if (shengchan.getKhcm() == null || shengchan.getKhcm().trim().isEmpty()) {
                return Result.error("客户名称不能为空");
            }

            // 修正：使用 MyBatis-Plus 自带的 saveOrUpdate 方法
            boolean success = xdmxService.saveOrUpdate(shengchan);
            if (success) {
                return Result.success("保存成功");
            } else {
                return Result.error("保存失败");
            }
        } catch (Exception e) {
            return Result.error("保存失败: " + e.getMessage());
        }
    }

    /**
     * 获取工单信息 - 新增接口
     */
    @PostMapping("/getWorkOrderInfo")
    public Result<Xdmx> getWorkOrderInfo(HttpSession session, @RequestBody PrintCountRequest request) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            // 数据验证
            if (request.getId() == null) {
                return Result.error("ID不能为空");
            }

            // 查询工单信息
            Xdmx workOrderInfo = xdmxService.getWorkOrderInfo(request.getId());
            if (workOrderInfo == null) {
                return Result.error("工单信息不存在");
            }

            return Result.success(workOrderInfo);

        } catch (Exception e) {
            log.error("获取工单信息失败", e);
            return Result.error("获取工单信息失败: " + e.getMessage());
        }
    }

    /**
     * 生成工单号 - 新增接口
     */
    @PostMapping("/generateWorkOrder")
    public Result<Xdmx> generateWorkOrder(HttpSession session, @RequestBody WorkOrderRequest request) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            // 数据验证
            if (request.getId() == null) {
                return Result.error("ID不能为空");
            }

            // 生成工单号（如果前端没有提供，则自动生成）
            String workOrderNumber = request.getScgd();
            if (workOrderNumber == null || workOrderNumber.trim().isEmpty()) {
                workOrderNumber = xdmxService.generateWorkOrderNumber();
            }

            // 保存工单号和打印次数
            boolean success = xdmxService.generateWorkOrder(
                    request.getId(),
                    workOrderNumber,
                    request.getPrintCount() != null ? request.getPrintCount() : 1
            );

            if (success) {
                // 返回更新后的完整数据
                Xdmx updatedData = xdmxService.getById(request.getId());
                return Result.success(updatedData);
            } else {
                return Result.error("生成工单号失败");
            }

        } catch (Exception e) {
            log.error("生成工单号失败", e);
            return Result.error("生成工单号失败: " + e.getMessage());
        }
    }

    /**
     * 更新打印次数 - 新增接口
     */
    @PostMapping("/updatePrintCount")
    public Result<Xdmx> updatePrintCount(HttpSession session, @RequestBody DetailRequestDTO request) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            // 数据验证
            if (request.getId() == null) {
                return Result.error("ID不能为空");
            }

            // 更新打印次数
            Xdmx updatedData = xdmxService.updatePrintCount(request.getId());
            return Result.success(updatedData);

        } catch (Exception e) {
            log.error("更新打印次数失败", e);
            return Result.error("更新打印次数失败: " + e.getMessage());
        }
    }

    /**
     * 保存选中的生产工单 - 新增接口
     */
    @PostMapping("/saveWorkOrders")
    public Result saveWorkOrders(HttpSession session, @RequestBody SaveWorkOrdersRequest request) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            // 数据验证
            if (request.getId() == null) {
                return Result.error("ID不能为空");
            }

            // 更新生产工单字段（格式：1,3,44）
            Xdmx entity = new Xdmx();
            entity.setId(request.getId());
            entity.setScgd(request.getScgd()); // 保存为 "1,3,44" 格式

            boolean success = xdmxService.updateById(entity);
            if (success) {
                return Result.success("生产工单保存成功");
            } else {
                return Result.error("生产工单保存失败");
            }

        } catch (Exception e) {
            log.error("保存生产工单失败", e);
            return Result.error("保存生产工单失败: " + e.getMessage());
        }
    }

    @PostMapping("/saveWorkOrdersAndPrintCounts")
    public Result saveWorkOrdersAndPrintCounts(HttpSession session, @RequestBody SaveWorkOrdersRequest request) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            // 数据验证
            if (request.getId() == null) {
                return Result.error("ID不能为空");
            }

            // 更新生产工单字段和打印次数字段
            Xdmx entity = new Xdmx();
            entity.setId(request.getId());
            entity.setScgd(request.getScgd()); // 工单号字符串，格式：GD20240101001,GD20240101002,...
            entity.setPrintCount(request.getPrintCount()); // 打印次数字符串，格式：1,2,3,...

            boolean success = xdmxService.updateById(entity);
            if (success) {
                return Result.success("生产工单和打印次数保存成功");
            } else {
                return Result.error("保存失败");
            }

        } catch (Exception e) {
            log.error("保存生产工单和打印次数失败", e);
            return Result.error("保存失败: " + e.getMessage());
        }
    }

    /**
     * 驳回订单 - 新增接口
     */
    @PostMapping("/rejectOrder")
    public Result rejectOrder(HttpSession session, @RequestBody DetailRequestDTO request) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            // 数据验证
            if (request.getId() == null) {
                return Result.error("ID不能为空");
            }

            // 创建更新实体
            Xdmx entity = new Xdmx();
            entity.setId(request.getId());
            entity.setZt("待处理"); // 将状态改为待处理
            entity.setScgd(""); // 清空生产工单
            entity.setPrintCount(""); // 清空打印次数

            // 执行更新
            boolean success = xdmxService.updateById(entity);
            if (success) {
                log.info("订单驳回成功，ID: {}", request.getId());
                return Result.success("订单驳回成功");
            } else {
                return Result.error("订单驳回失败");
            }

        } catch (Exception e) {
            log.error("订单驳回失败", e);
            return Result.error("订单驳回失败: " + e.getMessage());
        }
    }

    /**
     * 查询基础信息配置
     */
    @PostMapping("/danwei")
    public Result<List<Pzb>> getDW(HttpSession session) {
        try {
            // 执行查询下拉内容
            List<Pzb> result = pzbService.getDW();
            return Result.success(result);

        } catch (Exception e) {
            log.error("查询配置表信息失败", e);
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    @PostMapping("/saveToOrderDetail")
    @ResponseBody
    public Map<String, Object> saveToOrderDetail(@RequestBody List<Ddmx> ddmxList) {

        Map<String, Object> result = new HashMap<>();
        try {
            if (ddmxList == null || ddmxList.isEmpty()) {
                result.put("success", false);
                result.put("message", "接收到的数据为空");
                return result;
            }

            int successCount = 0;
            List<String> errorMessages = new ArrayList<>();

            // 使用单条插入替代批量插入
            for (int i = 0; i < ddmxList.size(); i++) {
                try {
                    Ddmx ddmx = ddmxList.get(i);

                    // 数据验证
                    if (!validateDdmx(ddmx)) {
                        errorMessages.add("第 " + (i + 1) + " 条记录数据验证失败");
                        continue;
                    }

                    // 设置默认值
                    if (ddmx.getVersion() == null) {
                        ddmx.setVersion(0);
                    }
                    if (ddmx.getXh() == null || ddmx.getXh().trim().isEmpty()) {
                        ddmx.setXh(String.valueOf(i + 1));
                    }

                    // 单条保存
                    boolean saveResult = ddmxService.save(ddmx);
                    if (saveResult) {
                        successCount++;
                    } else {
                        errorMessages.add("第 " + (i + 1) + " 条记录保存失败");
                    }
                } catch (Exception e) {
                    errorMessages.add("第 " + (i + 1) + " 条记录保存异常: " + e.getMessage());
                    e.printStackTrace();
                }
            }

            if (successCount > 0) {
                result.put("success", true);
                result.put("message", "成功保存 " + successCount + " 条记录");
                if (!errorMessages.isEmpty()) {
                    result.put("errors", errorMessages);
                }
            } else {
                result.put("success", false);
                result.put("message", "所有记录保存失败");
                result.put("errors", errorMessages);
            }

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "保存过程中发生错误: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 验证 Ddmx 对象是否有效
     */
    private boolean validateDdmx(Ddmx ddmx) {
        if (ddmx == null) {
            return false;
        }
        // 检查必填字段
        if (ddmx.getPm() == null || ddmx.getPm().trim().isEmpty()) {
            return false;
        }
        if (ddmx.getDdh() == null || ddmx.getDdh().trim().isEmpty()) {
            return false;
        }
        return true;
    }

    @PostMapping("/checkContractNumber")
    @ResponseBody
    public Map<String, Object> checkContractNumber(@RequestBody Map<String, String> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            String ddh = params.get("ddh");
            if (ddh == null || ddh.trim().isEmpty()) {
                result.put("success", false);
                result.put("message", "合同编号不能为空");
                return result;
            }

            // 查询订单明细表中是否存在相同的合同号
            QueryWrapper<Ddmx> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("ddh", ddh);
            int count = ddmxService.count(queryWrapper);

            result.put("success", true);
            result.put("exists", count > 0);
            result.put("count", count);

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "检查合同号时发生错误: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/updateProductionOrderStatus")
    public Result updateProductionOrderStatus(HttpSession session, @RequestBody DetailRequestDTO request) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil2.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            // 数据验证
            if (request.getId() == null) {
                return Result.error("ID不能为空");
            }

            // 创建更新实体
            Xdmx entity = new Xdmx();
            entity.setId(request.getId());
            entity.setZt("已下单"); // 将状态改为待处理
            entity.setPrintCount(""); // 清空打印次数

            // 执行更新
            boolean success = xdmxService.updateById(entity);
            if (success) {
                log.info("订单清除成功，ID: {}", request.getId());
                return Result.success("订单清除成功");
            } else {
                return Result.error("订单清除失败");
            }

        } catch (Exception e) {
            log.error("订单清除失败", e);
            return Result.error("订单清除失败: " + e.getMessage());
        }
    }

    @PostMapping("/deletezt")
    public Result deletezt(HttpSession session, @RequestBody DetailRequestDTO request) {
        try {
            // 权限检查
            Result<?> authResult = AuthUtil.checkAdminAuth(session);
            if (!authResult.isSuccess()) {
                return Result.error(authResult.getCode(), authResult.getMessage());
            }

            // 数据验证
            if (request.getId() == null) {
                return Result.error("ID不能为空");
            }

            // 创建更新实体
            Xdmx entity = new Xdmx();
            entity.setId(request.getId());
            entity.setZt("删除"); // 将状态改为待处理
            entity.setScgd(""); // 清空生产工单
            entity.setPrintCount(""); // 清空打印次数

            // 执行更新
            boolean success = xdmxService.updateById(entity);
            if (success) {
                log.info("订单清除成功，ID: {}", request.getId());
                return Result.success("订单清除成功");
            } else {
                return Result.error("订单清除失败");
            }

        } catch (Exception e) {
            log.error("订单清除失败", e);
            return Result.error("订单清除失败: " + e.getMessage());
        }
    }


}
