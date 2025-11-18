//package com.example.demo.controller;
//
//import com.example.demo.entity.Cgx;
//import com.example.demo.entity.Khzl;
//import com.example.demo.entity.UserInfo;
//import com.example.demo.entity.Xsd;
//import com.example.demo.service.CgxService;
//import com.example.demo.service.KhzlService;
//import com.example.demo.service.QhdService;
//import com.example.demo.service.XsdService;
//import com.example.demo.util.*;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.RestController;
//
//import javax.servlet.http.HttpServletResponse;
//import javax.servlet.http.HttpSession;
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.HashMap;
//import java.util.List;
//
//@Slf4j
//@RestController
//@RequestMapping("/xsd")
//public class XsdController {
//    @Autowired
//    private XsdService xsdService;
//    @Autowired
//    private CgxService cgxService;
//    @Autowired
//    private KhzlService khzlService;
//    @Autowired
//    private QhdService qhdService;
//    /**
//     * 查询所有
//     *
//     * @return ResultInfo
//     */
//    @RequestMapping("/getList")
//    public ResultInfo getList(HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        try {
//            List<Xsd> getList = xsdService.getList();
//            return ResultInfo.success("获取成功", getList);
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("获取失败：{}", e.getMessage());
//            return ResultInfo.error("错误!");
//        }
//    }
//
//
//    @RequestMapping("/getList2")
//    public ResultInfo getList2(HttpSession session,String dh) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        try {
//            List<Xsd> getList = xsdService.getList2(dh);
//            return ResultInfo.success("获取成功", getList);
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("获取失败：{}", e.getMessage());
//            return ResultInfo.error("错误!");
//        }
//    }
//
//
//
//
//
//
//
//    /**
//     * 根据姓名和部门查询
//     *
//     * @return ResultInfo
//     */
//    @RequestMapping("/queryList")
//    public ResultInfo queryList(String ksrq, String jsrq, String shdw,HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        if (ksrq.equals("")) {
//            ksrq = "1900/1/1";
//        }
//        if (jsrq.equals("")) {
//            jsrq = "2200/1/1";
//        }
//        try {
//            List<Xsd> list = xsdService.queryList(ksrq, jsrq,shdw);
//            return ResultInfo.success("获取成功", list);
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("获取失败：{}", e.getMessage());
//            return ResultInfo.error("错误!");
//        }
//    }
//
//    /**
//     * 修改
//     */
//    @RequestMapping(value = "/update", method = RequestMethod.POST)
//    public ResultInfo update( HttpSession session ,String riqi,String dh,String shdw,String mc,String mh,String gg,String js,String zl,String dj,String je,String bz,String shdz,String kddh,String sfyj,String fkfs,String sfhs,String gd,String zdr,String shdwjjsr,String jgf,String kdf,String hsdj,String sd,String whsdj,int id) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        if (!userInfo.getCaozuoquanxian().equals("可修改")) {
//            return ResultInfo.error(401, "无权限,请联系管理员");
//        }
//        Xsd xsd = null;
//        try {
//            xsdService.update( riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf, hsdj, sd, whsdj,id);
////            if(xsd.getFkfs().equals("签回单")){
////                qhdService.add1(xsd.getRiqi(),xsd.getShdw(),xsd.getHjje(),xsd.getBz(),xsd.getDh());
////                if (xsdService.update(xsd)) {
////                    return ResultInfo.success("修改成功", xsd);
////                } else {
////                    return ResultInfo.success("修改失败", xsd);
////                }
////            }else {
////                if (xsdService.update(xsd)) {
////                    return ResultInfo.success("修改成功", xsd);
////                } else {
////                    return ResultInfo.success("修改失败", xsd);
////                }
////            }
//            return ResultInfo.success("修改成功", xsd);
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("修改失败：{}", e.getMessage());
////            log.error("参数：{}", userInfo);
//            return ResultInfo.error("修改失败");
//        }
//    }
//
//    /**
//     * 添加
//     */
//
//    /**
//     * 添加
//     */
//    @RequestMapping("/add")
//    public ResultInfo add(HttpSession session ,String riqi, String dh, String shdw, String mc, String mh, String gg, String js
//            , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
//                          String zdr, String shdwjjsr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
//                          String bzld, String hjzl) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        if (!userInfo.getCaozuoquanxian().equals("可修改")) {
//            return ResultInfo.error(401, "无权限,请联系管理员");
//        }
//        if (sfhs.equals("含税") || sfhs.equals("金额含税")) {
//            if (dj.equals("")) {
//                je = "0";
//                hsdj = "0";
//                whsdj = "0";
//                jgf="0";
////                jgf = String.valueOf(Float.parseFloat(js) * 0.5);
//                hjje = String.valueOf((Float.parseFloat(je) + Float.parseFloat(jgf) + Float.parseFloat(kdf)) * Float.parseFloat(sd));
//            } else { hsdj = String.valueOf(Float.parseFloat(dj) * Float.parseFloat(sd));
//                whsdj = String.valueOf(Float.parseFloat(hsdj) / Float.parseFloat(sd));
//                je = String.valueOf(Float.parseFloat(zl) * Float.parseFloat(dj));
//                jgf = "0";
////                hjje = String.valueOf(Float.parseFloat(je) + Float.parseFloat(jgf) + Float.parseFloat(kdf));
//            }
//        } else {
//            if (dj.equals("")) {
//                je = "0";
//                hsdj = "0";
//                whsdj = "0";
//            } else {
//                hsdj = "0";
//                whsdj = "0";
//                je = String.valueOf(Float.parseFloat(zl) * Float.parseFloat(dj));
//                jgf = String.valueOf(Float.parseFloat(js) * 0.5);
//                hjje = String.valueOf((Float.parseFloat(je) + Float.parseFloat(jgf) + Float.parseFloat(kdf)) * Float.parseFloat(sd));
//            }
//        }
//
//
//        try {
//
////            xsdService.add(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,
////                    hsdj, sd, whsdj, hjje, bzld, hjzl);
////                return ResultInfo.success("添加成功", null);
//
//            if (userInfo.getPower().equals("管理员")) {
//                if (mc.equals("换铜块")) {
//                    int jzl = Integer.parseInt(zl);
//                    int yzl = Integer.parseInt(khzlService.gettkkc(shdw));
//                    int xzl = yzl - jzl;
//                    String tkkc = Integer.toString(xzl);
//                    khzlService.tkkc(tkkc, shdw);
//
//
//                    if (fkfs.equals("签回单")) {
//                        boolean list = qhdService.add1(riqi, shdw, hjje, bz, dh);
//
////                        return ResultInfo.success("添加成功", null);
//                    }
//                    xsdService.add(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,
//                            hsdj, sd, whsdj, hjje, bzld, hjzl);
//                } else if (mc.equals("换铜渣")) {
//
//                    int jzl = Integer.parseInt(zl);
//                    int yzl = Integer.parseInt(khzlService.gettzkc(shdw));
//                    int xzl = yzl - jzl;
//                    String tzkc = Integer.toString(xzl);
//                    khzlService.tzkc(tzkc, shdw);
//
//                    if (fkfs.equals("签回单")) {
//                        qhdService.add1(riqi, shdw, hjje, bz, dh);
//
//                    }
//                    xsdService.add(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,
//                            hsdj, sd, whsdj, hjje, bzld, hjzl);
//                    return ResultInfo.success("添加成功", null);
//                } else if (dj.equals("")) {
//                    if (mc.equals("回收铜块")) {
//                        int jzl = Integer.parseInt(zl);
//                        int yzl = Integer.parseInt(khzlService.gettkkc(shdw));
//                        int xzl = yzl + jzl;
//                        String tkkc = Integer.toString(xzl);
//                        khzlService.tkkc(tkkc, shdw);
//                        if (fkfs.equals("签回单")) {
//                            qhdService.add1(riqi, shdw, hjje, bz, dh);
//
////                            return ResultInfo.success("添加成功", null);
//                        }
//                        xsdService.add(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,
//                                hsdj, sd, whsdj, hjje, bzld, hjzl);
//                    } else if (mc.equals("回收铜渣")) {
//                        int jzl = Integer.parseInt(zl);
//                        int yzl = Integer.parseInt(khzlService.gettzkc(shdw));
//                        int xzl = yzl + jzl;
//                        String tzkc = Integer.toString(xzl);
//                        khzlService.tzkc(tzkc, shdw);
//
//                        if (fkfs.equals("签回单")) {
//                            qhdService.add1(riqi, shdw, hjje, bz, dh);
//
////                            return ResultInfo.success("添加成功", null);
//                        }
//                        xsdService.add(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,
//                                hsdj, sd, whsdj, hjje, bzld, hjzl);
//                    }
//                } else {
//                    if (fkfs.equals("签回单")) {
//                        qhdService.add1(riqi, shdw, hjje, bz, dh);
//                        xsdService.add(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,
//                                hsdj, sd, whsdj, hjje, bzld, hjzl);
//                        return ResultInfo.success("添加成功", null);
//                    }
//                }
//            }
//            if (xsdService.add(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,
//                    hsdj, sd, whsdj, hjje, bzld, hjzl)) {
//                return ResultInfo.success("修改成功", riqi);
//            } else {
//                return ResultInfo.success("修改失败", riqi);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("添加失败：{}", e.getMessage());
//            return ResultInfo.error("添加失败");
//        }
//    }
//
//    /**
//     * 删除
//     *
//     * @param map
//     * @return ResultInfo
//     */
//    @RequestMapping("/delete")
//    public ResultInfo delete(@RequestBody HashMap map, HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
//        List<Integer> idList = GsonUtil.toList(gsonUtil.get("idList"), Integer.class);
//        if (!userInfo.getCaozuoquanxian().equals("可修改")) {
//            return ResultInfo.error(401, "无权限,请联系管理员");
//        }
//        try {
//            for (int i = 0; i < idList.size(); i++) {
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
//
//    /**
//     * 获取当天单价
//     *
//     * @return ResultInfo
//     */
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
//
//    /**
//     * 打印
//     *
//     * @return ResultInfo
//     */
//    @RequestMapping("/print")
//    public ResultInfo print(@RequestBody HashMap map, HttpSession session, HttpServletResponse response) {
//        try {
//            GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
//            List<Xsd> nlist = GsonUtil.toList(gsonUtil.get("list"), Xsd.class);
//            List<Xsd> list = new ArrayList<>();
//            if (nlist != null) {
//                list = xsdService.getListByShdw(nlist.get(0).getShdw(), nlist.get(0).getDh(), nlist.get(0).getRiqi());
//            }
//            return ResultInfo.success("成功！", list);
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("失败：{}", e.getMessage());
//            return ResultInfo.error("失败！");
//        }
//    }
//
//    @RequestMapping("/delete1")
//    public ResultInfo delete1(HttpSession session,String dh) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        if (!userInfo.getCaozuoquanxian().equals("可修改")) {
//            return ResultInfo.error(401, "无权限,请联系管理员");
//        }
//        try {
//                xsdService.delete1(dh);
//
//            return ResultInfo.success("删除成功", null);
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("删除失败：{}", e.getMessage());
//            return ResultInfo.error("删除失败");
//        }
//    }
//
//
//}
package com.example.demo.controller;

import com.example.demo.entity.Cgx;
import com.example.demo.entity.Khzl;
import com.example.demo.entity.UserInfo;
import com.example.demo.entity.Xsd;
import com.example.demo.service.CgxService;
import com.example.demo.service.KhzlService;
import com.example.demo.service.QhdService;
import com.example.demo.service.XsdService;
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
@RequestMapping("/xsd")
public class XsdController {
    @Autowired
    private XsdService xsdService;
    @Autowired
    private CgxService cgxService;
    @Autowired
    private KhzlService khzlService;
    @Autowired
    private QhdService qhdService;
    /**
     * 查询所有
     *
     * @return ResultInfo
     */
    @RequestMapping("/getList")
    public ResultInfo getList(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Xsd> getList = xsdService.getList();
            return ResultInfo.success("获取成功", getList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }

    @RequestMapping("/getList2")
    public ResultInfo getList2(HttpSession session,String dh) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Xsd> getList = xsdService.getList2(dh);
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
    public ResultInfo queryList(String ksrq, String jsrq, String shdw,HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        if (ksrq.equals("")) {
            ksrq = "1900/1/1";
        }
        if (jsrq.equals("")) {
            jsrq = "2200/1/1";
        }
        try {
            List<Xsd> list = xsdService.queryList(ksrq, jsrq,shdw);
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
    public ResultInfo update( HttpSession session ,String riqi,String dh,String shdw,String mc,String mh,String gg,String zl,String dj,String je,String bz,String shdz,String kddh,String sfyj,String fkfs,String sfhs,String gd,String zdr,String jgf,String kdf,String hsdj,String sd,String whsdj,int id) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        if (!userInfo.getCaozuoquanxian().equals("可修改")) {
            return ResultInfo.error(401, "无权限,请联系管理员");
        }
        Xsd xsd = null;
        try {
            xsdService.update( riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf, hsdj, sd, whsdj,id);
//            if(xsd.getFkfs().equals("签回单")){
//                qhdService.add1(xsd.getRiqi(),xsd.getShdw(),xsd.getHjje(),xsd.getBz(),xsd.getDh());
//                if (xsdService.update(xsd)) {
//                    return ResultInfo.success("修改成功", xsd);
//                } else {
//                    return ResultInfo.success("修改失败", xsd);
//                }
//            }else {
//                if (xsdService.update(xsd)) {
//                    return ResultInfo.success("修改成功", xsd);
//                } else {
//                    return ResultInfo.success("修改失败", xsd);
//                }
//            }
            return ResultInfo.success("修改成功", xsd);
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
//    public ResultInfo add(HttpSession session ,String riqi, String dh, String shdw, String mc, String mh, String gg
//            , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
//                          String zdr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
//                          String bzld, String hjzl) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        if (!userInfo.getCaozuoquanxian().equals("可修改")) {
//            return ResultInfo.error(401, "无权限,请联系管理员");
//        }
//        if (sfhs.equals("含税") || sfhs.equals("金额含税")) {
//            if (dj.equals("")) {
//                je = "0";
//                hsdj = "0";
//                whsdj = "0";
//                jgf="0";
////                jgf = String.valueOf(Float.parseFloat(js) * 0.5);
////                hjje = String.valueOf((Float.parseFloat(je) + Float.parseFloat(jgf) + Float.parseFloat(kdf)) * Float.parseFloat(sd));
//                hjje = String.valueOf((Float.parseFloat(je) + Float.parseFloat(kdf)) * Float.parseFloat(sd));
//            } else { hsdj = String.valueOf(Float.parseFloat(dj) * Float.parseFloat(sd));
//                whsdj = String.valueOf(Float.parseFloat(hsdj) / Float.parseFloat(sd));
//                je = String.valueOf(Float.parseFloat(zl) * Float.parseFloat(dj));
//                jgf = "0";
////                hjje = String.valueOf(Float.parseFloat(je) + Float.parseFloat(jgf) + Float.parseFloat(kdf));
//            }
//        } else {
//            if (dj.equals("")) {
//                je = "0";
//                hsdj = "0";
//                whsdj = "0";
//            } else {
//                hsdj = "0";
//                whsdj = "0";
//                je = String.valueOf(Float.parseFloat(zl) * Float.parseFloat(dj));
////                jgf = String.valueOf(Float.parseFloat(js) * 0.5);
////                hjje = String.valueOf((Float.parseFloat(je) + Float.parseFloat(jgf) + Float.parseFloat(kdf)) * Float.parseFloat(sd));
//                hjje = String.valueOf(Float.parseFloat(je) + Float.parseFloat(kdf));
//            }
//        }
//
//        try {
//            if (userInfo.getPower().equals("管理员")) {
//                if (mc.equals("换铜块")) {
//                    int jzl = Integer.parseInt(zl);
//                    int yzl = Integer.parseInt(khzlService.gettkkc(shdw));
//                    int xzl = yzl - jzl;
//                    String tkkc = Integer.toString(xzl);
//                    khzlService.tkkc(tkkc, shdw);
//                    if (fkfs.equals("签回单")) {
//                        boolean list = qhdService.add1(riqi, shdw, hjje, bz, dh);
////                        return ResultInfo.success("添加成功", null);
//                    }
//                    xsdService.add(riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf,
//                            hsdj, sd, whsdj, hjje, bzld, hjzl);
//                } else if (mc.equals("换铜渣")) {
//                    int jzl = Integer.parseInt(zl);
//                    int yzl = Integer.parseInt(khzlService.gettzkc(shdw));
//                    int xzl = yzl - jzl;
//                    String tzkc = Integer.toString(xzl);
//                    khzlService.tzkc(tzkc, shdw);
//                    if (fkfs.equals("签回单")) {
//                        qhdService.add1(riqi, shdw, hjje, bz, dh);
//                    }
//                    xsdService.add(riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf,
//                            hsdj, sd, whsdj, hjje, bzld, hjzl);
//                    return ResultInfo.success("添加成功", null);
//                } else if (dj.equals("")) {
//                    if (mc.equals("回收铜块")) {
//                        int jzl = Integer.parseInt(zl);
//                        int yzl = Integer.parseInt(khzlService.gettkkc(shdw));
//                        int xzl = yzl + jzl;
//                        String tkkc = Integer.toString(xzl);
//                        khzlService.tkkc(tkkc, shdw);
//                        if (fkfs.equals("签回单")) {
//                            qhdService.add1(riqi, shdw, hjje, bz, dh);
////                            return ResultInfo.success("添加成功", null);
//                        }
//                        xsdService.add(riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf,
//                                hsdj, sd, whsdj, hjje, bzld, hjzl);
//                    } else if (mc.equals("回收铜渣")) {
//                        int jzl = Integer.parseInt(zl);
//                        int yzl = Integer.parseInt(khzlService.gettzkc(shdw));
//                        int xzl = yzl + jzl;
//                        String tzkc = Integer.toString(xzl);
//                        khzlService.tzkc(tzkc, shdw);
//                        if (fkfs.equals("签回单")) {
//                            qhdService.add1(riqi, shdw, hjje, bz, dh);
////                            return ResultInfo.success("添加成功", null);
//                        }
//                        xsdService.add(riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf,
//                                hsdj, sd, whsdj, hjje, bzld, hjzl);
//                    }
//                } else {
//                    if (fkfs.equals("签回单")) {
//                        qhdService.add1(riqi, shdw, hjje, bz, dh);
//                        xsdService.add(riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf,
//                                hsdj, sd, whsdj, hjje, bzld, hjzl);
//                        return ResultInfo.success("添加成功", null);
//                    }
//                }
//            }
//            if (xsdService.add(riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf,
//                    hsdj, sd, whsdj, hjje, bzld, hjzl)) {
//                return ResultInfo.success("修改成功", riqi);
//            } else {
//                return ResultInfo.success("修改失败", riqi);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("添加失败：{}", e.getMessage());
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
    public ResultInfo delete(@RequestBody HashMap map, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
        List<Integer> idList = GsonUtil.toList(gsonUtil.get("idList"), Integer.class);
        if (!userInfo.getCaozuoquanxian().equals("可修改")) {
            return ResultInfo.error(401, "无权限,请联系管理员");
        }
        try {
            for (int i = 0; i < idList.size(); i++) {
                int this_id = idList.get(i);
                xsdService.delete(Collections.singletonList(this_id));
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
     * 获取当天单价
     *
     * @return ResultInfo
     */
    @RequestMapping("/getDj")
    public ResultInfo getDj(String dj, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Xsd> list = xsdService.getDj(dj);
            return ResultInfo.success("获取成功", list);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }

    /**
     * 打印
     *
     * @return ResultInfo
     */
    @RequestMapping("/print")
    public ResultInfo print(@RequestBody HashMap map, HttpSession session, HttpServletResponse response) {
        try {
            GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
            List<Xsd> nlist = GsonUtil.toList(gsonUtil.get("list"), Xsd.class);
            List<Xsd> list = new ArrayList<>();
            if (nlist != null) {
                list = xsdService.getListByShdw(nlist.get(0).getShdw(), nlist.get(0).getDh(), nlist.get(0).getRiqi());
            }
            return ResultInfo.success("成功！", list);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("失败：{}", e.getMessage());
            return ResultInfo.error("失败！");
        }
    }

    @RequestMapping("/delete1")
    public ResultInfo delete1(HttpSession session,String dh) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        if (!userInfo.getCaozuoquanxian().equals("可修改")) {
            return ResultInfo.error(401, "无权限,请联系管理员");
        }
        try {
            xsdService.delete1(dh);
            return ResultInfo.success("删除成功", null);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("删除失败：{}", e.getMessage());
            return ResultInfo.error("删除失败");
        }
    }

}