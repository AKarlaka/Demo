/**
 * Create by liukang on 2018/03/06
 * */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import Search from '../../components/Payment/PayChannel/search';
import List from '../../components/Payment/PayChannel/list';
import Modal from '../../components/Payment/PayChannel/modal';

import { Payment } from '../../utils/enums';

const { State } = Payment;

function PayChannel({ dispatch, payChannel, loading }) {
  const {
    dataList,
    pagination,
    selectedRows,
    selectedStarts,
    selectedBlocks,
    startBtnStatus,
    blockBtnStatus,
    searchInfo,
    searchData,
    modalVisible,
    item,
    aggregator,
    isv,
    modalKey,
} = payChannel;
  const searchProps = {
    searchInfo,
    selectedRows,
    selectedStarts,
    selectedBlocks,
    startBtnStatus,
    blockBtnStatus,
    // 停用
    onBlock() {
      dispatch({
        type: 'payChannel/onOff',
        payload: {
          enable: State.DISABLED,
          ids: selectedStarts.map(it => it.id),
        },
      });
      dispatch({
        type: 'payChannel/updateState',
        payload: {
          selectedRows: [],
          selectedStarts: [],
          selectedBlocks: [],
          startBtnStatus: true,
          blockBtnStatus: true,
        },
      });
    },
    // 启用
    onStart() {
      dispatch({
        type: 'payChannel/onOff',
        payload: {
          enable: State.ENABLE,
          ids: selectedBlocks.map(it => it.id),
        },
      });
      dispatch({
        type: 'payChannel/updateState',
        payload: {
          selectedRows: [],
          selectedStarts: [],
          selectedBlocks: [],
          startBtnStatus: true,
          blockBtnStatus: true,
        },
      });
    },
    // 搜索输入
    onSearchChange(e) {
      const value = e.target.value;
      dispatch({
        type: 'payChannel/updateState',
        payload: {
          searchInfo: value,
        },
      });
    },
    // 搜索按钮
    onSearch() {
      dispatch({
        type: 'payChannel/query',
        payload: {
          current: 1,
          keyword: searchInfo,
        },
      });
      dispatch({
        type: 'payChannel/updateState',
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
        type: 'payChannel/updateState',
        payload: {
          searchInfo: '',
          searchData: {
            ...searchData,
            keyword: '',
          },
        },
      });
      dispatch({
        type: 'payChannel/query',
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
    selectedRows,
    loading: loading.effects['payChannel/query'],
    // 打开编辑窗口
    onEidt(rows) {
      dispatch({
        type: 'payChannel/showModal',
        payload: {
          item: rows,
        },
      });
      dispatch({
        type: 'payChannel/queryAggregators',
        payload: {
          code: rows.code,
        },
      });
      dispatch({
        type: 'payChannel/queryIsv',
      });
    },
    // 选择table复选框
    onSelect(rows) {
      const starts = rows.filter(item1 => item1.state === '1');
      const blocks = rows.filter(item1 => item1.state === '0');
      dispatch({
        type: 'payChannel/updateState',
        payload: {
          selectedRows: rows,
        },
      });
      dispatch({
        type: 'payChannel/updateState',
        payload: {
          selectedStarts: starts,
          selectedBlocks: blocks,
          startBtnStatus: !blocks.length,
          blockBtnStatus: !starts.length,
        },
      });
    },
    // 改变分页信息
    onChange({ current, pageSize }) {
      dispatch({
        type: 'payChannel/query',
        payload: {
          current,
          size: pageSize,
          keyword: searchData.keyword || '',
        },
      });
    },
  };
  const modalProps = {
    item,
    aggregator,
    isv,
    key: modalKey,
    visible: modalVisible,
    // 确定
    onConfirm(data) {
      dispatch({
        type: 'payChannel/edit',
        payload: data,
      });
    },
    // 取消
    onCancel() {
      dispatch({
        type: 'payChannel/hideModal',
        payload: {
          modalVisiable: false,
          item: {},
        },
      });
    },
    // 表单变更
    onItemChange(e, key) {
      dispatch({
        type: 'payChannel/updateState',
        payload: {
          item: {
            ...item,
            [key]: e,
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

PayChannel.propTypes = {
  dispatch: PropTypes.func,
  payChannel: PropTypes.object,
  loading: PropTypes.object,
};

export default connect(({ payChannel, loading }) => ({ payChannel, loading }))(PayChannel);
