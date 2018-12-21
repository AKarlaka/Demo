/**
 * Created by zhangnaiying on 2018/08/31
 */
import React, { PropTypes } from 'react';
import { connect } from 'dva/index';

import List from '../components/BusinessApp/list';
import Search from '../components/BusinessApp/search';
import Modal from '../components/BusinessApp/modal';
import ShopModal from '../components/BusinessApp/shopModal';

const _ = require('lodash');

const BusinessApp = ({ dispatch, cloudState }) => {
  const {
    dataList,
    modalType,
    modalVisible,
    modalKey,
    currentItem,
    pagination,
    appId, // 暂存的应用ID
    tenantId, // 商户ID
    appList, // 所有应用列表
    appType, // 应用类型
    selectedRows,
    setOptionList, // 保存了设置弹框中的选项
    shopModalKey,
    shopModalVisible, // 用于二级弹窗“选择门店”的模态窗显示状态字段
    modalError,
    modalWarn,
    modalErrorValue,
    treeShopData,
    treeShopOption,
    shopIdArray,
    cacheCheckedKeys,
  } = cloudState.businessApp;
  const loading = cloudState.loading.effects;
  const searchProps = {
    selectedRows,
    // 删除
    onDelete(applicationId) {
      dispatch({
        type: 'businessApp/delete',
        payload: {
          tenantId,
          applicationId: applicationId.join(),
        },
      });
    },
    // 启用
    onEnable(applicationId) {
      dispatch({
        type: 'businessApp/onOff',
        payload: {
          tenantId,
          statusParam: '1',
          applicationId: applicationId.join(),
        },
      });
    },
    // 停用
    onDisable(applicationId) {
      dispatch({
        type: 'businessApp/onOff',
        payload: {
          tenantId,
          statusParam: '0',
          applicationId: applicationId.join(),
        },
      });
    },
    // 显示订购模态框
    onOrder() {
      dispatch({
        type: 'businessApp/queryApp',
        payload: {
          page: {
            pageno: 1,
            rowcount: 9999,
          },
        },
      });
      dispatch({
        type: 'businessApp/showModal',
        payload: {
          modalType: 'order',
        },
      });
    },
  };

  const listProps = {
    loading: loading['businessApp/query'],
    dataList,
    pagination,
    tenantId,
    selectedRows,
    // 修改到期时间
    onEditTime(record) {
      dispatch({
        type: 'businessApp/showModal',
        payload: {
          currentItem: record,
          modalType: 'update',
        },
      });
    },
    // 选中行
    onSelectRow(selectRow) {
      let selectedArray = selectedRows;
      if (selectRow instanceof Array) {
        selectedArray = selectRow;
      } else {
        selectedArray.push(selectRow);
      }
      dispatch({
        type: 'businessApp/updateState',
        payload: {
          selectedRows: selectedArray,
        },
      });
    },
    // 取消选中行
    onDelectRow(delectRow) {
      let selectedArray = selectedRows;
      if (delectRow instanceof Array) {
        selectedArray = [];
      } else {
        _.pull(selectedArray, delectRow);
      }
      dispatch({
        type: 'businessApp/updateState',
        payload: {
          selectedRows: selectedArray,
        },
      });
    },
    // 弹出设置模态框
    onEditSet(record) {
      dispatch({
        type: 'businessApp/querySetOpt',
        payload: {
          tenantId,
          applicationId: record.id,
          shopId: '',
          interfaceType: '0',
        },
      });
      dispatch({
        type: 'businessApp/showModal',
        payload: {
          modalType: 'set',
          currentItem: record,
        },
      });
    },
    onPageChange(page) {
      dispatch({
        type: 'businessApp/query',
        payload: {
          tenantId,
          pageno: page.current,
          rowcount: page.pageSize,
        },
      });
    },
  };

  // 判断模态框标题
  const judgeTitle = () => {
    if (modalType === 'order') {
      return '订购应用';
    } else if (modalType === 'set') {
      return '设置';
    } else if (modalType === 'update') {
      return '修改到期时间';
    }
    return '';
  };

  // 判断loading监听的方法
  const judgeLoading = () => {
    if (modalType === 'order') {
      return loading['businessApp/add'];
    } else if (modalType === 'set') {
      return loading['businessApp/editSet'];
    } else if (modalType === 'update') {
      return loading['businessApp/editTime'];
    }
    return false;
  };

  const modalProps = {
    loading: judgeLoading(),
    modalKey,
    modalType,
    modalVisible,
    title: judgeTitle(),
    item: modalType === 'order' ? {} : currentItem,
    appType,
    appList,
    setOptionList,
    treeShopOption,
    onConfirm(data) {
      if (modalType === 'update') { // 确认修改到期时间
        dispatch({
          type: 'businessApp/editTime',
          payload: {
            tenantId,
            deadLine: new Date(data.deadLine.valueOf()).Format('yyyy/MM/dd hh:mm:ss'),
            applicationId: currentItem.id,
          },
        });
      } else if (modalType === 'set') { // 确认修改设置
        if (Object.keys(data).length !== 0) {
          dispatch({
            type: 'businessApp/editSet',
            payload: {
              tenantId,
              applicationId: currentItem.id,
              packageEditionId: data.opts.key === '请选择' ? [] : [data.opts.key],
              versionEditionId: data.checks || [],
              interfaceType: '0',
            },
          });
        } else {
          dispatch({ type: 'businessApp/hideModal' });
        }
      } else if (modalType === 'order') { // 确认订购应用
        if (data.sellType === '按商户订购') {
          dispatch({
            type: 'businessApp/add',
            payload: {
              tenantId,
              applicationId: data.app,
              deadline: new Date(data.businessDeadLine.valueOf()).Format('yyyy/MM/dd hh:mm:ss'),
            },
          });
        } else if (data.sellType === '按门店订购') {
          dispatch({
            type: 'businessApp/add',
            payload: {
              tenantId,
              applicationId: data.app,
              deadline: new Date(data.shopDeadLine.valueOf()).Format('yyyy/MM/dd hh:mm:ss'),
              shopIds: shopIdArray,
            },
          });
        }
      }
    },
    onCancle() {
      dispatch({ type: 'businessApp/hideModal' });
      dispatch({ type: 'businessApp/clearShop' });
      dispatch({ type: 'businessApp/clearModal' });
    },
    // 订购门店弹窗选择应用后修改应用类型
    onSelectApp(app) {
      let content = '';
      const data = _.filter(appList, item => item.id === app);
      if (data.length > 0) {
        if (data[0].sellType === 1) {
          content = '按商户订购';
        } else {
          content = '按门店订购';
        }
      }
      dispatch({
        type: 'businessApp/updateState',
        payload: {
          appType: content,
          appId: app,
        },
      });
      dispatch({ type: 'businessApp/clearShop' });
    },
    onChooseShop() { // 修改门店弹窗
      dispatch({
        type: 'businessApp/updateState',
        payload: {
          cacheCheckedKeys: treeShopOption.checkedKeys,
        },
      });
      dispatch({
        type: 'businessApp/queryShop',
        payload: {
          appId,
          tenantId,
          orgTypes: [3, 4, 7].join(),
        },
      });
      dispatch({ type: 'businessApp/showShopModal' });
    },
  };

  const shopModalProps = {
    loading: loading['businessApp/queryShop'],
    shopModalKey,
    title: '选择门店',
    visible: shopModalVisible,
    modalWarn,
    modalErr: modalError,
    modalErrValue: modalErrorValue,
    treeShopData,
    treeShopOption,
    onOk() {
      // 提取包含shopid键值中的shopid为数组
      const cacheShopIdArray = [];
      const cacheArray = treeShopOption.checkedKeys;
      cacheArray.map((item) => {
        cacheShopIdArray.push(item.split('&')[0]);
        return null;
      });
      dispatch({
        type: 'businessApp/updateState',
        payload: {
          treeShopData: [],
          cacheCheckedKeys: treeShopOption.checkedKeys,
          shopIdArray: cacheShopIdArray,
        },
      });
      dispatch({
        type: 'businessApp/hideShopModal',
      });
    },
    onCancel() {
      dispatch({
        type: 'businessApp/hideShopModal',
      });
      dispatch({
        type: 'businessApp/updateState',
        payload: {
          treeShopData: [],
          modalError: false,
          modalErrorValue: null,
          treeShopOption: {
            ...treeShopOption,
            checkedKeys: cacheCheckedKeys,
          },
        },
      });
    },
    // 勾选门店
    onCheckShop(keys) {
      const cacheArray = keys.filter(item => item.includes('&'));
      dispatch({
        type: 'businessApp/updateState',
        payload: {
          treeShopOption: {
            ...treeShopOption,
            checkedKeys: cacheArray,
            selectedKeys: keys,
          },
        },
      });
    },
  };

  return (
    <div>
      <Search {...searchProps} />
      <List {...listProps} />
      <Modal {...modalProps} />
      <ShopModal {...shopModalProps} />
    </div>
  );
};

BusinessApp.propTypes = {
  cloudState: PropTypes.object,
  dispatch: PropTypes.func,
};

const mapStateToProps = cloudState => ({ cloudState });

export default connect(mapStateToProps)(BusinessApp);
