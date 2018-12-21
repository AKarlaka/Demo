/**
 * Create by liukang on 2018/03/06
 * */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Payment } from '../../utils/enums';

import Search from '../../components/Payment/ReceiptAccount/search';
import List from '../../components/Payment/ReceiptAccount/list';
import Modal from '../../components/Payment/ReceiptAccount/modal';

const { State } = Payment;

function ReceiptAccount({ dispatch, receiptAccount, loading }) {
  const {
    dataList,
    pagination,
    selectedRows,
    searchInfo,
    modalVisible,
    item,
    modalKey,
    merchantId,
    selectedStarts,
    selectedBlocks,
    startBtnStatus,
    blockBtnStatus,
    deleteBtnStatus,
    searchData,
    } = receiptAccount;
  const searchProps = {
    searchInfo,
    selectedRows,
    selectedStarts,
    selectedBlocks,
    startBtnStatus,
    blockBtnStatus,
    deleteBtnStatus,
    // 添加
    onAdd() {
      dispatch({
        type: 'receiptAccount/showModal',
        payload: {
          item: {},
        },
      });
    },
    // 删除
    onDelete() {
      dispatch({
        type: 'receiptAccount/delete',
        payload: selectedRows.map(it => it.id),
      });
    },
    // 停用
    onBlock() {
      dispatch({
        type: 'receiptAccount/onOff',
        payload: {
          enable: State.DISABLED,
          ids: selectedRows.map(it => it.id),
        },
      });
    },
    // 启用
    onStart() {
      dispatch({
        type: 'receiptAccount/onOff',
        payload: {
          enable: State.ENABLE,
          ids: selectedRows.map(it => it.id),
        },
      });
    },
    // 搜索输入
    onSearchChange(e) {
      const value = e.target.value;
      dispatch({
        type: 'receiptAccount/updateState',
        payload: {
          searchInfo: value,
        },
      });
    },
    // 搜索按钮
    onSearch() {
      dispatch({
        type: 'receiptAccount/query',
        payload: {
          current: 1,
          merchantId,
          keyword: searchInfo,
        },
      });
      dispatch({
        type: 'receiptAccount/updateState',
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
        type: 'receiptAccount/updateState',
        payload: {
          searchInfo: '',
          searchData: {
            ...searchData,
            keyword: '',
          },
        },
      });
      dispatch({
        type: 'receiptAccount/query',
        payload: {
          current: 1,
          keyword: '',
          merchantId,
        },
      });
    },
  };
  const listProps = {
    dataSource: dataList,
    pagination,
    selectedRows,
    loading: loading.effects['receiptAccount/query'],
    // 编辑
    onEidt(rows) {
      dispatch({
        type: 'receiptAccount/showModal',
        payload: {
          item: rows,
        },
      });
    },
    // table复选框
    onSelect(rows) {
      const starts = rows.filter(item1 => item1.state === '1');
      const blocks = rows.filter(item1 => item1.state === '0');
      dispatch({
        type: 'receiptAccount/updateState',
        payload: {
          selectedRows: rows,
          selectedStarts: starts,
          selectedBlocks: blocks,
          startBtnStatus: !blocks.length,
          blockBtnStatus: !starts.length,
          deleteBtnStatus: !rows.length,
        },
      });
    },
    // 分页变更
    onChange({ current, pageSize }) {
      dispatch({
        type: 'receiptAccount/query',
        payload: {
          current,
          size: pageSize,
          keyword: searchData.keyword,
          merchantId,
        },
      });
    },
  };
  const modalProps = {
    item,
    merchantId,
    key: modalKey,
    visible: modalVisible,
    // 确定
    onConfirm(type, data) {
      if (type === 'add') {
        dispatch({
          type: 'receiptAccount/add',
          payload: data,
        });
      }
      if (type === 'edit') {
        dispatch({
          type: 'receiptAccount/edit',
          payload: data,
        });
      }
    },
    // 取消
    onCancel() {
      dispatch({
        type: 'receiptAccount/hideModal',
        payload: {
          modalVisiable: false,
          item: {},
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

ReceiptAccount.propTypes = {
  dispatch: PropTypes.func,
  receiptAccount: PropTypes.object,
  loading: PropTypes.object,
};

export default connect(({ receiptAccount, loading }) =>
  ({ receiptAccount, loading }))(ReceiptAccount);
