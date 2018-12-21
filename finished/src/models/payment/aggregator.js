/**
 * Create by liukang on 2018/03/06
 * */
import modelExtend from 'dva-model-extend';
import { parse } from 'qs';
import { cloneDeep } from 'lodash';
import { message } from 'antd';
import { inquire, inquireChannel, update } from '../../services/payment/aggregator';
import { pageModel } from '../common';
import getKey from '../../utils/getKey';

export default modelExtend(pageModel, {
  namespace: 'aggregator',
  state: {
    searchInfo: '', // 搜索关键字
    modalVisible: false, // 弹窗
    modalKey: getKey(),
    item: {}, // 当前编辑条目
    channel: [], // 渠道选项列表
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/aggregator') {
          dispatch({
            type: 'reSearch',
            payload: 'aggregator',
          });
        }
      });
    },
  },
  effects: {
    // 查询服务商信息列表
    * query({ payload }, { call, put, select }) {
      const { pagination } = yield select(state => state.aggregator);
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
    // 编辑服务商
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
    // 获取聚合服务商选项列表
    * queryChannel({ payload }, { call, put }) {
      const res = yield call(inquireChannel, parse(payload));
      const { data, code } = res.data;
      if (code === '200') {
        yield put({
          type: 'updateState',
          payload: {
            channel: data || [],
          },
        });
      }
    },
  },
  reducers: {
    // 显示编辑弹窗
    showModal(state, { payload }) {
      // 处理选项
      const item = cloneDeep(payload.item);
      if (item.channels) {
        item.channels = item.channels.map(it => it.code);
      } else {
        item.channels = [];
      }
      return { ...state, item, modalKey: getKey(), modalVisible: true };
    },
  },
});
