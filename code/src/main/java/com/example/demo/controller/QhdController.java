package com.example.demo.controller;

import com.example.demo.entity.Qhd;
import com.example.demo.entity.UserInfo;
import com.example.demo.entity.Ysyf;
import com.example.demo.service.KhzlService;
import com.example.demo.service.QhdService;
import com.example.demo.service.YsyfService;
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
@RequestMapping("/qhd")
public class QhdController {
    @Autowired
    private QhdService qhdService;
    @Autowired
    private KhzlService khzlService;
    /**
     * 查询所有
     *
     * @return ResultInfo
     */
    @RequestMapping("/getList")
    public ResultInfo getList(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Qhd> getList = qhdService.getList();
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
    public ResultInfo queryList(String ksrq,String jsrq,String gsm,HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        if (ksrq.equals("")) {
            ksrq = "1900/1/1";
        }
        if (jsrq.equals("")) {
            jsrq = "2200/1/1";
        }
        try {
            List<Qhd> list = qhdService.queryList(ksrq,jsrq,gsm);
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
        Qhd qhd = null;
        try {
            qhd = DecodeUtil.decodeToJson(updateJson, Qhd.class);
            if (qhdService.update(qhd)) {
                return ResultInfo.success("修改成功", qhd);
            } else {
                return ResultInfo.success("修改失败", qhd);
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
//    @RequestMapping("/add")
//    public ResultInfo add(@RequestBody HashMap map, HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
//        if(!userInfo.getCaozuoquanxian().equals("可修改")){
//            return ResultInfo.error(401, "无权限,请联系管理员");
//        }
//        try {
//            Qhd qhd = GsonUtil.toEntity(gsonUtil.get("addInfo"), Qhd.class);
//            qhd = qhdService.add(qhd);
//            if (StringUtils.isNotNull(qhd)) {
//                return ResultInfo.success("添加成功", qhd);
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
     * 添加
     */
//    @RequestMapping("/add1")
//    public ResultInfo add1(@RequestBody HashMap map, HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
//        if(!userInfo.getCaozuoquanxian().equals("可修改")){
//            return ResultInfo.error(401, "无权限,请联系管理员");
//        }
//        try {
//            Qhd qhd = GsonUtil.toEntity(gsonUtil.get("addInfo"), Qhd.class);
//            qhd = qhdService.add1(qhd);
//            if (StringUtils.isNotNull(qhd)) {
//                return ResultInfo.success("添加成功", qhd);
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
                qhdService.delete(Collections.singletonList(this_id));
            }
            return ResultInfo.success("删除成功", idList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("删除失败：{}", e.getMessage());
            log.error("参数：{}", idList);
            return ResultInfo.error("删除失败");
        }
    }
    @RequestMapping("/add")
    public ResultInfo add(HttpSession session,String riqi,String bh,String ysje,String zys,String bz,String gsm,String Zys,String fkfs) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            if(fkfs.equals("签回单")) {
                float zys1 = 0;
                Zys = khzlService.getysje(gsm);
                if (Zys == "") {
                    zys1 = 0;

                } else {
                    zys1 = Float.parseFloat(Zys);
                }
                float Ysje = Float.parseFloat(ysje);
                float Zys2 = zys1 + Ysje;
                zys = Float.toString(Zys2);
                System.out.println(zys);
                khzlService.upysje(zys, gsm);
                boolean list = qhdService.add1(riqi, gsm, ysje, bz, bh, zys);
                System.out.println(list);
                return ResultInfo.success("添加成功", list);
            }
            else{
                return ResultInfo.success("添加成功", null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("添加失败：{}", e.getMessage());

            return ResultInfo.error("添加失败");
        }
    }

}