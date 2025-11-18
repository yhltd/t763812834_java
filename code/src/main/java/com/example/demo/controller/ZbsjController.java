package com.example.demo.controller;

import com.example.demo.entity.UserInfo;
import com.example.demo.entity.Zbsj;
import com.example.demo.service.ZbsjService;
import com.example.demo.util.GsonUtil;
import com.example.demo.util.ResultInfo;
import com.example.demo.util.SessionUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/zbsj")
public class ZbsjController {
    @Autowired
    private ZbsjService zbsjService;

    /**
     * 查询所有
     *
     * @return ResultInfo
     */
    @RequestMapping("/getList")
    public ResultInfo getList(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Zbsj> getList = zbsjService.getList();
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
            List<Zbsj> list = zbsjService.queryList(ksrq,jsrq);
            return ResultInfo.success("获取成功", list);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
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
                zbsjService.delete(Collections.singletonList(this_id));
            }
            return ResultInfo.success("删除成功", idList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("删除失败：{}", e.getMessage());
            log.error("参数：{}", idList);
            return ResultInfo.error("删除失败");
        }
    }

}