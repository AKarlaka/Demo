package com.choice.notebook.controller;

import com.choice.notebook.domain.Role;
import com.choice.notebook.domain.User;
import com.choice.notebook.service.other.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
@RequestMapping("/index")
public class Index {
    @Autowired
    LoginService loginService;

    @RequestMapping("/index")
    public ModelAndView index(){
        System.out.println("访问主页index");
        return new ModelAndView("index");
    }

    @RequestMapping("/login")
    public ModelAndView loginIn(){
        System.out.println("访问login界面");
        return new ModelAndView("login/login");
    }

    @RequestMapping("/loginIn")
    public ModelAndView loginIn(ModelMap map, User userInfo){
        Role role = loginService.isLogin(userInfo.getUserCode(), userInfo.getUserPwd());
        System.out.println("返回值："+ role);

        if (null != role){
            map.put("roleInfo", role);
            return new ModelAndView("common/success",map);
        }else{
            return new ModelAndView("common/error");
        }
    }

}
