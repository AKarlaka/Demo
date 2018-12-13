package com.choice.notebook.domain;

import lombok.Data;

/**
 * 角色类
 * 不同角色有不同权限
 * @author WK
 */
@Data
public class Role {
    int roleId;
    String roleCode;
    String roleName;
    boolean funView;
    boolean funDelete;
    boolean funEdit;
}
