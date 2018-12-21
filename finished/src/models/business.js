import modelExtend from 'dva-model-extend';
import { message } from 'antd';
import { parse } from 'qs';
import { remove, enable, inquireDetail, inquire, update, updateJar } from '../services/business';
import { inquireProvince, inquireAreaById } from '../services/common';
import { pageModel } from './common';

export default modelExtend(pageModel, {
  namespace: 'business',
  state: {
    modalKey: null,
    tenantId: null, // 商户id
    title: null, // 模态框头
    modalVisible: false, // 模态框显示
    previewVisible: false,
    checkedBussiness: [], // 选中商户
    checkedBussinessId: [], // 选中商户id
    checkedBussinessStartId: [], // 选中可停用商户id
    checkedBussinessBlockId: [], // 选中可启用商户id
    deleteBtnStatus: true, // 删除按钮禁用状态
    startBtnStatus: true,  // 启用按钮禁用状态
    blockBtnStatus: true,  // 停用按钮禁用状态
    status: '',     // 状态
    tenProvinceList: [], // 省列表
    tenCityList: [],     // 城市列表
    tenDistrictList: [], // 区县列表
    tenProvince: '', // 省
    tenCity: '',     // 城市
    tenDistrict: '', // 区县
    searchInfo: '', // 搜索信息
    fileList: [], // 图片
    braLogo: '',
    braName: '',
    tenName: '',
    superName: '',
    superMobile: '',
    tenDistrictName: '',
    tenProvinceName: '',
    tenCityName: '',
    tenAddress: '',
    tenEmail: '',
    previewImgUrl: '',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/business') {
          // dispatch({
          //   type: 'query',
          //   payload: {
          //     page: {
          //       pageno: 1, // 查看第几页内容 默认1
          //       rowcount: 10, // 一页展示条数 默认10
          //     },
          //     key: null,
          //     status: null,
          //   },
          // });
          dispatch({
            type: 'reSearch',
            payload: 'business',
          });
        }
      });
    },
  },
  effects: {
    // 获取商户列表
    * query({ payload }, { call, put }) {
      const res = yield call(inquire, parse(payload));
      const { data, code, page } = res.data;
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
          },
        });
      }
    },
    // 删除商户
    * delete({ payload }, { call, put, select }) {
      const searchInfo = yield select(state => state.business.searchInfo);
      const current = yield select(state => state.business.pagination.current);
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
            key: searchInfo, // 删除后附带查询信息再次查询出列表
            status: null,
          },
        });
      }
    },
    // 启用停用
    * onOff({ payload }, { call, put, select }) {
      const searchInfo = yield select(state => state.business.searchInfo);
      const current = yield select(state => state.business.pagination.current);
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
            key: searchInfo, // 停用启用后附带查询信息再次查询出列表
            status: null,
          },
        });
      }
    },
    // 新增编辑
    * save({ payload }, { call, put }) {
      const res = yield call(update, parse(payload));
      const { code } = res.data;
      if (code === '200') {
        message.success('保存成功！');
        yield put({
          type: 'querySuccess',
          payload: { // 保存成功之后清空state中各项数据
            fileList: [],
            braName: '',
            tenName: '',
            superName: '',
            superMobile: '',
            tenDistrictName: '',
            tenProvinceName: '',
            tenCityName: '',
            tenAddress: '',
            tenEmail: '',
            id: '',
            modalVisible: false,
            tenProvinceList: [], // 省列表
            tenCityList: [],     // 城市列表
            tenDistrictList: [], // 区县列表
          },
        });
        yield put({ type: 'reload' });
      }
    },

    // 获取商户详细信息
    * queryDetail({ payload }, { call, put }) {
      const res = yield call(inquireDetail, parse(payload));
      const { data, code } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            braLogo: data.braLogo,
            braName: data.braName,
            tenName: data.tenName,
            superName: data.superName,
            superMobile: data.superMobile,
            tenDistrictName: data.tenDistrictName,
            tenProvinceName: data.tenProvinceName,
            tenCityName: data.tenCityName,
            tenDistrict: data.tenDistrict,
            tenProvince: data.tenProvince,
            tenCity: data.tenCity,
            tenAddress: data.tenAddress,
            tenEmail: data.tenEmail,
            status: data.status,
          },
        });
        yield put({
          type: 'setFileList',
          fileList: data.braLogo ? [{
            uid: -1,
            status: 'done',
            url: data.braLogo,
          }] : [],
        });
        // 获取市
        if (data.tenProvince) {
          yield put({
            type: 'queryAreaById',
            payload: {
              flag: 'provinceClick',
              parentId: data.tenProvince,
            },
          });
        }
        // 获取区
        if (data.tenCity) {
          yield put({
            type: 'queryAreaById',
            payload: {
              flag: 'cityClick',
              parentId: data.tenCity,
            },
          });
        }
      }
    },
    // 获取省信息
    * queryProvince({ payload }, { call, put }) {
      const res = yield call(inquireProvince);
      const { data, code } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            tenProvinceList: data || [],
          },
        });
      }
    },

    // 获取地区下一级
    * queryAreaById({ payload }, { call, put }) {
      const flag = payload.flag;
      const reqParams = {
        parentId: payload.parentId,
      };
      const res = yield call(inquireAreaById, parse(reqParams));
      const { data, code } = res.data;
      if (flag === 'provinceClick') {
        if (code === '200') {
          yield put({
            type: 'querySuccess',
            payload: {
              tenCityList: data || [],
            },
          });
        }
      } else if (flag === 'cityClick') {
        if (code === '200') {
          yield put({
            type: 'querySuccess',
            payload: {
              tenDistrictList: data || [],
            },
          });
        }
      }
    },
    // 重载页面
    * reload({ payload }, { put, select }) {
      const business = yield select(state => state.business);
      yield put({
        type: 'query',
        payload: {
          page: {
            pageno: business.pagination.current, // 查看第几页内容 默认1
            rowcount: business.pagination.pageSize, // 一页展示条数 默认10
          },
          key: business.searchInfo,
          status: business.status,
        },
      });
    },

    // 判断状态
    * judgeStatus({ payload }, { put, select }) {
      const { checkedBussiness } = yield select(state => state.business);
      const startArray = [];      // 启用按钮数组
      const blockArray = [];      //  停用按钮数组
      const judgeStartArray = checkedBussiness.filter(item => item.status === 1);
      const judgeBlockArray = checkedBussiness.filter(item => item.status === 0);
      judgeStartArray.map((item) => {
        startArray.push(item.id);
        return false;
      });
      judgeBlockArray.map((item) => {
        blockArray.push(item.id);
        return false;
      });
      yield put({
        type: 'updateState',
        payload: {
          deleteBtnStatus: !((checkedBussiness.length > 0)),
          startBtnStatus: (judgeStartArray.length === checkedBussiness.length),
          blockBtnStatus: (judgeBlockArray.length === checkedBussiness.length),
          checkedBussinessStartId: startArray, // 选中可停用员工id
          checkedBussinessBlockId: blockArray, // 选中可启用员工id
        },
      });
    },
    // 重置jar包
    * editJar({ payload }, { put, call }) {
      const res = yield call(updateJar, payload);
      const { code } = res.data;
      if (code === '200') {
        yield put({ type: 'reload' });
        message.success('重置成功！');
      }
    },
  },
  reducers: {
    setFileList(state, action) {
      return {
        ...state,
        fileList: action.fileList,
      };
    },
  },
});

