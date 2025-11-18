package com.example.demo.controller;

import com.example.demo.entity.Mx;
import com.example.demo.entity.UserInfo;
import com.example.demo.service.MxService;
import com.example.demo.util.GsonUtil;
import com.example.demo.util.ResultInfo;
import com.example.demo.util.SessionUtil;
import com.example.demo.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/mx")
public class MxController {
    @Autowired
    private MxService mxService;

    /**
     * 查询所有
     *
     * @return ResultInfo
     */
    @RequestMapping("/getList")
    public ResultInfo getList(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Mx> getList = mxService.getList();
            return ResultInfo.success("获取成功", getList);
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
    public ResultInfo queryList(String ksrq,String jsrq,String gsm, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        if (ksrq.equals("")) {
            ksrq = "1900/1/1";
        }
        if (jsrq.equals("")) {
            jsrq = "2200/1/1";
        }
        try {
            List<Mx> list = mxService.queryList(ksrq,jsrq,gsm);
            return ResultInfo.success("获取成功", list);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }

    @RequestMapping("/add")
    public ResultInfo add(@RequestBody HashMap map, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
        if(!userInfo.getCaozuoquanxian().equals("可修改")){
            return ResultInfo.error(401, "无权限,请联系管理员");
        }
        try {
            Mx mx= GsonUtil.toEntity(gsonUtil.get("addInfo"), Mx.class);
            mx = mxService.add(mx);
            if (StringUtils.isNotNull(mx)) {
                return ResultInfo.success("添加成功", mx);
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
    @RequestMapping("/add1")
    public ResultInfo add1(@RequestBody HashMap map, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
        if (!userInfo.getCaozuoquanxian().equals("可修改")) {
            return ResultInfo.error(401, "无权限,请联系管理员");
        }
        try {
            Mx mx = GsonUtil.toEntity(gsonUtil.get("addInfo"), Mx.class);
            System.out.println(99);
            System.out.println(mx);
            mx = mxService.add2(mx);
            if (StringUtils.isNotNull(mx)) {
                return ResultInfo.success("添加成功", mx);
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
//    @RequestMapping(value = "/update", method = RequestMethod.POST)
//    public ResultInfo update(@RequestBody HttpSession session,String mc,String js,String zl,String je,String danhao) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        if(!userInfo.getCaozuoquanxian().equals("可修改")){
//            return ResultInfo.error(401, "无权限,请联系管理员");
//        }
//        try {
//            if (mxService.update(mc,js,zl,je,danhao)) {
//                return ResultInfo.success("修改成功", true);
//            } else {
//                return ResultInfo.success("修改失败", true);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("修改失败：{}", e.getMessage());
////            log.error("参数：{}", userInfo);
//            return ResultInfo.error("修改失败");
//        }
//    }
//    @RequestMapping(value = "/update", method = RequestMethod.POST)
//    public ResultInfo update(String mc,String js,String zl,String je,String danhao,HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        System.out.println("------------");
//        Mx mx = new Mx();
//        mx.setMc(mc);
//        mx.setJs(js);
//        mx.setZl(zl);
//        mx.setJe(je);
//        mx.setDanhao(danhao);
//        System.out.println("------------");
//        System.out.println(mx.getDanhao());
//        try {
//            if (mxService.update(mx)) {
//                return ResultInfo.success("修改成功", mx);
//            } else {
//                return ResultInfo.success("修改失败", mx);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("修改失败：{}", e.getMessage());
////            log.error("参数：{}", userInfo);
//            return ResultInfo.error("修改失败");
//        }
//    }

    /**
     * 修改
     */
//    @RequestMapping(value = "/update1", method = RequestMethod.POST)
//    public ResultInfo update1(int id,String mc,String js,String zl,String je,String danhao, HttpSession session) {
////        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        System.out.println(111);
//        Mx mx = new Mx();
//        mx.setMc(mc);
//        mx.setJs(js);
//        mx.setZl(zl);
//        mx.setJe(je);
//        mx.setDanhao(danhao);
//        mx.setId(id);
//        try {
//            if (mxService.update1(mx)) {
//                return ResultInfo.success("修改成功1", mx);
//            } else {
//                return ResultInfo.success("修改失败2", mx);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("修改失败3：{}", e.getMessage());
////            log.error("参数：{}", userInfo);
//            return ResultInfo.error("修改失败4");
//        }
//    }

//    @RequestMapping("/deleteMingxi")
//    public ResultInfo deleteMingxi(@RequestBody String danhao,int id,String mc,String js,String zl,String je,HashMap map,HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
//        List<Integer> idList = GsonUtil.toList(gsonUtil.get("idList"), Integer.class);
////        if(!userInfo.getCaozuoquanxian().equals("可修改")){
////            return ResultInfo.error(401, "无权限,请联系管理员");
////        }
//        try {
//            for(int i=0; i<idList.size(); i++){
//                int this_id = idList.get(i);
//                mxService.deleteMingxi(danhao);
//            }
//            return ResultInfo.success("删除成功", idList);
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("删除失败：{}", e.getMessage());
//            log.error("参数：{}", idList);
//            return ResultInfo.error("删除失败");
//        }
//    }

    @RequestMapping("/queryListMingxi")
    public ResultInfo queryListMingxi(String danhao,int id,String mc,String rksl,String rkzl,String zje, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        System.out.println(11122);
        try {
            List<Mx> list = mxService.queryListMingxi(danhao);
            System.out.println(list.get(0).getId());
            Mx mx = new Mx();
            mx.setMc(mc);
            mx.setRksl(rksl);
            mx.setRkzl(rkzl);
            mx.setZje(zje);
            mx.setDanhao(danhao);
//            mx.setId(list.toArray().id);
            mx.setId(list.get(0).getId());
//            System.out.println(list.get(0).getId());
            mxService.update1(mx);
            return ResultInfo.success("获取成功", list);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }

    @RequestMapping("/queryListMingxi1")
    public ResultInfo queryListMingxi1(String danhao,int id,String mc,String js,String zl,String je,String dj, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        System.out.println(11122333);
        try {
            List<Mx> list = mxService.queryListMingxi1(danhao);
            System.out.println(list.get(0).getId());
            Mx mx = new Mx();
            mx.setMc(mc);
            mx.setJs(js);
            mx.setJe(je);
            mx.setZl(zl);
            mx.setDj(dj);
            mx.setDanhao(danhao);
//            mx.setId(list.toArray().id);
            mx.setId(list.get(0).getId());
//            System.out.println(list.get(0).getId());
            mxService.update2(mx);
            return ResultInfo.success("获取成功", list);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }

}