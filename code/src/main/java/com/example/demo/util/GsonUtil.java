package com.example.demo.util;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author Eweee
 */
public class GsonUtil {

    private static final GsonUtil GSON_UTIL = new GsonUtil();
    /**
     * json操作对象
     */
    private static final Gson gson = new Gson();
    /**
     * 根据传入实例生成的jsonObject
     */
    private JsonObject jsonObject;
    /**
     * 传入json字符串
     */
    private String json;

    /**
     * 实例方法
     */
    public static GsonUtil getInstance() {
        return GSON_UTIL;
    }

    /**
     * 避免手动实例化
     */
    private GsonUtil() {
    }

    /**
     * 构造实例信息
     *
     * @param json json信息
     */
    public GsonUtil(String json) {
        this.json = json;
        JsonParser jsonParser = new JsonParser();
        JsonElement jsonElement = jsonParser.parse(json);
        this.jsonObject = jsonElement.getAsJsonObject();
    }

    /**
     * 将传入的list传换成JsonArray的形式返回
     *
     * @param list 传入要转换的数据集合
     * @return 转换成功的JsonArray字符串
     */
    public String toJsonArray(List<?> list) {
        return gson.toJson(list);
    }

    /**
     * 将传入的list传换成JsonArray的形式返回
     *
     * @param object 传入要转换的数据
     * @return 转换成功的JsonArray字符串
     */
    public String toJsonArray(Object object) {
        return gson.toJson(object);
    }

    /**
     * 将传入的对象传换成Json的形式返回
     *
     * @param object 传入要转换的数据
     * @return 转换成功的Json字符串
     */
    public static String toJson(Object object) {
        return new Gson().toJson(object);
    }

    /**
     * 将初始化的json信息返回
     *
     * @return 返回的json信息
     */
    public String toJson() {
        return gson.toJson(jsonObject);
    }

    /**
     * 将json转换成指定map类型，并返回
     *
     * @param <K> 不确定类型键
     * @param <V> 不确定类型值
     * @return 返回的map信息
     */
    public <K, V> Map<K, V> getAsMap() {
        return gson.fromJson(json, new TypeToken<Map<K, V>>() {
        }.getType());
    }

    /**
     * 将json转换成指定map类型，并返回
     *
     * @param <K>    不确定类型键
     * @param <V>    不确定类型值
     * @param object xx
     * @return 返回的map信息
     */
    public static <K, V> Map<K, V> toMap(Object object) {
        return gson.fromJson(gson.toJson(object), new TypeToken<Map<K, V>>() {
        }.getType());
    }

    /**
     * 将json转换成指定map类型，并返回
     *
     * @param <K>  不确定类型键
     * @param <V>  不确定类型值
     * @param json xx
     * @return 返回的map信息
     */
    public static <K, V> Map<K, V> toMap(String json) {
        return gson.fromJson(json, new TypeToken<Map<K, V>>() {
        }.getType());
    }

    /**
     * 将json转换成指定list类型，并返回
     *
     * @param json   xx
     * @param tClass 类名称
     * @param <T>    泛型
     * @return
     */
    public static <T> List<T> toList(String json, Class<T> tClass){
        List<T> list = new ArrayList<>();
        try{
            JsonArray array = new JsonParser().parse(json).getAsJsonArray();
            for (final JsonElement elem : array) {
                list.add(StringUtils.cast(toEntity(elem.toString(), tClass)));
            }
        }catch (Exception e){
            return null;
        }
        return list;
    }

    /**
     * 转换成指定类型的bean
     *
     * @param json   json字符串
     * @param tClass 类名称
     * @param <T>    泛型
     * @return 转换后对应实体
     */
    public static <T> T toEntity(String json, Class<T> tClass) {
        return gson.fromJson(json, tClass);
    }

    /**
     * 获取指定key信息
     *
     * @param key 键
     * @return json中取出返回值
     */
    public String get(String key) {
        return jsonObject.get(key).toString();
    }

    /**
     * 删除掉json中指定节点
     *
     * @param key 节点名称
     */
    public void remove(String key) {
        jsonObject.remove(key);
    }
}
