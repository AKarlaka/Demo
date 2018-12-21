/**
 * Created by zhangnaiying on 2018/08/31
 */
import modelExtend from 'dva-model-extend';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import { pageModel } from './common';
import { inquire, create, updateExpireTime, remove, enable, inquireSetOpt, updateEdition, inquireAppList, inquireShop } from '../services/businessApp';
import getKey from '../utils/getKey';

const _ = require('lodash');

export default modelExtend(pageModel, {
  namespace: 'businessApp',
  state: {
    currentItem: {},
    modalType: '',
    modalKey: null,
    shopModalKey: null,
    modalVisible: false,
    shopModalVisible: false,
    modalError: false,
    modalWarn: false,
    modalErrorValue: null,
    appId: '',
    tenantId: '', // 商户ID
    selectedRows: [], // 选中的行
    setOptionList: [],
    appList: [], // 所有应用列表
    appType: '', // 应用类型
    shopNum: 0,
    treeShopData: [],
    cacheCheckedKeys: [],
    shopIdArray: [],
    treeShopOption: {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const pathname = location.pathname;
        const re = pathToRegexp('/business/app/:businessId');// 有冒号
        const match = re.exec(pathname);
        if (match) {
          const tenantId = match[1];
          if (tenantId === ':businessId') {
            dispatch({
              type: 'replaceUrl',
            });
          } else {
            dispatch({
              type: 'query',
              payload: {
                tenantId,
                pageno: 1,
                rowcount: 10,
              },
            });
            dispatch({
              type: 'updateState',
              payload: {
                tenantId,
              },
            });
          }
        }
      });
    },
  },
  effects: {
    * query({ payload }, { call, put, select }) {
      const res = yield call(inquire, parse(payload));
      const { code, data, page } = res.data;
      if (code === '200') {
        const paginationOld = yield select(state => state.businessApp.pagination);
        yield put({
          type: 'querySuccess',
          payload: {
            dataList: data || [],
            pagination: {
              ...paginationOld,
              total: page ? page.total : 0,
              current: page ? page.pageno : 1,
              pageSize: page ? page.rowcount : '10',
            },
            selectedRows: [], // 用于每次调用查询接口时清空勾选
          },
        });
      }
    },
    // 查询设置模态框选项
    * querySetOpt({ payload }, { call, put }) {
      const res = yield call(inquireSetOpt, parse(payload));
      const { code, data } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            setOptionList: data || [],
          },
        });
      }
    },
    // 查询所有应用列表
    * queryApp({ payload }, { call, put }) {
      const res = yield call(inquireAppList, parse(payload));
      const { code, data } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            appList: data || [],
          },
        });
      }
    },
    // 获取门店树列表
    * queryShop({ payload }, { call, put }) {
      const res = yield call(inquireShop, parse(payload));
      const { code, data, msg } = res.data;
      if (code === '200') {
        if (data.length === 0) {
          yield put({
            type: 'updateState',
            payload: {
              modalWarn: true,
              modalErrorValue: '暂无门店信息',
            },
          });
        }
        yield put({
          type: 'updateState',
          payload: {
            treeShopData: data || [],
          },
        });
      } else if (msg) {
        yield put({
          type: 'updateState',
          payload: {
            modalError: true,
            modalErrorValue: msg,
          },
        });
      }
    },
    // 订购应用
    * add({ payload }, { call, put }) {
      const res = yield call(create, payload);
      const { code, data } = res.data;
      if (code === '200') {
        if (!data) {
          message.success('订购成功！');
        } else {
          const errInfo = JSON.parse(data);
          let appList = _.uniqBy(errInfo, 'appId');
          appList = appList.length <= 2 ? appList : _.slice(appList, 0, 3);
          appList.map((item) => {
            let content = '';
            switch (item.errorType) {
              case '0':
                content = `您订购的门店 ${item.appName} 可能存在未下线的后置应用：${item.extName}，订购失败！`;
                break;
              case '1':
                content = `您订购的门店 ${item.appName} 可能存在已上线的互斥应用：${item.extName}，订购失败！`;
                break;
              case '2':
                content = `您订购的门店 ${item.appName} 可能存在未上线或未订购的前置应用：${item.extName}，订购失败！`;
                break;
              case '3':
                content = '您已订购该应用，请勿重复订购！';
                break;
              case '4':
                content = '系统或网络错误，请稍后重试！';
                break;
              case '5':
                content = '订购失败，所选门店为空';
                break;
              default:
                content = '意外错误，请稍后重试！';
                break;
            }
            message.warning(content);
            return null;
          });
        }
        yield put({ type: 'hideModal' });
        yield put({ type: 'clearShop' });
        yield put({ type: 'clearModal' });
        yield put({ type: 'reload' });
      }
    },
    // 修改到期时间
    * editTime({ payload }, { call, put }) {
      const res = yield call(updateExpireTime, payload);
      const { code } = res.data;
      if (code === '200') {
        message.success('修改到期时间成功！');
        yield put({
          type: 'updateState',
          payload: {
            modalType: '',
          },
        });
        yield put({ type: 'hideModal' });
        yield put({ type: 'reload' });
      }
    },
    // 保存应用配置信息
    * editSet({ payload }, { call, put }) {
      const res = yield call(updateEdition, payload);
      const { code } = res.data;
      if (code === '200') {
        message.success('修改应用配置成功！');
        yield put({ type: 'hideModal' });
        yield put({
          type: 'updateState',
          payload: {
            setOptionList: [],
          },
        });
        yield put({ type: 'reload' });
      }
    },

    * onOff({ payload }, { call, put }) {
      const res = yield call(enable, parse(payload));
      const { code, data } = res.data;
      if (code === '200') {
        if (data.length === 0) {
          message.success('操作成功！');
          yield put({ type: 'reload' });
        } else {
          let appList = _.uniqBy(data, 'appId');
          appList = appList.length <= 2 ? appList : _.slice(appList, 0, 3);
          appList.map((item) => {
            let content = '';
            if (item.errorType === '0') {
              content = `您停用的应用 ${item.appName} 可能存在未下线的后置应用：${item.extName}，停用失败！`;
            } else if (item.errorType === '1') {
              content = `您启用的应用 ${item.appName} 可能存在已上线的互斥应用：${item.extName}，启用失败！`;
            } else if (item.errorType === '2') {
              content = `您启用的应用 ${item.appName} 可能存在未上线或未订购的前置应用：${item.extName}，启用失败！`;
            }
            message.warning(content);
            return null;
          });
        }
      }
    },

    * delete({ payload }, { call, put }) {
      const res = yield call(remove, payload);
      const { code } = res.data;
      if (code === '200') {
        message.success('删除成功！');
        yield put({ type: 'reload' });
      }
    },

    * reload({ payload }, { put, select }) {
      const pagination = yield select(state => state.businessApp.pagination);
      const tenantId = yield select(state => state.businessApp.tenantId);
      yield put({
        type: 'query',
        payload: {
          tenantId,
          pageno: pagination.current,
          rowcount: pagination.pageSize,
        },
      });
    },

    // 面包屑跳转丢掉商户ID时根据state中的商户ID去更新url
    * replaceUrl({ payload }, { put, select }) {
      // 为了避免在businessAppShop页面刷新后跳回businessApp取不到state，因此这里从businessApp下取tenantId
      const tenantId = yield select(state => state.businessAppShop.tenantId);
      yield put(routerRedux.replace({ pathname: `/business/app/${tenantId}` }));
    },
    // 清空门店勾选数据
    * clearShop({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          shopNum: 0,
          shopIdArray: [],
          cacheCheckedKeys: [],
          treeShopOption: {
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
          },
        },
      });
    },

    // 清空模态框数据
    * clearModal({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          appType: '',
          modalType: '',
          modalKey: null,
          modalError: false,
          modalWarn: false,
        },
      });
    },

  },
  reducers: {
    showShopModal(state, { payload }) {
      return { ...state, ...payload, shopModalVisible: true, shopModalKey: getKey() };
    },
    hideShopModal(state) {
      return { ...state, shopModalVisible: false };
    },
  },
});
