package com.choice.notebook.mapper;

import com.choice.notebook.domain.Role;
import com.choice.notebook.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 操作用户信息表
 * @author WK
 */
@Mapper
public interface UserMapper {
    /**
     * 插入数据
     * @param userInfo 用户信息
     * @return 插入记录id
     */
    int insert(@Param("userInfo") User userInfo);

    /**
     * 删除记录
     * @param userCode 用户信息
     * @return 删除记录id
     */
    int delete(@Param("userCode") String userCode);


    /**
     * 更新用户信息
     * @param userInfo 新用户信息
     * @return 是否成功
     */
    int update(@Param("userInfo") User userInfo);

    List<User> query(@Param("userCode") String userCode, @Param("userName") String userName, @Param("roleCode") String roleCode);

    /**
     * 通过编码获取用户信息
     * @param userCode  用户编码
     * @return 用户信息
     */
    User getUserByCode(@Param("userCode") String userCode);


    List<User> getUserByRoleCode(@Param("roleCode") String roleCode);
    /**
     * 查询全部用户
     * @return 用户集合
     */
    List<User> getUsers();
}
