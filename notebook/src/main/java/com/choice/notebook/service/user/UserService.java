package com.choice.notebook.service.user;

import com.choice.notebook.domain.User;

import java.util.List;

public interface UserService {
    int insert(User user);
    int delete(String userCode);
    int update(User user);
    List<User> query(String userCode, String userName, String roleCode);
    User getUserByCode(String userCode);
    List<User> getUserByRoleCode(String roleCode);
    List<User> getUsers();
}
