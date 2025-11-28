package com.example.demo.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class WebConfig implements WebMvcConfigurer {

    @Value("${pdf.upload.path}")
    private String uploadPath;

    @Value("${pdf.access.base-url}")
    private String accessBaseUrl;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 映射PDF文件访问路径
        registry.addResourceHandler(accessBaseUrl + "**")
                .addResourceLocations("file:" + uploadPath);
    }
}
