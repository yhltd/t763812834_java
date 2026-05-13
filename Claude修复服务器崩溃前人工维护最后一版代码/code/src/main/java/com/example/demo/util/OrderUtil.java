package com.example.demo.util;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

/**
 * @author dai
 */
public class OrderUtil {

    /**
     * 生成订单号
     * @param prefixStr 要拼接的前缀
     * @return
     */
    public static String getOrder(String prefixStr) {
        //拼接前缀
        StringBuffer stringBuffer = new StringBuffer(prefixStr);
        //时间戳
        Long stamp = LocalDateTime.now().toInstant(ZoneOffset.of("+8")).toEpochMilli();
        //拼接return
        return stringBuffer.append(stamp).toString();
    }
}
