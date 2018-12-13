package com.choice.notebook.service.other;

import com.choice.notebook.domain.Role;
import com.choice.notebook.domain.User;

import java.util.List;

/**
 * @author WK
 */
public interface LoginService {
    /**
     * 判断是否用户密码是否与数据库一致
     * @param userCode 用户编码
     * @param userPwd 密码
     * @return 是否一致
     */
    Role isLogin(String userCode, String userPwd);
    List<User> getUsers();
}
