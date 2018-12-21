/**
 * Created by zhangnaiying on 2018/09/02
 */
import React, { PropTypes } from 'react';
import { connect } from 'dva/index';
import { message } from 'antd';

import Header from '../components/BusinessAppShop/header';
import List from '../components/BusinessAppShop/list';
import Search from '../components/BusinessAppShop/search';
import Modal from '../components/BusinessAppShop/modal';

const _ = require('lodash');

const resolve = _.partial(_.map, _, 'shopId');

const BusinessAppShop = ({ dispatch, cloudState }) => {
  const {
    tenantId,
    applicationId,
    dataList,
    modalType,
    modalVisible,
    modalKey,
    canOpenTimePicker,
    currentItem,
    pagination,
    selectedRows,
    setOptionList,
    queryEditionsList,
    deadLineInfo,
    appInfo,
    query,
    btnSelectedStatus,
  } = cloudState.businessAppShop;
  const loading = cloudState.loading.effects;

  const headerProps = {
    deadLineInfo,
    appInfo,
    btnSelectedStatus,
    onSearch(index, data) {
      let appStatusQuery = query.appStatusQuery;
      let storeTimeStatus = query.storeTimeStatus;
      switch (data) {
        case '停用':
          appStatusQuery = '0';
          break;
        case '正常':
          appStatusQuery = '1';
          break;
        default:
          storeTimeStatus = data;
          break;
      }
      let btnSelectedChange = btnSelectedStatus;
      btnSelectedChange = _.fill(btnSelectedStatus, false);
      btnSelectedChange = _.fill(btnSelectedStatus, true, index, index + 1);
      dispatch({
        type: 'businessAppShop/updateState',
        payload: {
          btnSelectedStatus: btnSelectedChange,
          query: {
            ...query,
            storeTimeStatus,
            appStatusQuery,
          },
        },
      });
      dispatch({
        type: 'businessAppShop/query',
        payload: {
          tenantId,
          applicationId,
          pageno: 1,
          rowcount: 10,
          ...query,
          appStatusQuery,
          storeTimeStatus,
        },
      });
    },
  };

  const searchProps = {
    loading,
    selectedRows,
    queryEditionsList,
    canOpenTimePicker,
    query,
    onTimeFocus(status) {
      if (!status) {
        message.warning('请选择到期日期！');
      }
      dispatch({
        type: 'businessAppShop/updateState',
        payload: {
          canOpenTimePicker: status,
        },
      });
    },
    // 设置弹窗
    onSetting() {
      dispatch({
        type: 'businessAppShop/showModal',
        payload: {
          modalType: 'set',
        },
      });
      dispatch({
        type: 'businessAppShop/querySetOpt',
        payload: {
          tenantId,
          applicationId,
          shopId: resolve(selectedRows).join(),
          interfaceType: '1',
        },
      });
    },
    // 修改日期弹窗
    onUpdateTime() {
      dispatch({
        type: 'businessAppShop/showModal',
        payload: {
          modalType: 'updateAll',
        },
      });
    },
    // 停用
    onDisable(shopId) {
      dispatch({
        type: 'businessAppShop/onOff',
        payload: {
          tenantId,
          applicationId,
          shopId: shopId.join(),
          status: '0',
        },
      });
    },
    // 启用
    onEnable(shopId) {
      dispatch({
        type: 'businessAppShop/onOff',
        payload: {
          tenantId,
          applicationId,
          shopId: shopId.join(),
          status: '1',
        },
      });
    },
    onSearch(option) {
      if (option) {
        dispatch({
          type: 'businessAppShop/updateState',
          payload: {
            query: {
              ...query,
              ...option,
              deadLineQuery:
                option.deadLineQuery // eslint-disable-line
                ? (option.deadLineTimeQuery
                  ? `${new Date(option.deadLineQuery.valueOf()).Format('yyyy/MM/dd')} ${new Date(option.deadLineTimeQuery.valueOf()).Format('hh:mm:ss')}`
                  : new Date(option.deadLineQuery.valueOf()).Format('yyyy/MM/dd')
                )
                : null,
              dateFlag: option.deadLineTimeQuery ? '1' : '0',
            },
          },
        });
        dispatch({
          type: 'businessAppShop/query',
          payload: {
            tenantId,
            applicationId,
            pageno: 1,
            rowcount: 10,
            ...query,
            ...option,
            deadLineQuery:
              option.deadLineQuery // eslint-disable-line
              ? (option.deadLineTimeQuery
                ? `${new Date(option.deadLineQuery.valueOf()).Format('yyyy/MM/dd')} ${new Date(option.deadLineTimeQuery.valueOf()).Format('hh:mm:ss')}`
                : new Date(option.deadLineQuery.valueOf()).Format('yyyy/MM/dd')
              )
              : null,
            dateFlag: option.deadLineTimeQuery ? '1' : '0',
          },
        });
      } else {
        dispatch({
          type: 'businessAppShop/updateState',
          payload: {
            btnSelectedStatus: [true, false, false, false, false, false, false],
            query: {
              deadLineQuery: null,
              appStatusQuery: null,
              editionId: null,
              storeTimeStatus: null,
            },
          },
        });
        dispatch({
          type: 'businessAppShop/query',
          payload: {
            tenantId,
            applicationId,
            pageno: 1,
            rowcount: 10,
            deadLineQuery: null,
            appStatusQuery: null,
            editionId: null,
            storeTimeStatus: null,
          },
        });
      }
    },
  };

  const listProps = {
    loading: loading['businessAppShop/query'],
    dataList,
    pagination,
    selectedRows,
    onSelectRow(selectRow) {
      let selectedArray = selectedRows;
      if (selectRow instanceof Array) {
        selectedArray = selectRow;
      } else {
        selectedArray.push(selectRow);
      }
      dispatch({
        type: 'businessAppShop/updateState',
        payload: {
          selectedRows: selectedArray,
        },
      });
    },
    onDelectRow(delectRow) {
      let selectedArray = selectedRows;
      if (delectRow instanceof Array) {
        selectedArray = [];
      } else {
        _.pull(selectedArray, delectRow);
      }
      dispatch({
        type: 'businessAppShop/updateState',
        payload: {
          selectedRows: selectedArray,
        },
      });
    },
    onEditTime(record) { // 修改到期时间
      dispatch({
        type: 'businessAppShop/showModal',
        payload: {
          modalType: 'update',
          currentItem: record,
        },
      });
    },
    onPageChange(page) {
      dispatch({
        type: 'businessAppShop/query',
        payload: {
          tenantId,
          applicationId,
          pageno: page.current,
          rowcount: page.pageSize,
          ...query,
        },
      });
    },
  };

  const modalProps = {
    title: modalType === 'set' ? '设置' : '修改到期时间',
    modalType,
    modalVisible,
    item: modalType === 'update' ? currentItem : {},
    setOptionList,
    modalKey,
    onConfirm(data) {
      if (modalType === 'update') { // 单条修改到期时间
        dispatch({
          type: 'businessAppShop/editTime',
          payload: {
            tenantId,
            applicationId,
            deadLine: new Date(data.deadLine.valueOf()).Format('yyyy/MM/dd hh:mm:ss'),
            shopId: currentItem.shopId,
          },
        });
      } else if (modalType === 'updateAll') { // 批量修改到期时间
        dispatch({
          type: 'businessAppShop/editTime',
          payload: {
            tenantId,
            applicationId,
            deadLine: new Date(data.deadLine.valueOf()).Format('yyyy/MM/dd hh:mm:ss'),
            shopId: resolve(selectedRows).join(),
          },
        });
      } else if (modalType === 'set') { // 设置
        if (Object.keys(data).length !== 0) {
          dispatch({
            type: 'businessAppShop/editSet',
            payload: {
              tenantId,
              applicationId,
              packageEditionId: data.opts.key === '请选择' ? [] : [data.opts.key],
              versionEditionId: data.checks ? data.checks : [],
              shopId: resolve(selectedRows),
              interfaceType: '1',
            },
          });
        } else { // 暂无配置的情况
          dispatch({ type: 'businessAppShop/hideModal' });
        }
      }
    },
    onCancle() {
      dispatch({
        type: 'businessAppShop/updateState',
        payload: {
          modalType: '',
          setOptionList: [],
        },
      });
      dispatch({ type: 'businessAppShop/hideModal' });
    },
  };

  return (
    <div>
      <Header {...headerProps} />
      <Search {...searchProps} />
      <List {...listProps} />
      <Modal {...modalProps} />
    </div>
  );
};

BusinessAppShop.propTypes = {
  cloudState: PropTypes.object,
  dispatch: PropTypes.func,
};

const mapStateToProps = cloudState => ({ cloudState });

export default connect(mapStateToProps)(BusinessAppShop);
