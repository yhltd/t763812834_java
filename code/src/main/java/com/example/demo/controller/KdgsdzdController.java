package com.example.demo.controller;

import com.example.demo.entity.Dskh;
import com.example.demo.entity.Kdgsdzd;
import com.example.demo.entity.UserInfo;
import com.example.demo.service.DskhService;
import com.example.demo.service.KdgsdzdService;
import com.example.demo.util.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.io.FileInputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/kdgsdzd")
public class KdgsdzdController {
    @Autowired
    private KdgsdzdService kdgsdzdService;

    /**
     * 查询所有
     *
     * @return ResultInfo
     */
    @RequestMapping("/getList")
    public ResultInfo getList(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Kdgsdzd> getList = kdgsdzdService.getList();
            return ResultInfo.success("获取成功", getList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }

//    @RequestMapping("/getDrList")
//    public ResultInfo getDrList(HttpSession session) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        try {
//            List<Kdgsdzd> getDrList = kdgsdzdService.getDrList();
//            return ResultInfo.success("获取成功", getDrList);
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("获取失败：{}", e.getMessage());
//            return ResultInfo.error("错误!");
//        }
//    }

    /**
     * 根据姓名和部门查询
     *
     * @return ResultInfo
     */
    @RequestMapping("/queryList")
    public ResultInfo queryList(String drkhmc,String drkddh, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Kdgsdzd> list = kdgsdzdService.queryList(drkhmc,drkddh);
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
        Kdgsdzd kdgsdzd = null;
        try {
            kdgsdzd = DecodeUtil.decodeToJson(updateJson, Kdgsdzd.class);
            if (kdgsdzdService.update(kdgsdzd)) {
                return ResultInfo.success("修改成功", kdgsdzd);
            } else {
                return ResultInfo.success("修改失败", kdgsdzd);
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
            Kdgsdzd kdgsdzd = GsonUtil.toEntity(gsonUtil.get("addInfo"), Kdgsdzd.class);
            kdgsdzd = kdgsdzdService.add(kdgsdzd);
            if (StringUtils.isNotNull(kdgsdzd)) {
                return ResultInfo.success("添加成功", kdgsdzd);
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
                kdgsdzdService.delete(Collections.singletonList(this_id));
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
     * 上传excel
     *
     * @param excel excel
     * @return ResultInfo
     */
    @PostMapping("/upload")
    public ResultInfo upload(String excel) {
//        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
//        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
//        List<Integer> idList = GsonUtil.toList(gsonUtil.get("idList"), Integer.class);
//        if(!userInfo.getCaozuoquanxian().equals("可修改")){
//            return ResultInfo.error(401, "无权限,请联系管理员");
//        }
        try {
            FileInputStream fis = new FileInputStream(StringUtils.base64ToFile(excel));
            Workbook wb = null;
            //创建2007版本Excel工作簿对象
            wb = new XSSFWorkbook(fis);
            //获取基本信息工作表
            Sheet sheet = wb.getSheet("返款");
            //循环Excel文件的i=1行开始
            for (int i = 2; i <= sheet.getLastRowNum(); i++) {
                Kdgsdzd kdgsdzd = new Kdgsdzd();
                //获取第i行
                Row row = sheet.getRow(i);
                //日期
                Cell jjrq = row.getCell(0);
                if (jjrq != null) {
                    jjrq.setCellType(CellType.STRING);
                    kdgsdzd.setJjrq(jjrq.getStringCellValue());
                }
                //客户名称
                Cell dh = row.getCell(1);
                if (dh != null) {
                    dh.setCellType(CellType.STRING);
                    kdgsdzd.setDh(dh.getStringCellValue());
                }
                //代收金额
                Cell sjgs = row.getCell(2);
                if (sjgs != null) {
                    sjgs.setCellType(CellType.STRING);
                    kdgsdzd.setSjgs(sjgs.getStringCellValue());
                }
                //快递单号
                Cell jshk = row.getCell(3);
                if (jshk != null) {
                    jshk.setCellType(CellType.STRING);
                    kdgsdzd.setJshk(jshk.getStringCellValue());
                }
                //快递费
                Cell fkrq = row.getCell(4);
                if (fkrq != null) {
                    fkrq.setCellType(CellType.STRING);
                    kdgsdzd.setFkrq(fkrq.getStringCellValue());
                }
                Cell fkfs = row.getCell(5);
                if (fkfs != null) {
                    fkfs.setCellType(CellType.STRING);
                    kdgsdzd.setFkrq(fkfs.getStringCellValue());
                }
                Cell khmc = row.getCell(6);
                if (khmc != null) {
                    khmc.setCellType(CellType.STRING);
                    kdgsdzd.setKhmc(khmc.getStringCellValue());
                }
                Cell qjy = row.getCell(7);
                if (qjy != null) {
                    qjy.setCellType(CellType.STRING);
                    kdgsdzd.setQjy(qjy.getStringCellValue());
                }

                //保存到数据库
                kdgsdzdService.add(kdgsdzd);
            }
            return ResultInfo.success("上传成功");
        } catch (Exception e) {
            e.printStackTrace();
            log.error("上传失败，请查看数据是否正确：{}", e.getMessage());
            log.error("参数：{}", excel);
            return ResultInfo.error("上传失败，请查看数据是否正确");
        }
    }

}