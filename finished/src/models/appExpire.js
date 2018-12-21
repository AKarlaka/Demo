/**
 * Created by zhangnaiying on 2018/09/03
 */
import modelExtend from 'dva-model-extend';
import { pageModel } from './common';
import { inquire, inquireAppInfo, inquireShopInfo, inquireDeadLineInfo } from '../services/appExpire';

export default modelExtend(pageModel, {
  namespace: 'appExpire',
  state: {
    currentItem: {},
    modalVisible: false,
    modalKey: null,
    shopDataList: [], // 门店到期统计详情
    appInfo: {}, // 应用信息
    btnSelectedStatus: [true, false, false, false, false, false, false],
    deadLineInfo: {
      seriousOverdueShop: 0, // 严重逾期
      overdueShop: 0, // 已到期
      almostOverdueShop: 0, // 即将到期
      noOverdueShop: 0, // 使用中
      applicationOff: 0, // 停用
      applicationOn: 0, // 正常
    },
    shopPagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
      pageSizeOptions: ['10', '20', '50', '100'],
      defaultPageSize: 10,
    },
    query: {
      tenantName: null,
      overdueType: null,
    },
    queryShopInfo: { // 门店详情页查询
      shopName: null,
      overdueType: null,
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/app/expire') {
          dispatch({
            type: 'query',
            payload: {
              pageno: 1,
              rowcount: 10,
            },
          });
        }
      });
    },
  },
  effects: {
    * query({ payload }, { call, put, select }) {
      const res = yield call(inquire, payload);
      const { code, data, page } = res.data;
      if (code === '200') {
        const paginationOld = yield select(state => state.appExpire.pagination);
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
          },
        });
      }
    },
    * queryShopExpireInfo({ payload }, { call, put }) {
      const res = yield call(inquireShopInfo, payload);
      const { code, data, page } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            shopDataList: data || [],
            shopPagination: {
              total: page ? page.total : 0,
              current: page ? page.pageno : 1,
              pageSize: page ? page.rowcount : '10',
            },
          },
        });
      }
    },
    * queryAppInfo({ payload }, { call, put }) {
      const res = yield call(inquireAppInfo, payload);
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
    // 查询头部到期统计信息
    * queryDeadLineInfo({ payload }, { call, put }) {
      const res = yield call(inquireDeadLineInfo, payload);
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
  },
});
