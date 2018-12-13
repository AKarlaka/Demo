package com.choice.notebook.controller;

import com.choice.notebook.domain.Role;
import com.choice.notebook.domain.User;
import com.choice.notebook.service.role.RoleService;
import com.choice.notebook.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

/**
 * 角色管理
 * @author WK
 */
@Controller
@RequestMapping("/role")
public class RoleController {
    @Autowired
    RoleService roleService;

    @Autowired
    UserService userService;

    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public ModelAndView getRoles(ModelMap map){
        List<Role> list = roleService.getRoles();

        for (Role role : list) {
            System.out.println(role.toString());
        }
        map.addAttribute("roleInfos", list);
        return new ModelAndView("manager/roles",map);
    }
    @RequestMapping(value = "/edit", method = RequestMethod.GET)
    public ModelAndView roleEdit(ModelMap map, String roleCode){
        System.out.println("角色编码："+roleCode);

        Role roleInfo = roleService.getRoleByCode(roleCode);
        System.out.println(roleInfo);
        map.addAttribute("roleInfo", roleInfo);
        return new ModelAndView("manager/role_edit", map);
    }


    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public ModelAndView roleUpdate(ModelMap map, Role roleInfo){
        int iRet = roleService.update(roleInfo);
        if (iRet==1){
            System.out.println("更新成功！");
        }else {
            System.out.println("未更新！");
        }

        List<Role> list = roleService.getRoles();
        map.addAttribute("roleInfos", list);

        return new ModelAndView("manager/roles",map);
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public ModelAndView delete(ModelMap map, String roleCode){

        List<User> userList= userService.getUserByRoleCode(roleCode);
        if (null != userList){
            map.put("msg","该权限已分配给用户无法删除！");
            return new ModelAndView("common/error",map);
        }


        int iRet = roleService.delete(roleCode);
        if (iRet==1){
            System.out.println("删除["+roleCode+"]成功！");
        }else {
            System.out.println("删除["+roleCode+"]失败！");
        }
        //
        List<Role> roleList = roleService.getRoles();
        map.addAttribute("roleInfos", roleList);

        return new ModelAndView("manager/roles",map);
    }
}
