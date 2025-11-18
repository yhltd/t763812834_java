package com.example.demo.controller;

import com.example.demo.entity.UserInfo;
import com.example.demo.entity.Xsd;
import com.example.demo.entity.Zhbhs;
import com.example.demo.service.XsdService;
import com.example.demo.service.ZhbhsService;
import com.example.demo.util.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/zhbhs")
public class ZhbhsController {
    @Autowired
    private ZhbhsService zhbhsService;

    /**
     * 查询所有
     *
     * @return ResultInfo
     */
    @RequestMapping("/getList")
    public ResultInfo getList(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Zhbhs> getList = zhbhsService.getList();
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
    public ResultInfo queryList(String ksrq,String jsrq, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        if (ksrq.equals("")) {
            ksrq = "1900/1/1";
        }
        if (jsrq.equals("")) {
            jsrq = "2200/1/1";
        }
        try {
            List<Zhbhs> list = zhbhsService.queryList(ksrq,jsrq);
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
//    @RequestMapping(value = "/update", method = RequestMethod.POST)
//    public ResultInfo update(@RequestBody String updateJson, HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        if(!userInfo.getCaozuoquanxian().equals("可修改")){
//            return ResultInfo.error(401, "无权限,请联系管理员");
//        }
//        Xsd xsd = null;
//        try {
//            xsd = DecodeUtil.decodeToJson(updateJson, Xsd.class);
//            if (xsdService.update(xsd)) {
//                return ResultInfo.success("修改成功", xsd);
//            } else {
//                return ResultInfo.success("修改失败", xsd);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("修改失败：{}", e.getMessage());
////            log.error("参数：{}", userInfo);
//            return ResultInfo.error("修改失败");
//        }
//    }

    /**
     * 添加
     */
//    @RequestMapping("/add")
//    public ResultInfo add(@RequestBody HashMap map, HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
//        if(!userInfo.getCaozuoquanxian().equals("可修改")){
//            return ResultInfo.error(401, "无权限,请联系管理员");
//        }
//        try {
//            Xsd xsd = GsonUtil.toEntity(gsonUtil.get("addInfo"), Xsd.class);
//            xsd = xsdService.add(xsd);
//            if (StringUtils.isNotNull(xsd)) {
//                return ResultInfo.success("添加成功", xsd);
//            } else {
//                return ResultInfo.success("添加失败", null);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("添加失败：{}", e.getMessage());
//            log.error("参数：{}", map);
//            return ResultInfo.error("添加失败");
//        }
//    }

    /**
     * 删除
     *
     * @param map
     * @return ResultInfo
     */
//    @RequestMapping("/delete")
//    public ResultInfo delete(@RequestBody HashMap map,HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
//        List<Integer> idList = GsonUtil.toList(gsonUtil.get("idList"), Integer.class);
//        if(!userInfo.getCaozuoquanxian().equals("可修改")){
//            return ResultInfo.error(401, "无权限,请联系管理员");
//        }
//        try {
//            for(int i=0; i<idList.size(); i++){
//                int this_id = idList.get(i);
//                xsdService.delete(Collections.singletonList(this_id));
//            }
//            return ResultInfo.success("删除成功", idList);
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("删除失败：{}", e.getMessage());
//            log.error("参数：{}", idList);
//            return ResultInfo.error("删除失败");
//        }
//    }

    /**
     * 获取当天单价
     *
     * @return ResultInfo
     */
//    @RequestMapping("/getDj")
//    public ResultInfo getDj(String dj, HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        try {
//            List<Xsd> list = xsdService.getDj(dj);
//            return ResultInfo.success("获取成功", list);
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("获取失败：{}", e.getMessage());
//            return ResultInfo.error("错误!");
//        }
//    }

    /**
     * 打印
     *
     * @return ResultInfo
     */
//    @RequestMapping("/print")
//    public ResultInfo print(@RequestBody HashMap map, HttpSession session, HttpServletResponse response) {
//        try {
//            GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
//            List<Xsd> nlist = GsonUtil.toList(gsonUtil.get("list"), Xsd.class);
//            List<Xsd> list=new ArrayList<>();
//            if(nlist != null){
//                list= xsdService.getListByShdw(nlist.get(0).getShdw(),nlist.get(0).getDh(),nlist.get(0).getRiqi());
//            }
//            return ResultInfo.success("成功！",list);
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("失败：{}", e.getMessage());
//            return ResultInfo.error("失败！");
//        }
//    }

}