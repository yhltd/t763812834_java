package com.example.demo.util;

import java.net.URLDecoder;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * @author dai
 */
public class DecodeUtil {

    /**
     * 将Url编码后的json字符串解码并转实体类
     * @param json Url编码后的json字符串
     * @param tClass 要转的实体类的Class
     * @param <T> 实体类类型
     * @return 实体类
     * @throws Exception 异常
     */
    public static <T> T decodeToJson(String json,Class<T> tClass)
            throws Exception{
        json = URLDecoder.decode(json,"UTF-8").split("=")[1];
        return GsonUtil.toEntity(json,tClass);
    }

    /**
     * 将Url编码后的json字符串解码并转实体类
     * @param json Url编码后的json字符串
     * @param tClass 要转的实体类的Class
     * @param <T> 实体类类型
     * @param dateFiledNames 需要转换日期类型的字段数组
     * @return 实体类
     * @throws Exception 异常
     */
    public static <T> T decodeToJson(String json,Class<T> tClass,String... dateFiledNames)
            throws Exception{
        //获取Json主体
        json = URLDecoder.decode(json,"UTF-8").split("=")[1];
        //转map
        Map<String,Object> map = GsonUtil.toMap(json);
        for(String dateFiledName : dateFiledNames){
            //获取需要转换类型的值
            String dateValue = map.get(dateFiledName).toString();
            //获取Local对象
            LocalDateTime localDateTime = LocalDateTime.parse(dateValue);
            //替换map中的值
            map.remove(dateFiledName);
            map.put(dateFiledName,localDateTime);
        }
        //转json
        json = GsonUtil.toJson(map);
        //转实体类
        return GsonUtil.toEntity(json,tClass);
    }
}
