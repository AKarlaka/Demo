/**
 * Create by xiaochenghua on 2018/02/01
 * */
import modelExtend from 'dva-model-extend';
import { message } from 'antd';
import { parse } from 'qs';
import { routerRedux } from 'dva/router';
import { inquire, remove, enable, create, createAppRelation, inquireAppRelation } from '../services/appList';
import { pageModel } from './common';

export default modelExtend(pageModel, {
  namespace: 'appList',
  state: {
    name: '',
    id: '',
    viewPathId: '', // 图文编辑ID
    stopFlag: true,
    startFlag: true,
    removeFlag: true,
    modalType: 'create',
    modalKey: null,
    modalVisible: false,
    price: null,
    currentItem: {},
    defaultItem: {
      id: '',
      applicationName: '', // 名称
      applicationOrder: null, // 排序
      applicationIcon: '', // logo
      description: '', // 描述
      sellStrategy: 0, // 售卖策略（0免费；1付费）
      sellType: 0, // 售卖方式（0按店销售；1按商户销售)
      redirectDomain: '', // 回调域名
      // 订购流程优化时删除以下字段
      // price: null, // 售价
      // verifyStrategy: 0, // 审核机制（0需要审核；1不用审核）
      // authType: 1, // 授权方式 （0永久；1按时长）
      // authDuration: [1, 3, 6, 12, 24], // 授权时长选项'1,3,6,12,24'(单位：月) 付费 默认全选
    },

    // 订购流程优化时删除以下字段
    // sellStrategy: 0, // 售卖策略（0免费；1付费）
    // sellType: 0, // 售卖方式（0按店销售；1按商户销售)
    // authType: 1, // 授权方式 （0永久；1按时长）
    // freeDuration: -1, // 免费时长 单位天 -1永久
    // freeDays: -1, // 自定义属性用于免费时长区分自定义与其他
    // myPrice: 0, // 自定义属性用于售价区分自定义与面议

    selectedItem: [], // 选中的商户
    selectedItemsId: [], // 选中商户的id
    selectedStop: [], // 可选停用的id
    selectedStart: [], // 可选启用的id
    previewVisible: false,
    iconFlag: '',
    fileList: [],
    relationVisible: false, // 应用关系弹窗visible
    preApps: [],  // 前置应用
    mutexApps: [], // 互斥应用
    appTreeData: [], // 应用关系应用列表
    relationLoading: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/app/list') {
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
    // 获取应用列表
    * query({ payload }, { call, put }) {
      const res = yield call(inquire, parse(payload));
      const { code, data, page } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            dataList: data || [],
            pagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: page.total,
              current: page.pageno,
              showTotal: total => `共 ${total} 条`,
              pageSize: page.rowcount,
              pageSizeOptions: ['10', '20', '50', '100'],
            },
            viewPath: '',
            appTreeData: data.map(e =>
              ({ label: e.applicationName, value: e.id, key: e.id })),
          },
        });
      }
    },
    // 新增，编辑
    * save({ payload }, { put, call }) {
      const res = yield call(create, parse(payload));
      const { code } = res.data;
      if (code === '200') {
        message.success('保存成功！');
        yield put({
          type: 'querySuccess',
          payload: {
            modalVisible: false,
            sellStrategy: 0,
            sellType: 0,
            fileList: [],

            // 订购流程优化时删除以下字段
            // verifyStrategy: 0,
            // authType: 1,
            // authDuration: [1, 3, 6, 12, 24],
            // freeDuration: -1,
          },
        });
        yield put({
          type: 'query',
          payload: {
            page: {
              pageno: 1, // 查看第几页内容 默认1
              rowcount: 10, // 一页展示条数 默认10
            },
          },
        });
      }
    },
    // 根据选项判断哪些按钮可用
    * editStatus({ payload }, { put, select }) {
      const { selectedItem } = yield select(state => state.appList);
      const startArray = [];      // 启用按钮数组
      const blockArray = [];      //  停用按钮数组
      const judgeStartArray = selectedItem.filter(item => item.status === 1);
      const judgeBlockArray = selectedItem.filter(item => item.status === 0);
      judgeStartArray.forEach((item) => {
        startArray.push(item.id);
        return false;
      });
      judgeBlockArray.forEach((item) => {
        blockArray.push(item.id);
        return false;
      });
      yield put({
        type: 'updateState',
        payload: {
          removeFlag: !(selectedItem.length > 0),
          startFlag: (judgeStartArray.length === selectedItem.length),
          stopFlag: (judgeBlockArray.length === selectedItem.length),
          selectedStop: startArray, // 选中可停用员工id
          selectedStart: blockArray, // 选中可启用员工id
        },
      });
    },
    // 删除应用
    * delete({ payload }, { put, select, call }) {
      const appList = yield select(state => state.appList);
      const name = appList.name;
      const current = appList.pagination.current;
      const res = yield call(remove, parse(payload));
      const { code } = res.data;
      if (code === '200') {
        message.success('删除成功！');
        yield put({
          type: 'querySuccess',
        });
        yield put({
          type: 'query',
          payload: {
            page: {
              pageno: current, // 查看第几页内容 默认1
              rowcount: 10, // 一页展示条数 默认10
            },
            key: name, // 删除后附带查询信息再次查询出列表
            status: null,
          },
        });
      }
    },
    // 停用/启用状态变化
    * onOff({ payload }, { put, select, call }) {
      const name = yield select(state => state.appList.name);
      const current = yield select(state => state.appList.pagination.current);
      const res = yield call(enable, parse(payload));
      const { code } = res.data;
      if (code === '200') {
        message.success('操作成功！');
        yield put({
          type: 'querySuccess',
        });
        yield put({
          type: 'query',
          payload: {
            page: {
              pageno: current, // 查看第几页内容 默认1
              rowcount: 10, // 一页展示条数 默认10
            },
            key: name, // 删除后附带查询信息再次查询出列表
            status: null,
          },
        });
      }
    },
    // 跳转图文编辑
    * viewPath({ payload }, { put }) {
      const path = `/app/detail/${payload.viewPathId}`;// 无冒号
      yield put(routerRedux.push(path));
    },
    // 查询应用关系
    * queryAppRelation({ payload }, { put, call }) {
      yield put({
        type: 'updateState',
        payload: {
          relationLoading: true,
        },
      });
      const res = yield call(inquireAppRelation, parse(payload));
      const { code, data } = res.data;
      if (code === '200') {
        yield put({
          type: 'updateState',
          payload: {
            preApps: data.preApps,
            mutexApps: data.mutexApps,
          },
        });
      }
      yield put({
        type: 'updateState',
        payload: {
          relationLoading: false,
        },
      });
    },
    // 新增、修改应用关系
    * editRelation({ payload }, { put, call }) {
      yield put({
        type: 'updateState',
        payload: {
          relationLoading: true,
        },
      });
      const res = yield call(createAppRelation, parse(payload));
      const { code } = res.data;
      if (code === '200') {
        yield put({
          type: 'updateState',
          payload: {
            id: '',
            relationVisible: false,
            preApps: [],
            mutexApps: [],
          },
        });
      }
      yield put({
        type: 'updateState',
        payload: {
          relationLoading: false,
        },
      });
    },
  },
});
