package com.choice.notebook.service.user.impl;

import com.choice.notebook.domain.User;
import com.choice.notebook.mapper.UserMapper;
import com.choice.notebook.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author WK
 */
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserMapper userMapper;

    @Override
    public int insert(User user) {
        return 0;
    }

    @Override
    public int delete(String userCode) {
        return 0;
    }

    @Override
    public int update(User user) {
        return 0;
    }

    @Override
    public List<User> query(String userCode, String userName, String roleCode) {
        return userMapper.query(userCode, userName, roleCode);
    }

    @Override
    public User getUserByCode(String userCode) {
        return null;
    }

    @Override
    public List<User> getUserByRoleCode(String roleCode) {
        return userMapper.getUserByRoleCode(roleCode);
    }

    @Override
    public List<User> getUsers() {
        return userMapper.getUsers();
    }
}
