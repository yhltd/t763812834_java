package com.example.demo.controller;

import com.example.demo.entity.Grxx;
import com.example.demo.entity.UserInfo;
import com.example.demo.service.GrxxService;
import com.example.demo.util.GsonUtil;
import com.example.demo.util.ResultInfo;
import com.example.demo.util.SessionUtil;
import com.example.demo.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;



@Slf4j
@RestController
@RequestMapping("/grxx")
public class GrxxController {
    @Autowired
    private GrxxService grxxService;

    /**
     * 查询所有
     *
     * @return ResultInfo
     */
    @RequestMapping("/queryList")
    public ResultInfo queryList(HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);
        try {
            List<Grxx> list = grxxService.queryList(userInfo.getName());
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
    public ResultInfo update(int id, String username, String phone, String name, String nc, String yx, String address, String xl, String byyx, String xb, String sr, String qm, String password, HttpSession session) {
        UserInfo userInfo = GsonUtil.toEntity(SessionUtil.getToken(session), UserInfo.class);

        Grxx grxx = new Grxx();
        grxx.setId(id);
        grxx.setUsername(username);
        grxx.setPhone(phone);
        grxx.setName(name);
        grxx.setNc(nc);
        grxx.setYx(yx);
        grxx.setAddress(address);
        grxx.setXl(xl);
        grxx.setByyx(byyx);
        grxx.setXb(xb);
        grxx.setSr(sr);
        grxx.setQm(qm);
        grxx.setPassword(password);

        try {
            if (grxxService.update(grxx)) {
                return ResultInfo.success("修改成功", grxx);
            } else {
                return ResultInfo.success("修改失败", grxx);
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
//        if(!userInfo.getPower().equals("管理员")){
//            return ResultInfo.error(401, "无权限");
//        }
        try {
            Grxx Grxx = GsonUtil.toEntity(gsonUtil.get("addInfo"), Grxx.class);
            Grxx = grxxService.add(Grxx);
            if (StringUtils.isNotNull(Grxx)) {
                return ResultInfo.success("添加成功", Grxx);
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

}