/**
 * Create by xiaochenghua on 2018/02/01
 * */
import modelExtend from 'dva-model-extend';
import { parse } from 'qs';
import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import { inquire, update } from '../services/appDetail';
import { model } from './common';

export default modelExtend(model, {
  namespace: 'appDetail',
  state: {
    id: '',
    viewPath: '',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const pathname = location.pathname;
        const re = pathToRegexp('/app/detail/:id');// 有冒号
        const match = re.exec(pathname);
        if (match) {
          const itemId = match[1];
          dispatch({
            type: 'query',
            payload: {
              appIds: itemId,
            },
          });
          dispatch({
            type: 'updateState',
            payload: {
              id: itemId,
            },
          });
        }
      });
    },
  },
  effects: {
    // 获取列表
    * query({ payload }, { call, put }) {
      const res = yield call(inquire, parse(payload));
      const { code, data } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            viewPath: data[0].viewPath || '',
          },
        });
      }
    },
    // 回传url，实现新增、编辑图文
    * edit({ payload }, { call, put, select }) {
      const appId = yield select(state => state.appDetail.id);
      const res = yield call(update, parse({ ...payload, appId }));
      const { code } = res.data;
      if (code === '200') {
        yield put(routerRedux.push('/app/list'));
        yield put({
          type: 'updateState',
          payload: {
            viewPath: '',
          },
        });
      }
    },
    // 返回列表
    * returnList({ payload }, { put }) {
      yield put(routerRedux.push('/app/list'));
    },
  },
});
