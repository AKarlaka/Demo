package com.choice.notebook.service.role.impl;

import com.choice.notebook.domain.Role;
import com.choice.notebook.mapper.RoleMapper;
import com.choice.notebook.service.role.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    RoleMapper roleMapper;

    @Override
    public int insert(Role role) {
        return 0;
    }

    @Override
    public int delete(String roleCode) {
        return roleMapper.delete(roleCode);
    }

    @Override
    public int update(Role role) {
        return roleMapper.update(role);
    }

    @Override
    public Role getRoleByCode(String roleCode) {
        return roleMapper.getRoleByCode(roleCode);
    }

    @Override
    public List<Role> getRoles() {
        return roleMapper.getRoles();
    }
}
