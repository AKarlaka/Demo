/**
 * Created by zhangnaiying on 2018/09/02
 */
import modelExtend from 'dva-model-extend';
import { parse } from 'qs';
import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { pageModel } from './common';
import { inquire, inquireSetOpt, inquireAppInfo, inquireDeadLineInfo, update, enable, updateEdition } from '../services/businessAppShop';

const _ = require('lodash');

export default modelExtend(pageModel, {
  namespace: 'businessAppShop',
  state: {
    currentItem: {},
    modalType: '',
    modalVisible: false,
    modalKey: null,
    canOpenTimePicker: false,
    tenantId: '', // 商户ID
    applicationId: '', // 应用ID
    selectedRows: [], // 选中的行
    setOptionList: [], // 设置模态框数据
    queryEditionsList: [], // 获取到的配置列表用于查询条件处
    appInfo: {},
    btnSelectedStatus: [true, false, false, false, false],
    query: {
      deadLineQuery: null,
      appStatusQuery: null,
      editionId: null,
      storeTimeStatus: null,
    },
    deadLineInfo: {
      seriousOverdueShop: 0, // 严重逾期
      overdueShop: 0, // 已到期
      almostOverdueShop: 0, // 即将到期
      noOverdueShop: 0, // 使用中
      applicationOff: 0, // 停用
      applicationOn: 0, // 正常
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const pathname = location.pathname;
        const re = pathToRegexp('/business/app/shop/:businessId/:appId');// 有冒号
        const match = re.exec(pathname);
        if (match) {
          const tenantId = match[1];
          const applicationId = match[2];
          dispatch({ // 查询列表展示数据
            type: 'query',
            payload: {
              tenantId,
              applicationId,
              pageno: 1,
              rowcount: 10,
            },
          });
          dispatch({ // 查询搜索条件中的配置下拉框数据
            type: 'queryEditions',
            payload: {
              tenantId,
              applicationId,
              interfaceType: '0',
            },
          });
          dispatch({ // 查询头部到期统计信息
            type: 'queryDeadLineInfo',
            payload: {
              tenantId,
              applicationId,
            },
          });
          dispatch({ // 查询头部应用信息
            type: 'queryApplicationInfo',
            payload: {
              appId: applicationId,
            },
          });
          dispatch({
            type: 'updateState',
            payload: {
              tenantId,
              applicationId,
              btnSelectedStatus: [true, false, false, false, false, false, false],
              query: {
                deadLineQuery: null,
                appStatusQuery: null,
                editionId: null,
                storeTimeStatus: null,
              },
            },
          });
        }
      });
    },
  },
  effects: {
    * query({ payload }, { call, put, select }) {
      const res = yield call(inquire, parse(payload));
      const { code, data, page } = res.data;
      if (code === '200') {
        const paginationOld = yield select(state => state.businessAppShop.pagination);
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
            selectedRows: [], // 用于每次执行查询操作时清空勾选数据
          },
        });
      }
    },
    // 根据应用及商户id及门店id获取按门店配置信息
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
    // 查询配置列表用于查询
    * queryEditions({ payload }, { call, put }) {
      const res = yield call(inquireSetOpt, parse(payload));
      const { code, data } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            queryEditionsList: data || [],
          },
        });
      }
    },
    // 查询头部到期统计信息
    * queryDeadLineInfo({ payload }, { call, put }) {
      const res = yield call(inquireDeadLineInfo, parse(payload));
      const { code, data } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            deadLineInfo: data || {
              seriousOverdueShop: 0, // 严重逾期
              overdueShop: 0, // 已到期
              almostOverdueShop: 0, // 即将到期
              noOverdueShop: 0, // 使用中
              applicationOff: 0, // 停用
              applicationOn: 0, // 正常
            },
          },
        });
      }
    },
    // 查询头部应用信息
    * queryApplicationInfo({ payload }, { call, put }) {
      const res = yield call(inquireAppInfo, parse(payload));
      const { code, data } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            appInfo: data || {},
          },
        });
      }
    },
    // 修改到期时间
    * editTime({ payload }, { call, put, select }) {
      const res = yield call(update, payload);
      const { tenantId, applicationId } = yield select(state => state.businessAppShop);
      const { code } = res.data;
      if (code === '200') {
        message.success('修改到期时间成功！');
        yield put({
          type: 'updateState',
          payload: {
            modalType: '',
          },
        });
        yield put({
          type: 'queryDeadLineInfo',
          payload: {
            tenantId,
            applicationId,
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
    * onOff({ payload }, { call, put, select }) {
      const res = yield call(enable, parse(payload));
      const { tenantId, applicationId } = yield select(state => state.businessAppShop);
      const { code, data } = res.data;
      if (code === '200') {
        if (data.length === 0) {
          message.success('操作成功！');
          yield put({ type: 'reload' });
          yield put({
            type: 'queryDeadLineInfo',
            payload: {
              tenantId,
              applicationId,
            },
          });
        } else {
          let appList = _.uniqBy(data, 'appId');
          appList = appList.length <= 2 ? appList : _.slice(appList, 0, 3);
          appList.map((item) => {
            let content = '';
            if (item.errorType === '0') {
              content = `您停用的门店 ${item.appName} 可能存在未下线的后置应用：${item.extName}，停用失败！`;
            } else if (item.errorType === '1') {
              content = `您启用的门店 ${item.appName} 可能存在已上线的互斥应用：${item.extName}，启用失败！`;
            } else if (item.errorType === '2') {
              content = `您启用的门店 ${item.appName} 可能存在未上线或未订购的前置应用：${item.extName}，启用失败！`;
            }
            message.warning(content);
            return null;
          });
        }
      }
    },
    * reload({ payload }, { put, select }) {
      const pagination = yield select(state => state.businessAppShop.pagination);
      const { tenantId, applicationId, query } = yield select(state => state.businessAppShop);
      yield put({
        type: 'query',
        payload: {
          tenantId,
          applicationId,
          ...query,
          pageno: pagination.current,
          rowcount: pagination.pageSize,
        },
      });
    },
  },
});
