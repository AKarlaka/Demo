import modelExtend from 'dva-model-extend';
import { routerRedux } from 'dva/router';
import { message } from 'antd/lib/index';
import { menuList } from '../services/app';
import { logout } from '../services/login';
import { makeMenu, getUserInfo, getSession, delSession, config } from '../utils/';
import { model } from './common';

const { prefix } = config;
const localStorage = window.localStorage;
const document = window.document;
const location = window.location;
const winWidth = window.innerWidth || document.documentElement.clientWidth
  || document.body.clientWidth;

export default modelExtend(model, {
  namespace: 'manage',
  state: {
    user: {},
    //  isLogin: false,
    permissions: {
      visit: ['1', '11', '111', '112', '12', '121', '21', '22', '221', '23', '3', '31', '41', '42', '43'],
    },
    menu: [
      {
        id: '1',
        icon: 'solution',
        name: '商户管理',
        route: '/business',
      },
      {
        id: '11',
        mpid: '-1',
        bpid: '1',
        name: '收款账号管理',
        route: '/business/receiptAccount/:merchantId',
      },
      {
        id: '111',
        mpid: '-1',
        bpid: '11',
        name: '第三方渠道配置',
        route: '/business/receiptAccount/channel/:merchantId/:accId',
      },
      {
        id: '112',
        mpid: '-1',
        bpid: '11',
        name: '绑定门店管理',
        route: '/business/receiptAccount/shop/:merchantId/:accId',

      },
      {
        id: '12',
        mpid: '-1',
        bpid: '1',
        name: '应用管理',
        route: '/business/app/:businessId',
      },
      {
        id: '121',
        mpid: '-1',
        bpid: '12',
        name: '管理门店',
        route: '/business/app/shop/:businessId/:appId',
      },
      {
        id: '2',
        icon: 'setting',
        name: '应用管理',
      },
      {
        id: '22',
        mpid: '2',
        bpid: '2',
        name: '应用列表',
        route: '/app/list',
      },
      {
        id: '221',
        mpid: '-1',
        bpid: '22',
        name: '图文详情',
        route: '/app/detail/:id',
      },
      {
        id: '21',
        mpid: '2',
        bpid: '2',
        name: '订单管理',
        route: '/order',
      },
      {
        id: '23',
        mpid: '2',
        bpid: '2',
        name: '到期统计',
        route: '/app/expire',
      },
      {
        id: '3',
        icon: 'setting',
        name: '外卖管理',
      },
      {
        id: '31',
        mpid: '3',
        bpid: '3',
        name: '外卖配置',
        route: '/takeout/set',
      },
      {
        id: '4',
        icon: 'alipay',
        name: '支付网关管理',

      },
      {
        id: '41',
        mpid: '4',
        bpid: '4',
        name: 'ISV管理',
        route: '/isv',
      },
      {
        id: '42',
        mpid: '4',
        bpid: '4',
        name: '聚合服务商管理',
        route: '/aggregator',
      },
      {
        id: '43',
        mpid: '4',
        bpid: '4',
        name: '支付渠道管理',
        route: '/payChannel',
      },
    ],
    menuPopoverVisible: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: true, // 风格定为深色
    isNavbar: winWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    // 基础资料
  },
  subscriptions: {
    setup({ dispatch }) {
      // 设定模块subscription的emit事件的flag
      let tid;
      window.onresize = () => {
        clearTimeout(tid);
        tid = setTimeout(() => {
          dispatch({
            type: 'autoSwitchSider',
          });
        }, 300);
      };
    },
  },
  effects: {
    * changeNavbar({ payload }, { put, select }) {
      const { report } = yield (select(_ => _));
      const isNavbar = winWidth < 769;
      if (isNavbar !== report.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar });
      }
    },

    // 登陆检测
    * checkLogin() {
      const user = yield getSession('user');
      if (!user) {
        window.location = `${location.origin}/index.html#/login`;
      }
    },
    // 获取菜单列表
    * getMenuList(payload, { put, call }) {
      const { data } = yield call(menuList);
      // 有菜单权限 并且 已经完善商户信息 才展示菜单
      if (data.success && getUserInfo().tenName) {
        yield put({
          type: 'showMenu',
          menuData: makeMenu(data.data),
        });
      } else {
        yield put({ type: 'hideMenu' });
      }
    },
    // 登出系统
    * logOut({ payload }, { call, put }) {
      const dataList = yield call(logout);
      if (dataList.data.code === '200') {
        message.success('退出登录成功！');
        delSession('user');
        yield put(routerRedux.push('/login'));
      } else {
        message.warning(`${dataList.data.msg}`);
      }
    },
  },
  reducers: {
    autoSwitchSider(state) {
      const siderFold = document.body.clientWidth < 769;
      if (siderFold) {
        localStorage.setItem(`${prefix}siderFold`, siderFold);
        return {
          ...state,
          siderFold,
        };
      }
      return state;
    },

    switchSider(state) {
      localStorage.setItem(`${prefix}siderFold`, !state.siderFold);
      return {
        ...state,
        siderFold: !state.siderFold,
      };
    },

    switchTheme(state) {
      localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme);
      return {
        ...state,
        darkTheme: !state.darkTheme,
      };
    },

    switchMenuPopver(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      };
    },

    handleNavbar(state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      };
    },

    handleNavOpenKeys(state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      };
    },
  },
});
