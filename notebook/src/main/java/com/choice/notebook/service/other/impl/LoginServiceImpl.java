package com.choice.notebook.service.other.impl;

import com.choice.notebook.domain.Role;
import com.choice.notebook.domain.User;
import com.choice.notebook.mapper.RoleMapper;
import com.choice.notebook.mapper.UserMapper;
import com.choice.notebook.service.other.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author WK
 */
@Service
public class LoginServiceImpl implements LoginService {

    /**
     * 操作数据库
     * 问：这个为什么显示红色下划线？
     */
    @Autowired
    UserMapper userMapper;

    @Autowired
    RoleMapper roleMapper;

    @Override
    public Role isLogin(String userCode, String userPwd) {
        System.out.println("调用实现接口."+userCode+"; userPwd:"+userPwd);
        //
        boolean bRet = false;
        Role role = null;

        //根据传入[用户编码]获取用户信息
        User userInfo = userMapper.getUserByCode(userCode);

        if (null == userInfo){
            System.out.println("用户名或密码错误！");
        }else{
            // 读取到信息后可使用其方法，否则使用toString方法的时候会报空指针错误
            System.out.println("读取："+userInfo.toString());
            //
            // 密码一致返回True(需要避免空指针问题)
            if (null==userPwd||"".equals(userPwd)){
                System.out.println("密码为空："+userInfo.getUserPwd());
                bRet = (null==userInfo.getUserPwd());
            }else{
                System.out.println("密码不为空："+userPwd);
                bRet = userPwd.equals(userInfo.getUserPwd());
            }
            // 密码正确，判断用户角色是否分配
            // 已分配：获取该角色信息
            if (bRet && null != userInfo.getRoleCode()){
                role = roleMapper.getRoleByCode(userInfo.getRoleCode());
            }
        }
        return role;
    }

    @Override
    public List<User> getUsers(){
        return userMapper.getUsers();
    }
}
