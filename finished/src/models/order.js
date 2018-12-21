/**
 * Created by Wangtaidong on 2018/2/1.
 */
import modelExtend from 'dva-model-extend';
import { message } from 'antd';
import { inquire, inquireShops, inquireApps, verify, reject, passScmMsg } from '../services/order';
import { pageModel } from './common';

export default modelExtend(pageModel, {
  namespace: 'order',
  state: {
    // searcch props
    apps: [],
    selectAppId: '',
    selectStatus: '',
    searchWord: '',
    pageModal: {
      showSizeChanger: false,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
      size: 'small',
    },
    modalVisible: false,
    modalData: [],
    shopList: [],
    orderId: '',
    tenantId: '',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/order') {
          // dispatch({
          //   type: 'query',
          //   payload: {
          //     page: {
          //       pageno: 1, // 查看第几页内容 默认1
          //       rowcount: 10, // 一页展示条数 默认10
          //     },
          //     key: '',
          //     applicationId: '',
          //     status: '',
          //   },
          // });
          dispatch({
            type: 'reSearch',
            payload: 'order',
          });
          dispatch({
            type: 'queryApps',
          });
        }
      });
    },
  },

  effects: {
    // 获取列表
    * query({ payload }, { call, put, select }) {
      const res = yield call(inquire, payload);
      const { code, data, page } = res.data;
      if (code === '200') {
        const paginationOld = yield select(state => state.order.pagination);
        yield put({
          type: 'querySuccess',
          payload: {
            dataList: data || [],
            pagination: {
              ...paginationOld,
              total: page.total,
              current: page.pageno,
              pageSize: page.rowcount,
            },
          },
        });
      }
    },

    // 查询所有应用
    * queryApps({ payload }, { call, put }) {
      const res = yield call(inquireApps, payload);
      const { code, data } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            apps: data || [],
          },
        });
      }
    },

    // 查看门店列表
    * queryShops({ payload }, { call, put, select }) {
      const oldPage = yield select(state => state.order.pageModal);
      const res = yield call(inquireShops, payload);
      const { code, data, page } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            modalData: data || [],
            pageModal: {
              ...oldPage,
              current: page.pageno,
              pageSize: page.rowcount,
              total: page.total,
            },
          },
        });
      }
    },
    // 审核通过
    * review({ payload }, { call, put, select }) {
      const res = yield call(verify, payload);
      const { code } = res.data;
      if (code === '200') {
        message.success('已通过审核！');
        const order = yield select(state => state.order);
        yield put({
          type: 'query',
          payload: {
            page: {
              pageno: order.pagination.current,
              rowcount: order.pagination.pageSize,
            },
            key: order.searchWord,
            applicationId: order.selectAppId,
            status: order.selectStatus,
          },
        });
      }
    },
    // 审核通过供应链应用发送消息
    * sendScmMsg({ payload }, { call }) {
      yield call(passScmMsg, payload);
    },
    // 审核不通过
    * refuse({ payload }, { call, put, select }) {
      const res = yield call(reject, payload);
      const { code } = res.data;
      if (code === '200') {
        message.success('操作成功!');
        const order = yield select(state => state.order);
        yield put({
          type: 'query',
          payload: {
            page: {
              pageno: order.pagination.current,
              rowcount: order.pagination.pageSize,
            },
            key: order.searchWord,
            applicationId: order.selectAppId,
            status: order.selectStatus,
          },
        });
      }
    },
  },
});
