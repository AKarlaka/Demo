/**
 * Create by liukang on 2018/03/06
 * */
import modelExtend from 'dva-model-extend';
import { parse } from 'qs';
import { message } from 'antd';
import { cloneDeep } from 'lodash';
import { inquire, enable, inquireAggregators, inquireIsv, update } from '../../services/payment/payChannel';
import { pageModel } from '../common';
import getKey from '../../utils/getKey';
import { Payment } from '../../utils/enums';

const { State } = Payment;

export default modelExtend(pageModel, {
  namespace: 'payChannel',
  state: {
    selectedRows: [], // table选中的行
    selectedStarts: [],
    selectedBlocks: [],
    startBtnStatus: true,
    blockBtnStatus: true,
    searchInfo: '', // 搜索关键字
    modalVisible: false, // 弹窗
    modalKey: getKey(),
    item: {}, // 当前编辑条目
    aggregator: [], // 聚合服务商选项列表
    isv: [],  // isv选项列表
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/payChannel') {
          dispatch({
            type: 'reSearch',
            payload: 'payChannel',
          });
        }
      });
    },
  },
  effects: {
    // 查询支付渠道列表信息
    * query({ payload }, { call, put, select }) {
      const { pagination } = yield select(state => state.payChannel);
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
    // 停用、启用
    * onOff({ payload }, { call, put }) {
      const res = yield call(enable, parse(payload));
      const { code } = res.data;
      if (code === '200') {
        message.success(payload.enable === State.ENABLE ? '启用成功' : '停用成功');
        yield put({
          type: 'query',
        });
      }
    },
    // 编辑支付渠道
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
    * queryAggregators({ payload }, { call, put }) {
      const res = yield call(inquireAggregators, parse(payload));
      const { data, code } = res.data;
      if (code === '200') {
        yield put({
          type: 'updateState',
          payload: {
            aggregator: data || [],
          },
        });
      }
    },
    // 获取isv选项列表
    * queryIsv({ payload }, { call, put }) {
      const res = yield call(inquireIsv, parse(payload));
      const { data, code } = res.data;
      if (code === '200') {
        yield put({
          type: 'updateState',
          payload: {
            isv: data || [],
          },
        });
      }
    },
  },
  reducers: {
    // 显示弹框
    showModal(state, { payload }) {
      // 设置起始位列表
      const item = cloneDeep(payload.item);
      return { ...state, item, modalKey: getKey(), modalVisible: true };
    },
  },
});
