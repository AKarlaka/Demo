/**
 * Create by liukang on 2018/03/06
 * */
import modelExtend from 'dva-model-extend';
import getKey from '../utils/getKey';

const model = {
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    querySuccess(state, { payload }) {
      return { ...state, ...payload, loading: false };
    },
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true, modalKey: getKey() };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },
  },
};

const pageModel = modelExtend(model, {
  state: {
    dataList: [],
    searchData: {}, // 查询信息汇总
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
      pageSizeOptions: ['10', '20', '50', '100'],
      defaultPageSize: 10,
    },
  },
  effects: {
    // 重新按照搜索条件搜索，payload为传入的namespace，string类型
    * reSearch({ payload }, { put, select }) {
      const searchData = yield select(state => state[payload].searchData);
      yield put({
        type: 'query',
        payload: {
          ...searchData,
        },
      });
    },
  },
});

module.exports = {
  model,
  pageModel,
};
