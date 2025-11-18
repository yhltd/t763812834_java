//package com.example.demo.controller;
//
//import com.example.demo.entity.*;
//import com.example.demo.service.KhzlService;
//import com.example.demo.service.QhdService;
//import com.example.demo.service.ShdpService;
//import com.example.demo.service.XsdService;
//import com.example.demo.util.GsonUtil;
//import com.example.demo.util.ResultInfo;
//import com.example.demo.util.SessionUtil;
//import com.example.demo.util.StringUtils;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.RestController;
//
//import javax.servlet.http.HttpSession;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
///**
// * @author hui
// * @date 2024/8/8 9:38
// */
//@Slf4j
//@RestController
//@RequestMapping("/shdp")
//public class ShdpController {
//    @Autowired
//    private ShdpService shdpService;
//    @Autowired
//    private KhzlService khzlService;
//    @Autowired
//    private QhdService qhdService;
//    @Autowired
//    private XsdService xsdService;
//
//    @RequestMapping("/getList")
//    public ResultInfo getList(HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        try {
//            List<Shdp> getList = shdpService.getList();
//            return ResultInfo.success("获取成功", getList);
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("获取失败：{}", e.getMessage());
//            return ResultInfo.error("错误!");
//        }
//    }
//
//
//    @RequestMapping("/add")
//    public void add(HttpSession session, String riqi, String dh, String kddh, String shdwjjsr, String shdw, String sfyj, String fkfs, String sfhs, String sd, String zdr, String kdf,String bzld) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        zdr = userInfo.getName();
//        shdpService.add(riqi, dh, kddh, shdwjjsr, shdw, sfyj, fkfs, sfhs, sd, zdr, kdf,bzld);
//
//    }
//    @RequestMapping("/add1")
//    public void add1(HttpSession session,String riqi, String dh, String shdw, String mc, String mh, String gg, String js
//            , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
//                     String zdr, String shdwjjsr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
//                     String bzld, String hjzl) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        zdr = userInfo.getName();
//        shdpService.add1(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,
//                hsdj, sd, whsdj, hjje, bzld, hjzl);
//
//    }
//
//
//    //修改数据
//    @RequestMapping(value = "/update", method = RequestMethod.POST)
//    public ResultInfo update(HttpSession session, String riqi, String dh, String shdw, String mc, String mh, String gg, String js
//            , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
//                             String zdr, String shdwjjsr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
//                             String bzld, String hjzl, int id) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        shdw = shdpService.getshdw(id);
//        sd = shdpService.getsd(id);
//        kdf = shdpService.getkdf(id);
//        sfhs = shdpService.getsfhs(id);
//        fkfs = shdpService.getfkfs(id);
//        riqi = shdpService.getriqi(id);
//        dh = shdpService.getdh(id);
//        gd = khzlService.hqgd(shdw);
//        shdz = khzlService.hqdz(shdw);
//        kddh = shdpService.getkddh(id);
//        shdwjjsr = shdpService.getshdwjjsr(id);
//        sfyj = shdpService.getsfyj(id);
//        zdr = userInfo.getName();
//        bzld = shdpService.getbzld(id);
//        hjzl = zl;
//        System.out.println(bzld);
//        if (sfhs.equals("含税") || sfhs.equals("金额含税")) {
//            if (dj.equals("")) {
//                je = "0";
//                hsdj = "0";
//                whsdj = "0";
//                jgf = String.valueOf(Float.parseFloat(js) * 0.5);
//                hjje = String.valueOf((Float.parseFloat(je) + Float.parseFloat(jgf) + Float.parseFloat(kdf)) * Float.parseFloat(sd));
//            } else { hsdj = String.valueOf(Float.parseFloat(dj) * Float.parseFloat(sd));
//                whsdj = String.valueOf(Float.parseFloat(hsdj) / Float.parseFloat(sd));
//                je = String.valueOf(Float.parseFloat(zl) * Float.parseFloat(dj));
//                jgf = String.valueOf(Float.parseFloat(js) * 0.5);
//                hjje = String.valueOf(Float.parseFloat(je) + Float.parseFloat(jgf) + Float.parseFloat(kdf));
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
//
//
//    Shdp shdp = new Shdp();
//
//        shdp.setWhsdj(whsdj);
//        shdp.setHjje(hjje);
//        shdp.setJe(je);
//        shdp.setJgf(jgf);
//        shdp.setHsdj(hsdj);
//
//
//        try
//
//    {
//        if (userInfo.getPower().equals("管理员")) {
//            if (mc.equals("换铜块")) {
//                int jzl = Integer.parseInt(zl);
//                int yzl = Integer.parseInt(khzlService.gettkkc(shdw));
//                int xzl = yzl - jzl;
//                String tkkc = Integer.toString(xzl);
//                khzlService.tkkc(tkkc, shdw);
//                shdpService.update(mc, mh, gg, js, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);
//
//
//                if (fkfs.equals("签回单")) {
//                    boolean list = qhdService.add1(riqi, shdw, hjje, bz, dh);
//                    shdpService.update(mc, mh, gg, js, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);
//
//                    return ResultInfo.success("添加成功", null);
//                }
//                xsdService.add(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,
//                        hsdj, sd, whsdj, hjje, bzld, hjzl);
//            } else if (mc.equals("换铜渣")) {
//
//                int jzl = Integer.parseInt(zl);
//                int yzl = Integer.parseInt(khzlService.gettzkc(shdw));
//                int xzl = yzl - jzl;
//                String tzkc = Integer.toString(xzl);
//                khzlService.tzkc(tzkc, shdw);
//
//                shdpService.update(mc, mh, gg, js, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);
//                if (fkfs.equals("签回单")) {
//                    qhdService.add1(riqi, shdw, hjje, bz, dh);
//                    shdpService.update(mc, mh, gg, js, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);
//
//                }
//                xsdService.add(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,
//                        hsdj, sd, whsdj, hjje, bzld, hjzl);
//                return ResultInfo.success("添加成功", null);
//            } else if (dj.equals("")) {
//                if (mc.equals("回收铜块")) {
//                    int jzl = Integer.parseInt(zl);
//                    int yzl = Integer.parseInt(khzlService.gettkkc(shdw));
//                    int xzl = yzl + jzl;
//                    String tkkc = Integer.toString(xzl);
//                    khzlService.tkkc(tkkc, shdw);
//
//                    shdpService.update(mc, mh, gg, js, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);
//                    if (fkfs.equals("签回单")) {
//                        qhdService.add1(riqi, shdw, hjje, bz, dh);
//                        shdpService.update(mc, mh, gg, js, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);
//
//                        return ResultInfo.success("添加成功", null);
//                    }
//                    xsdService.add(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,
//                            hsdj, sd, whsdj, hjje, bzld, hjzl);
//                } else if (mc.equals("回收铜渣")) {
//                    int jzl = Integer.parseInt(zl);
//                    int yzl = Integer.parseInt(khzlService.gettzkc(shdw));
//                    int xzl = yzl + jzl;
//                    String tzkc = Integer.toString(xzl);
//                    khzlService.tzkc(tzkc, shdw);
//
//                    shdpService.update(mc, mh, gg, js, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);
//                    if (fkfs.equals("签回单")) {
//                        qhdService.add1(riqi, shdw, hjje, bz, dh);
//
//                        shdpService.update(mc, mh, gg, js, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);
//                        return ResultInfo.success("添加成功", null);
//                    }
//                    xsdService.add(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,
//                            hsdj, sd, whsdj, hjje, bzld, hjzl);
//                }
//            } else {
//                if (fkfs.equals("签回单")) {
//                    qhdService.add1(riqi, shdw, hjje, bz, dh);
//                    xsdService.add(riqi, dh, shdw, mc, mh, gg, js, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, shdwjjsr, jgf, kdf,
//                            hsdj, sd, whsdj, hjje, bzld, hjzl);
//                    shdpService.update(mc, mh, gg, js, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);
//                    return ResultInfo.success("添加成功", null);
//                }
//            }
//        }
//        if (shdpService.update(mc, mh, gg, js, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id)) {
//            return ResultInfo.success("修改成功", riqi);
//        } else {
//            return ResultInfo.success("修改失败", riqi);
//        }
//    } catch(
//    Exception e)
//
//    {
//        e.printStackTrace();
//        log.error("修改失败：{}", e.getMessage());
//        return ResultInfo.error("修改失败");
//    }
//
//}
//
//
//
//
//
//    //修改数据
//    @RequestMapping(value = "/add4", method = RequestMethod.POST)
//    public ResultInfo add4(HttpSession session, String riqi, String dh, String shdw, String mc, String mh, String gg, String js
//            , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
//                             String zdr, String shdwjjsr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
//                             String bzld, String hjzl) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
////        shdw = shdpService.getshdw(id);
////        sd = shdpService.getsd(id);
////        kdf = shdpService.getkdf(id);
////        sfhs = shdpService.getsfhs(id);
////        fkfs = shdpService.getfkfs(id);
////        riqi = shdpService.getriqi(id);
////        dh = shdpService.getdh(id);
//        gd = khzlService.hqgd(shdw);
//        shdz = khzlService.hqdz(shdw);
////        kddh = shdpService.getkddh(id);
////        shdwjjsr = shdpService.getshdwjjsr(id);
////        sfyj = shdpService.getsfyj(id);
//        zdr = userInfo.getName();
////        bzld = shdpService.getbzld(id);
//        hjzl = zl;
//        System.out.println(bzld);
//        if (sfhs.equals("含税") || sfhs.equals("金额含税")) {
//            if (dj.equals("")) {
//                je = "0";
//                hsdj = "0";
//                whsdj = "0";
//                jgf = String.valueOf(Float.parseFloat(js) * 0.5);
//                hjje = String.valueOf((Float.parseFloat(je) + Float.parseFloat(jgf) + Float.parseFloat(kdf)) * Float.parseFloat(sd));
//            } else { hsdj = String.valueOf(Float.parseFloat(dj) * Float.parseFloat(sd));
//                whsdj = String.valueOf(Float.parseFloat(hsdj) / Float.parseFloat(sd));
//                je = String.valueOf(Float.parseFloat(zl) * Float.parseFloat(dj));
//                jgf = String.valueOf(Float.parseFloat(js) * 0.5);
//                hjje = String.valueOf(Float.parseFloat(je) + Float.parseFloat(jgf) + Float.parseFloat(kdf));
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
//
//
//        Shdp shdp = new Shdp();
//        shdp.setWhsdj(whsdj);
//        shdp.setHjje(hjje);
//        shdp.setJe(je);
//        shdp.setJgf(jgf);
//        shdp.setHsdj(hsdj);
//
//
//        try
//
//        {
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
//                hsdj, sd, whsdj, hjje, bzld, hjzl)) {
//                return ResultInfo.success("修改成功", riqi);
//            } else {
//                return ResultInfo.success("修改失败", riqi);
//            }
//        } catch(
//                Exception e)
//
//        {
//            e.printStackTrace();
//            log.error("修改失败：{}", e.getMessage());
//            return ResultInfo.error("修改失败");
//        }
//
//    }
//
//
//
//
//    @RequestMapping("/delete")
//    public void delete() {
//        shdpService.delete();
//    }
//
//
//}
package com.example.demo.controller;

import com.example.demo.entity.Shdp;
import com.example.demo.entity.UserInfo;
import com.example.demo.service.*;
import com.example.demo.util.GsonUtil;
import com.example.demo.util.ResultInfo;
import com.example.demo.util.SessionUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * @author hui
 * @date 2024/8/8 9:38
 */
@Slf4j
@RestController
@RequestMapping("/shdp")
public class ShdpController {
    @Autowired
    private ShdpService shdpService;
    @Autowired
    private KhzlService khzlService;
    @Autowired
    private QhdService qhdService;
    @Autowired
    private XsdService xsdService;
    @Autowired
    private MxService mxService;

    @RequestMapping("/getList")
    public ResultInfo getList(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Shdp> getList = shdpService.getList();
            return ResultInfo.success("获取成功", getList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }

    @RequestMapping("/add")
    public void add(HttpSession session, String riqi, String dh, String kddh, String shdw, String sfyj, String fkfs, String sfhs, String sd, String zdr, String kdf, String bzld) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        zdr = userInfo.getName();
        shdpService.add(riqi, dh, kddh, shdw, sfyj, fkfs, sfhs, sd, zdr, kdf, bzld);
    }

    @RequestMapping("/add1")
    public void add1(HttpSession session, String riqi, String dh, String shdw, String mc, String mh, String gg, String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
                     String zdr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
                     String bzld, String hjzl) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        zdr = userInfo.getName();
        shdpService.add1(riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf,
                hsdj, sd, whsdj, hjje, bzld, hjzl);
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public void update(HttpSession session, String riqi, String dh, String shdw, String mc, String mh, String gg
            , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
                             String zdr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
                             String bzld, String hjzl, String fuzhu, String ysje, String zys, int id) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        String js="";
        String ziduan="出库";

        shdw = shdpService.getshdw(id);
        sd = shdpService.getsd(id);
        kdf = shdpService.getkdf(id);
        sfhs = shdpService.getsfhs(id);
        fkfs = shdpService.getfkfs(id);
        riqi = shdpService.getriqi(id);
        dh = shdpService.getdh(id);
        gd = khzlService.hqgd(shdw);
        shdz = khzlService.hqdz(shdw);
        kddh = shdpService.getkddh(id);
        sfyj = shdpService.getsfyj(id);
        zdr = userInfo.getName();
        bzld = shdpService.getbzld(id);
        hjzl = zl;
        ysje = khzlService.getysje(shdw);
        String danhao = dh;
        if (ysje.equals("")) {
            ysje = "0";
        }
        if (sfhs.equals("含税") || sfhs.equals("金额含税")) {
            if (dj.equals("")) {
                je = "0";
                hsdj = "0";
                whsdj = "0";
//                jgf = String.valueOf(Float.parseFloat(js) * 0.5);
//                hjje = String.valueOf((Float.parseFloat(je) + Float.parseFloat(jgf) + Float.parseFloat(kdf)) * Float.parseFloat(sd));
                hjje = String.valueOf((Float.parseFloat(je) + Float.parseFloat(kdf)) * Float.parseFloat(sd));
            } else {
                hsdj = String.valueOf(Float.parseFloat(dj) * Float.parseFloat(sd));
                whsdj = String.valueOf(Float.parseFloat(hsdj) / Float.parseFloat(sd));
                je = String.valueOf(Float.parseFloat(zl) * Float.parseFloat(dj));
//                jgf = String.valueOf(Float.parseFloat(js) * 0.5);
//                hjje = String.valueOf(Float.parseFloat(je) + Float.parseFloat(jgf) + Float.parseFloat(kdf));
                hjje = String.valueOf(Float.parseFloat(je) + Float.parseFloat(kdf));
            }
        } else {
            if (dj.equals("")) {
                je = "0";
                hsdj = "0";
                whsdj = "0";
            } else {
                hsdj = "0";
                whsdj = "0";
                je = String.valueOf(Float.parseFloat(zl) * Float.parseFloat(dj));
//                jgf = String.valueOf(Float.parseFloat(js) * 0.5);
//                hjje = String.valueOf((Float.parseFloat(je) + Float.parseFloat(jgf) + Float.parseFloat(kdf)));
                hjje = String.valueOf((Float.parseFloat(je) + Float.parseFloat(kdf)));
            }
        }
//        Shdp shdp = new Shdp();
//        shdp.setWhsdj(whsdj);
//        shdp.setHjje(hjje);
//        System.out.println("-----------------------");
//        System.out.println(shdp.getHjje());
//        shdp.setJe(je);
        jgf = "0";
//        shdp.setHsdj(hsdj);
//        try {
            System.out.println(userInfo.getPower());
            if (userInfo.getPower().equals("管理员")) {
                if (mc.equals("换铜块")) {
                    int jzl = Integer.parseInt(zl);
                    int yzl = Integer.parseInt(khzlService.gettkkc(shdw));
                    int xzl = yzl - jzl;
                    String tkkc = Integer.toString(xzl);
                    khzlService.tkkc(tkkc, shdw);
                    shdpService.update(mc, mh, gg, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);
                    xsdService.add(riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf,
                            hsdj, sd, whsdj, hjje, bzld, hjzl);
                    mxService.add1(mc,js,zl,je,ziduan,danhao);
//                        float Ysje = Float.parseFloat(ysje);
//                        float Hjje = Float.parseFloat(hjje);
//                        float Zys =Ysje+Hjje;
//                        zys = Float.toString(Zys);
//                        System.out.println(zys);
//                        shdpService.update(mc, mh, gg, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);


                } else if (mc.equals("换铜渣")) {
                    int jzl = Integer.parseInt(zl);
                    int yzl = Integer.parseInt(khzlService.gettzkc(shdw));
                    int xzl = yzl - jzl;
                    String tzkc = Integer.toString(xzl);
                    khzlService.tzkc(tzkc, shdw);
                    shdpService.update(mc, mh, gg, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);
                    xsdService.add(riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf,
                            hsdj, sd, whsdj, hjje, bzld, hjzl);
                    mxService.add1(mc,js,zl,je,ziduan,danhao);
//                        float Ysje = Float.parseFloat(ysje);
//                        float Hjje = Float.parseFloat(hjje);
//                        float Zys =Ysje+Hjje;
//                        zys = Float.toString(Zys);
//                        boolean list = qhdService.add1(riqi, shdw, hjje, bz, dh,zys);
//                        khzlService.upysje(zys,shdw);
//                        shdpService.update(mc, mh, gg, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);

                } else if (dj.equals("")) {
                    if (mc.equals("回收铜块")) {
                        int jzl = Integer.parseInt(zl);
                        int yzl = Integer.parseInt(khzlService.gettkkc(shdw));
                        int xzl = yzl + jzl;
                        String tkkc = Integer.toString(xzl);
                        khzlService.tkkc(tkkc, shdw);

                        shdpService.update(mc, mh, gg, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);
                        xsdService.add(riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf,
                                hsdj, sd, whsdj, hjje, bzld, hjzl);
                        mxService.add1(mc,js,zl,je,ziduan,danhao);
//                            float Ysje = Float.parseFloat(ysje);
//                            float Hjje = Float.parseFloat(hjje);
//                            float Zys =Ysje+Hjje;
//                            zys = Float.toString(Zys);
//
//                            khzlService.upysje(zys,shdw);
//                            shdpService.update(mc, mh, gg, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);


                    } else if (mc.equals("回收铜渣")) {
                        int jzl = Integer.parseInt(zl);
                        int yzl = Integer.parseInt(khzlService.gettzkc(shdw));
                        int xzl = yzl + jzl;
                        String tzkc = Integer.toString(xzl);
                        khzlService.tzkc(tzkc, shdw);
                        shdpService.update(mc, mh, gg, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);
                        xsdService.add(riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf,
                                hsdj, sd, whsdj, hjje, bzld, hjzl);
                        mxService.add1(mc,js,zl,je,ziduan,danhao);
//                            float Ysje = Float.parseFloat(ysje);
//                            float Hjje = Float.parseFloat(hjje);
//                            float Zys =Ysje+Hjje;
//                            zys = Float.toString(Zys);
//
//                            khzlService.upysje(zys,shdw);
//                            shdpService.update(mc, mh, gg, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);
                    }
                } else {
//                        float Ysje = Float.parseFloat(ysje);
//                        float Hjje = Float.parseFloat(hjje);
//                        float Zys =Ysje+Hjje;
//                        zys = Float.toString(Zys);
//                        khzlService.upysje(zys,shdw);
//                        System.out.println(zys);
                    shdpService.update(mc, mh, gg, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id);
                    xsdService.add(riqi, dh, shdw, mc, mh, gg, zl, dj, je, bz, shdz, kddh, sfyj, fkfs, sfhs, gd, zdr, jgf, kdf,
                            hsdj, sd, whsdj, hjje, bzld, hjzl);
                    mxService.add1(mc,js,zl,je,ziduan,danhao);
                }
            }
//            if (shdpService.update(mc, mh, gg, zl, dj, je, bz, shdz, gd, jgf, hsdj, whsdj, hjje, hjzl, id)) {
//                return ResultInfo.success("修改成功", riqi);
//            } else {
//                return ResultInfo.success("修改失败", riqi);
//            }
//
//        } catch (
//                Exception e) {
//            e.printStackTrace();
//            log.error("修改失败：{}", e.getMessage());
//            return ResultInfo.error("修改失败");
//        }

    }


//    //修改数据
//    @RequestMapping(value = "/add4", method = RequestMethod.POST)
//    public ResultInfo add4(HttpSession session, String riqi, String dh, String shdw, String mc, String mh, String gg
//            , String zl, String dj, String je, String bz, String shdz, String kddh, String sfyj, String fkfs, String sfhs, String gd,
//                           String zdr, String jgf, String kdf, String hsdj, String sd, String whsdj, String hjje,
//                           String bzld, String hjzl) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
////        shdw = shdpService.getshdw(id);
////        sd = shdpService.getsd(id);
////        kdf = shdpService.getkdf(id);
////        sfhs = shdpService.getsfhs(id);
////        fkfs = shdpService.getfkfs(id);
////        riqi = shdpService.getriqi(id);
////        dh = shdpService.getdh(id);
//        gd = khzlService.hqgd(shdw);
//        shdz = khzlService.hqdz(shdw);
////        kddh = shdpService.getkddh(id);
////        shdwjjsr = shdpService.getshdwjjsr(id);
////        sfyj = shdpService.getsfyj(id);
//        zdr = userInfo.getName();
////        bzld = shdpService.getbzld(id);
//        hjzl = zl;
//        if (sfhs.equals("含税") || sfhs.equals("金额含税")) {
//            if (dj.equals("")) {
//                je = "0";
//                hsdj = "0";
//                whsdj = "0";
////                jgf = String.valueOf(Float.parseFloat(js) * 0.5);
////                hjje = String.valueOf((Float.parseFloat(je) + Float.parseFloat(jgf) + Float.parseFloat(kdf)) * Float.parseFloat(sd));
//                hjje = String.valueOf((Float.parseFloat(je) + Float.parseFloat(kdf)) * Float.parseFloat(sd));
//            } else {
//                hsdj = String.valueOf(Float.parseFloat(dj) * Float.parseFloat(sd));
//                whsdj = String.valueOf(Float.parseFloat(hsdj) / Float.parseFloat(sd));
//                je = String.valueOf(Float.parseFloat(zl) * Float.parseFloat(dj));
////                jgf = String.valueOf(Float.parseFloat(js) * 0.5);
////                hjje = String.valueOf(Float.parseFloat(je) + Float.parseFloat(jgf) + Float.parseFloat(kdf));
//                hjje = String.valueOf(Float.parseFloat(je) + Float.parseFloat(kdf));
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
//                hjje = String.valueOf((Float.parseFloat(je) + Float.parseFloat(kdf)) * Float.parseFloat(sd));
//            }
//        }
//
//        Shdp shdp = new Shdp();
//        shdp.setWhsdj(whsdj);
//        shdp.setHjje(hjje);
//        shdp.setJe(je);
//        shdp.setJgf(jgf);
//        shdp.setHsdj(hsdj);
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
//
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
//        } catch (
//                Exception e) {
//            e.printStackTrace();
//            log.error("修改失败：{}", e.getMessage());
//            return ResultInfo.error("修改失败");
//        }
//
//    }


    @RequestMapping("/delete")
    public void delete() {
        shdpService.delete();
    }


}