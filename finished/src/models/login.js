import modelExtend from 'dva-model-extend';
import { routerRedux } from 'dva/router';
import { parse } from 'qs';
import { enter } from '../services/login';
import { saveSession } from '../utils/';
import { model } from './common';

export default modelExtend(model, {
  namespace: 'login',
  state: {
    id: '',
    deleteFlag: '',
    password: '',
    username: '',
  },
  subscriptions: {},
  effects: {
    // 登陆
    * login({ payload }, { call, put }) {
      const res = yield call(enter, parse(payload));
      const { code, data } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            deleteFlag: data.deleteFlag,
            username: data.username,
            password: data.password,
            loginId: data.id,
          },
        });
        saveSession('user', data.id);
        yield put(routerRedux.push('/business'));
      }
    },

  },
});
