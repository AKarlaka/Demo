/**
 * Create by liukang on 2018/03/06
 * */
import modelExtend from 'dva-model-extend';
import { parse } from 'qs';
import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { inquire, unbound, unboundAll, bound, inquireStores, inquireBinds } from '../../services/payment/receiptShop';
import { pageModel } from '../common';
import getKey from '../../utils/getKey';

// 门店树转map
const getShopMap = (array, key) => {
  let newMap = {};
  array.forEach((item) => {
    const children = item.children;
    if (item.isLeaf === 1) {
      newMap[item[key]] = item;
    } else if (children && children.length > 0) {
      newMap = {
        ...newMap,
        ...getShopMap(children, key),
      };
    }
  });
  return newMap;
};

const setIsBind = (array, map) => {
  array.forEach((item) => {
    const shop = map[item];
    if (shop) {
      shop.isBind = 1;
    }
  });
};

export default modelExtend(pageModel, {
  namespace: 'receiptShop',
  state: {
    merchantId: '',  // 商户id
    accId: '', // 账户id
    selectedRows: [], // table选中的行
    searchInfo: '', // 搜索关键字
    modalVisible: false, // 弹窗
    modalKey: getKey(),
    shopData: [],  // 组织机构树
    shopIdMap: {}, // 门店MAP
    checkedShopIds: [], // 已选择的treeNode
    checkedShops: [], // 已选择的treeNode
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const pathname = location.pathname;
        const re = pathToRegexp('/business/receiptAccount/shop/:merchantId/:accId');// 有冒号
        const match = re.exec(pathname);
        if (match) {
          const merchantId = match[1];
          const accId = match[2];
          dispatch({
            type: 'updateState',
            payload: {
              merchantId,
              accId,
            },
          });
          dispatch({
            type: 'query',
            payload: {
              current: 1,
              keyword: null,
              merchantId,
              accId,
            },
          });
        }
      });
    },
  },
  effects: {
    // 查询
    * query({ payload }, { call, put, select }) {
      const { pagination,
        searchInfo,
        merchantId,
        accId } = yield select(state => state.receiptShop);
      const params = {
        size: pagination.pageSize,
        current: pagination.current,
        keyword: searchInfo,
        merchantId,
        accId,
        ...payload,
      };
      const res = yield call(inquire, parse(params));
      const { data, code, page } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            dataList: data || [],
            pagination: {
              total: Number.parseInt(page.total, 10),
              current: Number.parseInt(page.pageno, 10),
              pageSize: Number.parseInt(page.rowcount, 10),
            },
          },
        });
      }
    },
    // 绑定
    * bind({ payload }, { call, put, select }) {
      const { accId } = yield select(state => state.receiptShop);
      const params = {
        accId,
        shops: payload,
      };
      const res = yield call(bound, parse(params));
      const { code } = res.data;
      if (code === '200') {
        message.success('绑定成功');
        yield put({
          type: 'query',
        });
        yield put({
          type: 'hideModal',
        });
        yield put({
          type: 'updateState',
          payload: {
            checkedShopIds: [],
          },
        });
      }
    },
    // 取消绑定
    * unbind({ payload }, { call, put, select }) {
      const { accId } = yield select(state => state.receiptShop);
      const params = {
        accId,
        ...payload,
      };
      const res = yield call(unbound, parse(params));
      const { code } = res.data;
      if (code === '200') {
        message.success('解绑成功');
        yield put({
          type: 'query',
        });
      }
    },
    // 批量取消绑定
    * unbindAll({ payload }, { call, put, select }) {
      const { accId } = yield select(state => state.receiptShop);
      const params = {
        accId,
        shops: payload,
      };
      const res = yield call(unboundAll, parse(params));
      const { code } = res.data;
      if (code === '200') {
        message.success('解绑成功');
        yield put({
          type: 'query',
        });
      }
    },
    // 获取列表
    * queryStores({ payload }, { call, put, select }) {
      const { merchantId } = yield select(state => state.receiptShop);
      const params = {
        tenantId: merchantId,
      };
      const res = yield call(inquireStores, parse(params));
      const { data, code } = res.data;
      if (code === '200') {
        const params2 = {
          merchantId,
        };
        const res2 = yield call(inquireBinds, parse(params2));
        const { data: data2, code: code2 } = res2.data;
        if (code2 === '200') {
          const shops = data || [];
          const map = getShopMap(shops, 'bohCode');
          setIsBind(data2 || [], map);
          yield put({
            type: 'updateState',
            payload: {
              shopData: shops,
              shopIdMap: map,
            },
          });
          yield put({
            type: 'showModal',
          });
        }
      }
    },
  },
});
