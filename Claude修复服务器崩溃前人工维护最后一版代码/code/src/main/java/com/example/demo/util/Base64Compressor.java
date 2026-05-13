package com.example.demo.util;

import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;
import org.xerial.snappy.Snappy;
import java.util.Base64;
import java.util.zip.GZIPOutputStream;
import java.util.zip.GZIPInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;

@Component
@Slf4j
public class Base64Compressor {

    // 压缩算法类型
    private static final String GZIP_PREFIX = "GZIP:";
    private static final String SNAPPY_PREFIX = "SNAPPY:";

    // 压缩阈值：超过100KB启用压缩
    private static final int COMPRESS_THRESHOLD = 100 * 1024;

    /**
     * 智能压缩Base64数据
     */
    public String compressBase64(String originalBase64) {
        if (originalBase64 == null || originalBase64.length() < COMPRESS_THRESHOLD) {
            // 小文件不压缩
            return originalBase64;
        }

        try {
            // 解码为字节数组
            byte[] originalBytes = Base64.getDecoder().decode(originalBase64);

            // 根据文件类型选择压缩算法
            String compressedData;
            if (isPdfFile(originalBytes)) {
                // PDF文件使用Snappy压缩（速度快）
                compressedData = SNAPPY_PREFIX + compressWithSnappy(originalBytes);
            } else {
                // 其他文件使用GZIP压缩（压缩率高）
                compressedData = GZIP_PREFIX + compressWithGzip(originalBytes);
            }

            int originalSize = originalBase64.length();
            int compressedSize = compressedData.length();
            double ratio = (1.0 - (double) compressedSize / originalSize) * 100;

            log.info("Base64压缩完成: {} -> {} (压缩率: {}%)",
                    formatSize(originalSize), formatSize(compressedSize),
                    String.format("%.2f", ratio));

            return compressedData;

        } catch (Exception e) {
            log.warn("Base64压缩失败，返回原始数据", e);
            return originalBase64;
        }
    }

    /**
     * 智能解压Base64数据
     */
    public String decompressBase64(String compressedBase64) {
        if (compressedBase64 == null) {
            return null;
        }

        try {
            if (compressedBase64.startsWith(GZIP_PREFIX)) {
                String base64Data = compressedBase64.substring(GZIP_PREFIX.length());
                byte[] compressedBytes = Base64.getDecoder().decode(base64Data);
                byte[] originalBytes = decompressGzip(compressedBytes);
                return Base64.getEncoder().encodeToString(originalBytes);

            } else if (compressedBase64.startsWith(SNAPPY_PREFIX)) {
                String base64Data = compressedBase64.substring(SNAPPY_PREFIX.length());
                byte[] compressedBytes = Base64.getDecoder().decode(base64Data);
                byte[] originalBytes = Snappy.uncompress(compressedBytes);
                return Base64.getEncoder().encodeToString(originalBytes);

            } else {
                // 未压缩的数据
                return compressedBase64;
            }

        } catch (Exception e) {
            log.warn("Base64解压失败，返回原始数据", e);
            return compressedBase64;
        }
    }

    /**
     * 使用Snappy压缩（速度快，适合PDF）
     */
    private String compressWithSnappy(byte[] data) throws IOException {
        byte[] compressed = Snappy.compress(data);
        return Base64.getEncoder().encodeToString(compressed);
    }

    /**
     * 使用GZIP压缩（压缩率高）
     */
    private String compressWithGzip(byte[] data) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (GZIPOutputStream gzip = new GZIPOutputStream(baos)) {
            gzip.write(data);
        }
        byte[] compressed = baos.toByteArray();
        return Base64.getEncoder().encodeToString(compressed);
    }

    /**
     * GZIP解压
     */
    private byte[] decompressGzip(byte[] compressed) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (GZIPInputStream gzip = new GZIPInputStream(new ByteArrayInputStream(compressed))) {
            byte[] buffer = new byte[8192];
            int len;
            while ((len = gzip.read(buffer)) > 0) {
                baos.write(buffer, 0, len);
            }
        }
        return baos.toByteArray();
    }

    /**
     * 检查是否为PDF文件
     */
    private boolean isPdfFile(byte[] data) {
        if (data.length < 5){return false;}
        return data[0] == 0x25 && data[1] == 0x50 && data[2] == 0x44 && data[3] == 0x46;
    }

    private String formatSize(int bytes) {
        if (bytes < 1024){ return bytes + "B";}
        if (bytes < 1024 * 1024){ return (bytes / 1024) + "KB";}
        return String.format("%.2fMB", bytes / (1024.0 * 1024.0));
    }
}