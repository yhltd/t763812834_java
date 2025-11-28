package com.example.demo.util;

import javax.servlet.http.HttpSession;

public class AuthUtil {

    /**
     * 检查用户是否登录且有管理员权限
     */
    public static Result<?> checkAdminAuth(HttpSession session) {
        // 1. 检查 token
        if (!SessionUtil.checkToken(session)) {
            return Result.error(401, "请重新登录");
        }

        // 2. 获取权限信息
        String cValue = SessionUtil.getC(session);

        // 3. 只有超级管理员有权限
        if (!"超级管理员".equals(cValue)) {
            return Result.error(403, "权限不足");
        }

        return Result.success("权限验证通过");
    }

    /**
     * 检查用户是否登录（不检查具体权限）
     */
    public static Result<?> checkLogin(HttpSession session) {
        if (!SessionUtil.checkToken(session)) {
            return Result.error(401, "请重新登录");
        }
        return Result.success("已登录");
    }

}
