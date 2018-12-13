package com.choice.notebook.domain;

import lombok.Data;

import java.util.Date;

/**
 * 用户类
 * @author WK
 */
@Data
public class User {
    String userId;
    String userCode;
    String userName;
    String userPwd;
    String roleCode;
    Date createTime;
    Date updateTime;
}
