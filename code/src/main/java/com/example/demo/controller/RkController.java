package com.example.demo.controller;

import com.example.demo.entity.Rk;
import com.example.demo.entity.UserInfo;
import com.example.demo.service.RkService;
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
@RequestMapping("/rk")
public class RkController {
    @Autowired
    private RkService rkService;

    /**
     * 查询所有
     *
     * @return ResultInfo
     */
    @RequestMapping("/getList")
    public ResultInfo getList(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Rk> getList = rkService.getList();
            return ResultInfo.success("获取成功", getList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }

    /**
     * 根据姓名和部门查询
     *
     * @return ResultInfo
     */
    @RequestMapping("/queryList")
    public ResultInfo queryList(String ksrq,String jsrq,String mc, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        if (ksrq.equals("")) {
            ksrq = "1900/1/1";
        }
        if (jsrq.equals("")) {
            jsrq = "2200/1/1";
        }
        try {
            List<Rk> list = rkService.queryList(ksrq,jsrq,mc);
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
        Rk rk = null;
        try {
            rk = DecodeUtil.decodeToJson(updateJson, Rk.class);
            if (rkService.update(rk)) {
                return ResultInfo.success("修改成功", rk);
            } else {
                return ResultInfo.success("修改失败", rk);
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
            Rk rk = GsonUtil.toEntity(gsonUtil.get("addInfo"), Rk.class);
            rk = rkService.add(rk);
            if (StringUtils.isNotNull(rk)) {
                return ResultInfo.success("添加成功", rk);
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
     * 添加
     */
    @RequestMapping("/add1")
    public ResultInfo add1(@RequestBody HashMap map, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
        if(!userInfo.getCaozuoquanxian().equals("可修改")){
            return ResultInfo.error(401, "无权限,请联系管理员");
        }
        try {
            Rk rk = GsonUtil.toEntity(gsonUtil.get("addInfo"), Rk.class);
            rk = rkService.add1(rk);
            if (StringUtils.isNotNull(rk)) {
                return ResultInfo.success("添加成功", rk);
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
                rkService.delete(Collections.singletonList(this_id));
            }
            return ResultInfo.success("删除成功", idList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("删除失败：{}", e.getMessage());
            log.error("参数：{}", idList);
            return ResultInfo.error("删除失败");
        }
    }

    /**
     * 查询库存均价
     *
     * @return ResultInfo
     */
    @RequestMapping("/getKcjj")
    public ResultInfo getKcjj(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Rk> getKcjj = rkService.getKcjj();
            return ResultInfo.success("获取成功", getKcjj);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }

    @RequestMapping(value = "/update1", method = RequestMethod.POST)
    public ResultInfo update1(int id,String mc,String rksl,String rkzl,String zje,String danhao, HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        System.out.println(111);
        Rk rk = new Rk();
        rk.setMc(mc);
        rk.setRksl(rksl);
        rk.setRkzl(rkzl);
        rk.setZje(zje);
        rk.setDanhao(danhao);
        rk.setId(id);
        try {
            if (rkService.update1(rk)) {
                return ResultInfo.success("修改成功1", rk);
            } else {
                return ResultInfo.success("修改失败2", rk);
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("修改失败3：{}", e.getMessage());
//            log.error("参数：{}", userInfo);
            return ResultInfo.error("修改失败4");
        }
    }

}