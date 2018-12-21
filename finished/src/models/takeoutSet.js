/**
 * Create by xiaochenghua on 2018/03/10
 * */
import modelExtend from 'dva-model-extend';
import { inquire, inquireCondition, update, create, remove, inquireGroup } from '../services/takeoutSet';
import getKey from '../utils/getKey';
import { model } from './common';

export default modelExtend(model, {
  namespace: 'takeoutSet',
  state: {
    dataList: [],
    modalVisible: false,
    modalData: {},
    name: '',
    type: '',
    modalKey: getKey(),
    selections: [],
    groupList: [],
    groupLoading: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/takeout/set') {
          dispatch({
            type: 'query',
            payload: {
              page: {
                pageno: 1, // 查看第几页内容 默认1
                rowcount: 10, // 一页展示条数 默认10
              },
              key: null,
              status: null,
            },
          });
        }
      });
    },
  },
  effects: {
    // 查询外卖列表
    * query({ payload }, { call, put }) {
      // const oldPage = yield select(state => state.takeoutSet.pagination);
      const res = yield call(inquire);
      const { data, code } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            dataList: data || [],
            // listPagination: {  分页暂未开发
            //   ...oldPage,
            //   total: listData.data.page.total,
            //   current: listData.data.page.pageno,
            //   pageSize: listData.data.page.rowcount,
            // },
          },
        });
      }
    },
    // 搜索
    * queryCondition({ payload }, { call, put }) {
      // const oldPage = yield select(state => state.takeoutSet.pagination);
      const res = yield call(inquireCondition, payload);
      const { data, code } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            dataList: data || [],
            // listPagination: {  分页暂未开发
            //   ...oldPage,
            //   total: listData.data.page.total,
            //   current: listData.data.page.pageno,
            //   pageSize: listData.data.page.rowcount,
            // },
          },
        });
      }
    },
    // 新增外卖配置
    * add({ payload }, { call, put, select }) {
      const { name, type } = yield select(state => state.takeoutSet);
      const res = yield call(create, payload);
      const { code } = res.data;
      if (code === '200') {
        yield put({
          type: 'hideModal',
        });
        yield put({
          type: 'queryCondition',
          payload: {
            vname: name,
            vtype: type,
          },
        });
      }
    },
    // 编辑外卖配置
    * edit({ payload }, { call, put, select }) {
      const { name, type } = yield select(state => state.takeoutSet);
      const res = yield call(update, payload);
      const { code } = res.data;
      if (code === '200') {
        yield put({
          type: 'hideModal',
        });
        yield put({
          type: 'queryCondition',
          payload: {
            vname: name,
            vtype: type,
          },
        });
      }
    },
    // 删除外卖配置
    * delete({ payload }, { call, put, select }) {
      const { name, type } = yield select(state => state.takeoutSet);
      const res = yield call(remove, payload);
      const { code } = res.data;
      if (code === '200') {
        yield put({
          type: 'queryCondition',
          payload: {
            vname: name,
            vtype: type,
          },
        });
      }
    },
    // 搜索门店
    * queryGroupList({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          groupLoading: true,
        },
      });
      const params = {
        page: {
          pageno: 1,
          rowcount: 99999,
        },
        ...payload,
      };
      const res = yield call(inquireGroup, params);
      const { data, code } = res.data;
      if (code === '200') {
        yield put({
          type: 'updateState',
          payload: {
            groupList: data || [],
            // listPagination: {  分页暂未开发
            //   ...oldPage,
            //   total: listData.data.page.total,
            //   current: listData.data.page.pageno,
            //   pageSize: listData.data.page.rowcount,
            // },
          },
        });
      }
      yield put({
        type: 'updateState',
        payload: {
          groupLoading: false,
        },
      });
    },
  },
});
