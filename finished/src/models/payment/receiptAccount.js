/**
 * Create by liukang on 2018/03/06
 * */
import modelExtend from 'dva-model-extend';
import { parse } from 'qs';
import { cloneDeep } from 'lodash';
import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { inquire, enable, update, remove, create } from '../../services/payment/receiptAccount';
import { pageModel } from '../common';
import getKey from '../../utils/getKey';
import { Payment } from '../../utils/enums';

const { State } = Payment;

export default modelExtend(pageModel, {
  namespace: 'receiptAccount',
  state: {
    merchantId: '',  // 商户id
    selectedRows: [], // table选中的行
    searchInfo: '', // 搜索关键字
    modalVisible: false, // 弹窗
    modalKey: getKey(),
    item: {}, // 当前编辑条目
    checkedAll: [],
    checkedAllId: [],
    checkedStartId: [],
    checkedBlockId: [],
    startBtnStatus: true,
    blockBtnStatus: true,
    deleteBtnStatus: true,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const pathname = location.pathname;
        const re = pathToRegexp('/business/receiptAccount/:id');// 有冒号
        const match = re.exec(pathname);
        if (match) {
          const merchantId = match[1];
          dispatch({
            type: 'updateState',
            payload: {
              merchantId,
              searchInfo: '',
            },
          });
          dispatch({
            type: 'query',
            payload: {
              current: 1,
              keyword: '',
              merchantId,
            },
          });
        }
      });
    },
  },
  effects: {
    // 查询
    * query({ payload }, { call, put, select }) {
      const { pagination } = yield select(state => state.receiptAccount);
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
          type: 'reload',
        });
      }
    },
    // 新增
    * add({ payload }, { call, put }) {
      const res = yield call(create, parse(payload));
      const { code } = res.data;
      if (code === '200') {
        message.success('添加成功');
        yield put({
          type: 'reload',
        });
        yield put({
          type: 'hideModal',
        });
      }
    },
    // 编辑
    * edit({ payload }, { call, put }) {
      const res = yield call(update, parse(payload));
      const { code } = res.data;
      if (code === '200') {
        message.success('编辑成功');
        yield put({
          type: 'reload',
        });
        yield put({
          type: 'hideModal',
        });
      }
    },
    // 删除
    * delete({ payload }, { call, put }) {
      const res = yield call(remove, payload);
      const { code } = res.data;
      if (code === '200') {
        message.success('删除成功');
        yield put({
          type: 'reload',
        });
        yield put({
          type: 'hideModal',
        });
      }
    },

    * reload({ payload }, { put, select }) {
      const { merchantId, pagination } = yield select(state => state.receiptAccount);
      yield put({
        type: 'query',
        payload: {
          current: pagination.current,
          size: pagination.pageSize,
          keyword: '',
          merchantId,
        },
      });
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
