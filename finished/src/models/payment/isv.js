/**
 * Create by liukang on 2018/03/06
 * */
import modelExtend from 'dva-model-extend';
import { parse } from 'qs';
import { cloneDeep } from 'lodash';
import { message } from 'antd';
import { inquire, update, remove, create } from '../../services/payment/isv';
import { pageModel } from '../common';
import getKey from '../../utils/getKey';

export default modelExtend(pageModel, {
  namespace: 'isv',
  state: {
    searchInfo: '', // 搜索关键字
    modalVisible: false, // 弹窗
    modalKey: getKey(),
    item: {}, // 当前编辑条目
    channel: [], // 渠道选项列表
    selectedRows: [], // table选中的行
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/isv') {
          dispatch({
            type: 'reSearch',
            payload: 'isv',
          });
        }
      });
    },
  },
  effects: {
    // 查询isv
    * query({ payload }, { call, put, select }) {
      const { pagination } = yield select(state => state.isv);
      const res = yield call(inquire, parse(payload));
      const { data, code, page } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            dataList: data || [],
            pagination: {
              ...pagination,
              total: Number.parseInt(page.total, 10),
              current: Number.parseInt(page.pageno, 10),
              pageSize: Number.parseInt(page.rowcount, 10),
            },
          },
        });
      }
    },
    // 新增isv
    * add({ payload }, { call, put }) {
      const res = yield call(create, parse(payload));
      const { code } = res.data;
      if (code === '200') {
        message.success('新增成功');
        yield put({
          type: 'query',
        });
        yield put({
          type: 'hideModal',
        });
      }
    },
    // 编辑isv
    * edit({ payload }, { call, put }) {
      const res = yield call(update, parse(payload));
      const { code } = res.data;
      if (code === '200') {
        message.success('编辑成功');
        yield put({
          type: 'query',
        });
        yield put({
          type: 'hideModal',
        });
      }
    },
    // 删除idv
    * delete({ payload }, { call, put }) {
      const res = yield call(remove, payload);
      const { code } = res.data;
      if (code === '200') {
        message.success('删除成功');
        yield put({
          type: 'query',
        });
        yield put({
          type: 'hideModal',
        });
      }
    },
  },
  reducers: {
    // 显示编辑弹窗
    showModal(state, { payload }) {
      const item = cloneDeep(payload.item);
      return { ...state, item, modalKey: getKey(), modalVisible: true };
    },
  },
});
