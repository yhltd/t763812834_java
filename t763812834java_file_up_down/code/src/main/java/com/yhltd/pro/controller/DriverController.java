package com.yhltd.pro.controller;


import com.yhltd.pro.util.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


/**
 * @author hui
 * @date 2022/11/29 18:46
 */
@Slf4j
@RestController
@RequestMapping("/file")
public class DriverController {

    /**
     * 上传图片名称匹配修改20240904
     *
     * @return ResultInfo
     */
    @PostMapping("/upload")
    public ResultInfo upload(HttpServletRequest request, @RequestParam("file") MultipartFile file) throws IOException {
        //获取原始名称
        long kongjian = Long.parseLong(request.getParameter("kongjian"));
        String thisPath = request.getParameter("path");
        String fileName = file.getOriginalFilename();
        String newFileName = request.getParameter("name");
        //文件保存路径
        String filePath = "C:/iis_jxc/sharepic_path" + thisPath;
        //文件重命名,防止重复
        filePath = filePath + newFileName;
        //文件对象
        File dest = new File(filePath);
        //判断路径是否存在,如果不存在则创建
        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdir();
        }
        try {
//            Path folder = Paths.get("D:/coach" + thisPath);
            Path folder = Paths.get("C:/iis_jxc/sharepic_path" + thisPath);
            long size = Files.walk(folder)
                    .filter(path -> path.toFile().isFile())
                    .mapToLong(path -> path.toFile().length())
                    .sum();
            size = size / 1073741824;
            if(size >= kongjian){
                return ResultInfo.success("存储空间不足", filePath);
            }else{
                //保存到服务器中
                file.transferTo(dest);
                return ResultInfo.success("上传成功", filePath);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }



    /**
     * 删除
     *
     * @return ResultInfo
     */
//    @RequestMapping("/delete")
//    public ResultInfo delete(HttpServletRequest request) throws IOException {
//        //获取原始名称
//        String orderNumber = request.getParameter("order_number");
//        String path = request.getParameter("path");
//        for (int i=1; i<=14; i++) {
//            String filepath = "";
//            if(i < 10){
//                filepath = "C:/iis_jxc/sharepic_path" + path + orderNumber + "-0" + i + ".jpg";
//            }else{
//                filepath = "C:/iis_jxc/sharepic_path" + path + orderNumber + "-" + i + ".jpg";
//            }
//            File dir = new File(filepath);
//            if(dir.isFile() && dir.exists()) {
//                dir.delete();
//            }
//        }
//        return ResultInfo.success("删除成功",orderNumber);
//    }
    @RequestMapping("/delete")
    public ResultInfo delete(HttpServletRequest request) throws IOException {
        //获取原始名称
        String orderNumber = request.getParameter("order_number");
        String path = request.getParameter("path");

        // 支持的文件扩展名列表
        String[] extensions = {"jpg", "jpeg", "png", "pdf", "gif", "bmp", "webp", "tiff", "doc", "docx", "xls", "xlsx", "zip", "rar"};

        // 遍历所有可能的文件编号和扩展名
        for (int i = 1; i <= 14; i++) {
            String fileNumber = (i < 10) ? "0" + i : String.valueOf(i);

            for (String ext : extensions) {
                String filepath = "C:/iis_jxc/sharepic_path" + path + orderNumber + "-" + fileNumber + "." + ext;
                File file = new File(filepath);

                if (file.isFile() && file.exists()) {
                    boolean deleted = file.delete();
                    System.out.println("删除文件 " + filepath + ": " + (deleted ? "成功" : "失败"));
                }
            }
        }

        return ResultInfo.success("删除成功", orderNumber);
    }



}
