/**
 * Create by liukang on 2018/03/06
 * */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import Search from '../../components/Payment/Isv/search';
import List from '../../components/Payment/Isv/list';
import Modal from '../../components/Payment/Isv/modal';

function Isv({ dispatch, isv, loading }) {
  const {
    dataList,
    pagination,
    searchInfo,
    searchData,
    modalVisible,
    item,
    channel,
    selectedRows,
    modalKey,
  } = isv;
  const searchProps = {
    searchInfo,
    selectedRows,
    // 搜索输入
    onSearchChange(e) {
      const value = e.target.value;
      dispatch({
        type: 'isv/updateState',
        payload: {
          searchInfo: value,
        },
      });
    },
    // 搜索按钮
    onSearch() {
      dispatch({
        type: 'isv/query',
        payload: {
          current: 1,
          keyword: searchInfo,
        },
      });
      dispatch({
        type: 'isv/updateState',
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
        type: 'isv/updateState',
        payload: {
          searchInfo: '',
          searchData: {
            ...searchData,
            keyword: '',
          },
        },
      });
      dispatch({
        type: 'isv/query',
        payload: {
          current: 1,
          keyword: '',
        },
      });
    },
    // 添加
    onAdd() {
      dispatch({
        type: 'isv/showModal',
        payload: {
          item: {},
        },
      });
    },
    // 删除
    onDelete() {
      dispatch({
        type: 'isv/delete',
        payload: selectedRows.map(it => it.id),
      });
    },
  };
  const listProps = {
    dataSource: dataList,
    pagination,
    selectedRows,
    loading: loading.effects['isv/query'],
    // 编辑
    onEidt(rows) {
      dispatch({
        type: 'isv/showModal',
        payload: {
          item: rows,
        },
      });
    },
    // 分页变更
    onChange({ current, pageSize }) {
      dispatch({
        type: 'isv/query',
        payload: {
          current,
          size: pageSize,
          keyword: searchData.keyword || '',
        },
      });
      dispatch({
        type: 'isv/updateState',
        payload: {
          searchData: {
            ...searchData,
            current,
            size: pageSize,
          },
        },
      });
    },
    // table选择
    onSelect(rows) {
      dispatch({
        type: 'isv/updateState',
        payload: {
          selectedRows: rows,
        },
      });
    },
  };
  const modalProps = {
    item,
    channel,
    key: modalKey,
    visible: modalVisible,
    // 弹框确定
    onConfirm(type, data) {
      if (type === 'add') {
        dispatch({
          type: 'isv/add',
          payload: data,
        });
      }
      if (type === 'edit') {
        dispatch({
          type: 'isv/edit',
          payload: data,
        });
      }
    },
    // 取消
    onCancel() {
      dispatch({
        type: 'isv/hideModal',
        payload: {
          modalVisiable: false,
          item: {},
        },
      });
    },
    // 选择文件
    onSelectedFile(data) {
      dispatch({
        type: 'isv/updateState',
        payload: {
          modalVisiable: false,
          item: {
            ...item,
            certificate: data,
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

Isv.propTypes = {
  isv: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(({ isv, loading }) => ({ isv, loading }))(Isv);
