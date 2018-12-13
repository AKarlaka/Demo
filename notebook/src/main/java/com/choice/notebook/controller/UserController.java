package com.choice.notebook.controller;

import com.choice.notebook.domain.QueryItem;
import com.choice.notebook.domain.User;
import com.choice.notebook.mapper.QueryItemMapper;
import com.choice.notebook.service.user.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/user")
@Api(description = "用户控制器.",tags = "UserController")
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    QueryItemMapper queryItemMapper;

    @ResponseBody
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @ApiOperation(value="查询所有的用户信息", notes = "提示信息：")
    public ModelAndView getUsers(ModelMap map){
        //查询项目列表,用于构造查询项目
        List<QueryItem> itemList = queryItemMapper.getItemsByTableName("sys_user");
        map.addAttribute("itemList", itemList);

        System.out.println("访问用户管理界面.");

        //查询所有用户
        List list = userService.getUsers();
        map.addAttribute("userInfos",list);

        return new ModelAndView("manager/users", map);
    }

    @RequestMapping(value = "/query", method = RequestMethod.POST)
    @ApiOperation(value="查询用户信息", notes = "提示信息：")
    @ApiImplicitParams({
            @ApiImplicitParam(paramType = "query", name = "userCode", value = "用户编码", required = true, dataType = "String"),
            @ApiImplicitParam(paramType = "query", name = "userName", value = "用户名称", required = true, dataType = "String"),
            @ApiImplicitParam(paramType = "query", name = "roleCode", value = "权限编码", required = true, dataType = "String"),
    })
    public ModelAndView query(ModelMap map, String userCode, String userName, String roleCode){
        System.out.println(map);
        List<QueryItem> itemList = queryItemMapper.getItemsByTableName("sys_user");
        map.addAttribute("itemList", itemList);

        System.out.println("查询："+userCode+"、"+userName+"、"+roleCode);
        //拼接查询字符串？
        List<User> list = userService.query(userCode, userName, roleCode);
        System.out.println(list);
        map.addAttribute("userInfos",list);
        //
        return new ModelAndView("manager/users", map);
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ApiOperation(value="删除用户信息", notes = "提示信息：")
    @ApiImplicitParam(paramType = "query", name = "userCode", value = "用户编码", required = true, dataType = "String")
    public ModelAndView delete(String userCode){

        int iRet = userService.delete(userCode);
        if (iRet==1){
            System.out.println("删除["+userCode+"]成功！");
        }else {
            System.out.println("删除["+userCode+"]失败！");
        }
        return new ModelAndView("manager/users");
    }
}
