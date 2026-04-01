package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    private static final String CONFIG_FILE_NAME = "space_limit.txt";

    @GetMapping("/space-limit")
    public Map<String, Object> getSpaceLimit() {
        Map<String, Object> result = new HashMap<>();

        try {
            // 获取WAR包所在目录
            String warPath = getWarDirectory();
            File configFile = new File(warPath, CONFIG_FILE_NAME);

            if (configFile.exists() && configFile.isFile()) {
                // 读取文件内容
                String content = new String(Files.readAllBytes(configFile.toPath()), StandardCharsets.UTF_8);
                double limitGB = Double.parseDouble(content.trim());

                if (limitGB > 0) {
                    result.put("limit", limitGB);
                    result.put("success", true);
                    return result;
                }
            }

            // 文件不存在或内容无效，使用默认值
            result.put("limit", 5);
            result.put("success", true);
            result.put("message", "使用默认配置 5GB");

        } catch (Exception e) {
            result.put("success", false);
            result.put("limit", 5);
            result.put("message", "读取配置失败，使用默认值: " + e.getMessage());
        }

        return result;
    }

    /**
     * 获取WAR包所在目录
     */
    private String getWarDirectory() {
        try {
            String path = this.getClass().getProtectionDomain()
                    .getCodeSource()
                    .getLocation()
                    .toURI()
                    .getPath();

            // 如果是WAR文件，获取其父目录
            File warFile = new File(path);
            if (warFile.getName().endsWith(".war")) {
                return warFile.getParent();
            }

            // 开发环境，返回当前目录
            return System.getProperty("user.dir");

        } catch (Exception e) {
            return System.getProperty("user.dir");
        }
    }
}
