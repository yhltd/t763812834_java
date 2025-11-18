package com.example.demo.controller;

import com.example.demo.entity.FileTable;
import com.example.demo.service.FileTableService;
import com.example.demo.util.GsonUtil;
import com.example.demo.util.ResultInfo;
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
@RequestMapping("/filetable")
public class FileTableController {
    @Autowired
    FileTableService fileTableService;

    /**
     * 添加
     */
    @RequestMapping("/add")
    public ResultInfo add(@RequestBody HashMap map, HttpSession session) {
        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
        try {
            FileTable fileTable = GsonUtil.toEntity(gsonUtil.get("addInfo"), FileTable.class);
            fileTable = fileTableService.add(fileTable);
            if (StringUtils.isNotNull(fileTable)) {
                return ResultInfo.success("添加成功", fileTable);
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
     * 下载文件
     *
     * @return ResultInfo
     */
    @RequestMapping("/getFile")
    public ResultInfo getFile(int glid, HttpSession session) {
        try {
            List<FileTable> getList = fileTableService.getFile(glid);
            return ResultInfo.success("获取成功", getList);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("获取失败：{}", e.getMessage());
            return ResultInfo.error("错误!");
        }
    }

    /**
     * 删除
     *
     * @return ResultInfo
     */
    @RequestMapping("/delete")
    public ResultInfo delete(@RequestBody HashMap map, HttpSession session) {
        GsonUtil gsonUtil = new GsonUtil(GsonUtil.toJson(map));
        List<Integer> idList = GsonUtil.toList(gsonUtil.get("idList"), Integer.class);
        try {
            if (fileTableService.delete(idList)) {
                return ResultInfo.success("删除成功", idList);
            } else {
                return ResultInfo.success("删除失败", idList);
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("删除失败：{}", e.getMessage());
            log.error("参数：{}", idList);
            return ResultInfo.error("删除失败");
        }
    }

}