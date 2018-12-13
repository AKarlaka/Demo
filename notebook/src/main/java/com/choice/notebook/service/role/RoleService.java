package com.choice.notebook.service.role;

import com.choice.notebook.domain.Role;

import java.util.List;

public interface RoleService {
    int insert(Role role);
    int delete(String roleCode);
    int update(Role role);
    Role getRoleByCode(String roleCode);
    List<Role> getRoles();
}
