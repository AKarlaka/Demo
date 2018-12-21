/**
 * Create by liukang on 2018/03/06
 * */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import Search from '../../components/Payment/Aggregater/search';
import List from '../../components/Payment/Aggregater/list';
import Modal from '../../components/Payment/Aggregater/modal';

function Aggregator({ dispatch, aggregator, loading }) {
  const {
    dataList,
    pagination,
    searchInfo,
    searchData,
    modalVisible,
    modalKey,
    item,
    channel } = aggregator;
  const searchProps = {
    searchInfo,
    // 搜索输入
    onSearchChange(e) {
      const value = e.target.value;
      dispatch({
        type: 'aggregator/updateState',
        payload: {
          searchInfo: value,
        },
      });
    },
    // 搜索按钮
    onSearch() {
      dispatch({
        type: 'aggregator/query',
        payload: {
          current: 1,
          keyword: searchInfo,
        },
      });
      dispatch({
        type: 'aggregator/updateState',
        payload: {
          searchData: {
            ...searchData,
            keyword: searchInfo,
          },
        },
      });
    },
    // 清空搜索框
    onClearSearchInfo() {
      dispatch({
        type: 'aggregator/updateState',
        payload: {
          searchInfo: '',
          searchData: {
            ...searchData,
            keyword: '',
          },
        },
      });
      dispatch({
        type: 'aggregator/query',
        payload: {
          current: 1,
          keyword: '',
        },
      });
    },
  };
  const listProps = {
    dataSource: dataList,
    pagination,
    loading: loading.effects['aggregator/query'],
    // 编辑
    onEidt(rows) {
      dispatch({
        type: 'aggregator/showModal',
        payload: {
          item: rows,
        },
      });
      dispatch({
        type: 'aggregator/queryChannel',
        payload: {
          item: rows,
        },
      });
    },
    // 页码变更
    onChange({ current, pageSize }) {
      dispatch({
        type: 'aggregator/query',
        payload: {
          current,
          size: pageSize,
          keyword: searchData.keyword || '',
        },
      });
    },
  };
  const modalProps = {
    key: modalKey,
    item,
    channel,
    visible: modalVisible,
    // 确认
    onConfirm(data) {
      dispatch({
        type: 'aggregator/edit',
        payload: data,
      });
    },
    // 取消
    onCancel() {
      dispatch({
        type: 'aggregator/hideModal',
        payload: {
          modalVisiable: false,
          item: {},
        },
      });
    },
    // 点击渠道复选框
    onChannelChange(e) {
      dispatch({
        type: 'aggregator/updateState',
        payload: {
          modalVisiable: false,
          item: {
            ...item,
            channels: e,
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
    </div>
  );
}

Aggregator.propTypes = {
  dispatch: PropTypes.func,
  aggregator: PropTypes.object,
  loading: PropTypes.object,
};

export default connect(({ aggregator, loading }) => ({ aggregator, loading }))(Aggregator);
