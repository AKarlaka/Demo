package com.choice.notebook.mapper;

import com.choice.notebook.domain.Role;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户角色DAO
 * @author WK
 */
@Mapper
public interface RoleMapper {
    /**
     * 插入新角色
     * @param roleInfo 新角色
     * @return 是否成功
     */
    int insert(@Param("roleInfo") Role roleInfo);

    /**
     * 删除角色
     * @param roleCode 需要删除的角色编码
     * @return 是否成功删除
     */
    int delete(@Param("roleCode") String roleCode);

    /**
     * 更新角色信息
     * @param roleInfo 新角色信息
     * @return 是否成功
     */
    int update(@Param("roleInfo") Role roleInfo);

    /**
     * 获取用户权限
     * @param roleCode：角色编码
     * @return 用户权限
     */
    Role getRoleByCode(@Param("roleCode") String roleCode);

    /**
     * 查看所有角色
     * @return 角色列表
     */
    List<Role> getRoles();
}
