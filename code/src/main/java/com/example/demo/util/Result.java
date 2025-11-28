package com.example.demo.util;

import lombok.Data;

@Data
public class Result<T> {
    private boolean success;
    private Integer code;    // 新增：状态码
    private String message;
    private T data;

    // 成功方法 - 带数据
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setSuccess(true);
        result.setCode(200);  // 默认成功码
        result.setData(data);
        return result;
    }

    // 成功方法 - 不带数据
    public static <T> Result<T> success() {
        Result<T> result = new Result<>();
        result.setSuccess(true);
        result.setCode(200);  // 默认成功码
        result.setMessage("操作成功");
        return result;
    }

    // 错误方法 - 只带消息
    public static <T> Result<T> error(String message) {
        Result<T> result = new Result<>();
        result.setSuccess(false);
        result.setCode(500);  // 默认错误码
        result.setMessage(message);
        return result;
    }

    // 错误方法 - 带状态码和消息（新增）
    public static <T> Result<T> error(Integer code, String message) {
        Result<T> result = new Result<>();
        result.setSuccess(false);
        result.setCode(code);
        result.setMessage(message);
        return result;
    }

    // 判断是否成功的方法（可选）
    public boolean isSuccess() {
        return success;
    }

    // 获取状态码的方法（可选）
    public Integer getCode() {
        return code;
    }
}