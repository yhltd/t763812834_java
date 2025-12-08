package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class FileCacheService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String CACHE_PREFIX = "pdf:cache:";
    private static final String META_PREFIX = "pdf:meta:";
    private static final long CACHE_TTL = 3600; // 1小时

    /**
     * 缓存PDF字节数据
     */
    public void cachePdfBytes(String ddh, byte[] pdfBytes) {
        try {
            String cacheKey = CACHE_PREFIX + ddh;
            redisTemplate.opsForValue().set(cacheKey, pdfBytes, CACHE_TTL, TimeUnit.SECONDS);
            log.info("PDF缓存成功: {}, 大小: {}", ddh, formatSize(pdfBytes.length));
        } catch (Exception e) {
            log.warn("PDF缓存失败: {}", ddh, e);
        }
    }

    /**
     * 获取缓存的PDF字节数据
     */
    public byte[] getCachedPdfBytes(String ddh) {
        try {
            String cacheKey = CACHE_PREFIX + ddh;
            Object cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached instanceof byte[]) {
                log.info("PDF缓存命中: {}", ddh);
                return (byte[]) cached;
            }
        } catch (Exception e) {
            log.warn("获取PDF缓存失败: {}", ddh, e);
        }
        return null;
    }

    /**
     * 缓存文件元数据
     */
    public void cacheFileMeta(String ddh, String fileName, long fileSize) {
        try {
            String metaKey = META_PREFIX + ddh;
            String metaData = fileName + "|" + fileSize;
            redisTemplate.opsForValue().set(metaKey, metaData, CACHE_TTL, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.warn("文件元数据缓存失败: {}", ddh, e);
        }
    }

    /**
     * 获取缓存的文件元数据
     */
    public String[] getCachedFileMeta(String ddh) {
        try {
            String metaKey = META_PREFIX + ddh;
            Object cached = redisTemplate.opsForValue().get(metaKey);
            if (cached instanceof String) {
                return ((String) cached).split("\\|");
            }
        } catch (Exception e) {
            log.warn("获取文件元数据缓存失败: {}", ddh, e);
        }
        return null;
    }

    /**
     * 删除缓存
     */
    public void deleteCache(String ddh) {
        try {
            String cacheKey = CACHE_PREFIX + ddh;
            String metaKey = META_PREFIX + ddh;
            redisTemplate.delete(cacheKey);
            redisTemplate.delete(metaKey);
            log.info("PDF缓存已删除: {}", ddh);
        } catch (Exception e) {
            log.warn("删除PDF缓存失败: {}", ddh, e);
        }
    }

    /**
     * 检查缓存是否存在
     */
    public boolean hasCache(String ddh) {
        try {
            String cacheKey = CACHE_PREFIX + ddh;
            return Boolean.TRUE.equals(redisTemplate.hasKey(cacheKey));
        } catch (Exception e) {
            return false;
        }
    }

    private String formatSize(long bytes) {
        if (bytes < 1024) {return bytes + "B";}
        if (bytes < 1024 * 1024){ return (bytes / 1024) + "KB";}
        return String.format("%.2fMB", bytes / (1024.0 * 1024.0));
    }
}