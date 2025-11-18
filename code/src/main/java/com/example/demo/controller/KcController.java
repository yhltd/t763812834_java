package com.example.demo.controller;

import com.example.demo.entity.*;
import com.example.demo.service.KcService;
import com.example.demo.service.MxService;
import com.example.demo.util.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/kc")
public class KcController {
    @Autowired
    private KcService kcService;
    /**
     * 查询所有
     *
     * @return ResultInfo
     */
    @RequestMapping("/getList")
    public ResultInfo getList(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Kc> getList = kcService.getList();
            return ResultInfo.success("获取成功", getList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }
    @RequestMapping("/getList1")
    public ResultInfo getList1(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Kc> getList1 = kcService.getList1();
            return ResultInfo.success("获取成功", getList1);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }
    @RequestMapping("/getList2")
    public ResultInfo getList2(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Kc> getList2 = kcService.getList2();
            return ResultInfo.success("获取成功", getList2);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }
    //根据商品名称查询
    @RequestMapping("/spmcList")
    public ResultInfo spmcList(String mc, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);

        try {
            List<Kc> list = kcService.spmcList(mc);
            return ResultInfo.success("获取成功", list);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }
    /**
     *
     *
     * @return ResultInfo
     */
    @RequestMapping("/queryList")
    public ResultInfo queryList(String ksrq,String jsrq, String mc,HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        if (ksrq.equals("")) {
            ksrq = "1900/1/1";
        }
        if (jsrq.equals("")) {
            jsrq = "2200/1/1";
        }
        try {
            List<Kc> list = kcService.queryList(ksrq,jsrq,mc);
            return ResultInfo.success("获取成功", list);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }
    /**
     * 修改
     */
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public ResultInfo update(@RequestBody String updateJson, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        if(!userInfo.getCaozuoquanxian().equals("可修改")){
            return ResultInfo.error(401, "无权限,请联系管理员");
        }
        Kc kc = null;
        try {
            kc = DecodeUtil.decodeToJson(updateJson, Kc.class);
            if (kcService.update(kc)) {
                return ResultInfo.success("修改成功", kc);
            } else {
                return ResultInfo.success("修改失败", kc);
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("修改失败：{}", e.getMessage());
//            log.error("参数：{}", userInfo);
            return ResultInfo.error("修改失败");
        }
    }

    /**
     * 添加
     */
    @RequestMapping("/add")
    public ResultInfo add(@RequestBody HashMap map, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
        if(!userInfo.getCaozuoquanxian().equals("可修改")){
            return ResultInfo.error(401, "无权限,请联系管理员");
        }
        try {
            Kc kc = GsonUtil.toEntity(gsonUtil.get("addInfo"), Kc.class);
            kc = kcService.add(kc);
            if (StringUtils.isNotNull(kc)) {
                return ResultInfo.success("添加成功", kc);
            } else {
                return ResultInfo.success("添加失败", null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("添加失败：{}", e.getMessage());
            log.error("参数：{}", map);
            return ResultInfo.error("添加失败");
        }
    }

    /**
     * 删除
     *
     * @param map
     * @return ResultInfo
     */
    @RequestMapping("/delete")
    public ResultInfo delete(@RequestBody HashMap map,HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
        List<Integer> idList = GsonUtil.toList(gsonUtil.get("idList"), Integer.class);
        if(!userInfo.getCaozuoquanxian().equals("可修改")){
            return ResultInfo.error(401, "无权限,请联系管理员");
        }
        try {
            for(int i=0; i<idList.size(); i++){
                int this_id = idList.get(i);
                kcService.delete(Collections.singletonList(this_id));
            }
            return ResultInfo.success("删除成功", idList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("删除失败：{}", e.getMessage());
            log.error("参数：{}", idList);
            return ResultInfo.error("删除失败");
        }
    }


    @RequestMapping("/hqxlMc")
    public ResultInfo hqxlMc() {
        try {
            List<Kc> hqxlMc = kcService.hqxlMc();
            return ResultInfo.success("获取成功", hqxlMc);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }

}