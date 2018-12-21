/**
 * Created by zhangnaiying on 2018/09/03
 */
import React, { PropTypes } from 'react';
import { connect } from 'dva/index';

import Search from '../components/AppExpire/search';
import List from '../components/AppExpire/list';
import Modal from '../components/AppExpire/modal';

const _ = require('lodash');

const AppExpire = ({ dispatch, cloudState }) => {
  const {
    query,
    dataList,
    modalVisible,
    modalKey,
    currentItem,
    pagination,
    shopDataList,
    shopPagination,
    appInfo,
    deadLineInfo,
    queryShopInfo,
    btnSelectedStatus,
  } = cloudState.appExpire;
  const loading = cloudState.loading.effects;

  const searchProps = {
    loading,
    onSearch(data) {
      dispatch({
        type: 'appExpire/updateState',
        payload: {
          query: {
            tenantName: data ? data.tenantName : null,
            overdueType: data ? data.overdueType : null,
          },
        },
      });
      dispatch({
        type: 'appExpire/query',
        payload: {
          pageno: 1,
          rowcount: 10,
          tenantName: data ? data.tenantName : null,
          overdueType: data ? data.overdueType : null,
        },
      });
    },
  };

  const listProps = {
    loading: loading['appExpire/query'],
    dataList,
    pagination,
    onPageChange(page) {
      dispatch({
        type: 'appExpire/query',
        payload: {
          pageno: page.current,
          rowcount: page.pageSize,
          ...query,
        },
      });
    },
    onDetail(record) {
      dispatch({
        type: 'appExpire/queryShopExpireInfo',
        payload: {
          tenantId: record.tenantId,
          applicationId: record.applicationId,
          pageno: 1,
          rowcount: 10,
        },
      });
      dispatch({
        type: 'appExpire/queryAppInfo',
        payload: {
          appId: record.applicationId,
        },
      });
      dispatch({
        type: 'appExpire/queryDeadLineInfo',
        payload: {
          tenantId: record.tenantId,
          applicationId: record.applicationId,
        },
      });
      dispatch({ type: 'appExpire/showModal' });
      dispatch({
        type: 'appExpire/updateState',
        payload: {
          currentItem: record,
        },
      });
    },

  };

  const modalProps = {
    loading: loading['appExpire/queryShopExpireInfo'],
    title: '查看详情',
    modalVisible,
    currentItem,
    shopDataList,
    shopPagination,
    appInfo,
    deadLineInfo,
    queryShopInfo,
    btnSelectedStatus,
    modalKey,
    onCancle() {
      dispatch({ type: 'appExpire/hideModal' });
    },
    onStatusChange(index, value) {
      let appShopStatus = null;
      let overdueType = null;
      switch (value) {
        case '停用':
          appShopStatus = '0';
          break;
        case '正常':
          appShopStatus = '1';
          break;
        default:
          overdueType = value;
          break;
      }
      let btnSelectedChange = btnSelectedStatus;
      btnSelectedChange = _.fill(btnSelectedStatus, false);
      btnSelectedChange = _.fill(btnSelectedStatus, true, index, index + 1);
      dispatch({
        type: 'appExpire/updateState',
        payload: {
          btnSelectedStatus: btnSelectedChange,
          queryShopInfo: {
            ...queryShopInfo,
            overdueType,
            appShopStatus,
          },
        },
      });
      dispatch({
        type: 'appExpire/queryShopExpireInfo',
        payload: {
          pageno: 1,
          rowcount: 10,
          tenantId: currentItem.tenantId,
          applicationId: currentItem.applicationId,
          ...queryShopInfo,
          overdueType,
          appShopStatus,
        },
      });
    },
    onSearch(value) {
      if (value) {
        dispatch({
          type: 'appExpire/updateState',
          payload: {
            queryShopInfo: {
              ...queryShopInfo,
              ...value,
            },
          },
        });
        dispatch({
          type: 'appExpire/queryShopExpireInfo',
          payload: {
            pageno: 1,
            rowcount: 10,
            tenantId: currentItem.tenantId,
            applicationId: currentItem.applicationId,
            ...queryShopInfo,
            ...value,
          },
        });
      } else {
        dispatch({
          type: 'appExpire/updateState',
          payload: {
            btnSelectedStatus: [true, false, false, false, false, false, false],
            queryShopInfo: {
              shopName: null,
              overdueType: null,
            },
          },
        });
        dispatch({
          type: 'appExpire/queryShopExpireInfo',
          payload: {
            pageno: 1,
            rowcount: 10,
            tenantId: currentItem.tenantId,
            applicationId: currentItem.applicationId,
            shopName: null,
            overdueType: null,
          },
        });
      }
    },
    onPageChange(page) {
      dispatch({
        type: 'appExpire/queryShopExpireInfo',
        payload: {
          tenantId: currentItem.tenantId,
          applicationId: currentItem.applicationId,
          pageno: page.current,
          rowcount: page.pageSize,
          ...queryShopInfo,
        },
      });
    },
  };

  return (
    <div>
      <Search {...searchProps} />
      <List {...listProps} />
      <Modal {...modalProps} />
    </div>
  );
};

AppExpire.propTypes = {
  cloudState: PropTypes.object,
  dispatch: PropTypes.func,
};

const mapStateToProps = cloudState => ({ cloudState });

export default connect(mapStateToProps)(AppExpire);
