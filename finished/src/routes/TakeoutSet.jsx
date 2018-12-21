/**
 * Create by xiaochenghua on 2018/03/10
 * */

import React, { PropTypes } from 'react';
import { connect } from 'dva/index';
// import { message } from 'antd/lib/index';
import Search from '../components/TakeoutSet/search';
import List from '../components/TakeoutSet/list';
import Modal from '../components/TakeoutSet/modal';

const TakeoutSet = ({ dispatch, cloudState }) => {
  const {
    dataList,
    modalVisible,
    modalData,
    modalName,
    name,
    type,
    modalKey,
    selections,
    groupList,
    groupLoading,
    // pagination,
  } = cloudState.takeoutSet;
  const loading = cloudState.loading.effects;
  const searchProps = {
    loading: loading['takeoutSet/delete'],
    name,
    type,
    selections,
    // 新增外卖配置
    onAdd() {
      dispatch({
        type: 'takeoutSet/showModal',
        payload: {
          modalData: {},
          modalName: '新增',
        },
      });
    },
    // 删除外卖配置
    onDelete() {
      dispatch({
        type: 'takeoutSet/delete',
        payload: {
          pkWmplatformconf: selections.join(','),
        },
      });
    },
    // 搜索
    onSearch() {
      dispatch({
        type: 'takeoutSet/queryCondition',
        payload: {
          vname: name,
          vtype: type,
        },
      });
    },
    // 清空搜索条件
    onClear() {
      dispatch({
        type: 'takeoutSet/updateState',
        payload: {
          name: '',
          type: '',
        },
      });
      dispatch({
        type: 'takeoutSet/queryCondition',
        payload: {
          vname: '',
          vtype: '',
        },
      });
    },
    // 改变类型
    onChangeType(val) {
      dispatch({
        type: 'takeoutSet/updateState',
        payload: {
          type: val,
        },
      });
    },
    // 改变条件名称
    onChangeName(val) {
      dispatch({
        type: 'takeoutSet/updateState',
        payload: {
          name: val.target.value,
        },
      });
    },
  };
  const listProps = {
    dataList,
    // pagination,
    loading: loading['takeoutSet/query'],
    visible: modalVisible,
    // 编辑
    onEdit(record) {
      dispatch({
        type: 'takeoutSet/showModal',
        payload: {
          modalData: record,
          modalName: '编辑',
        },
      });
    },
    // 是否选中
    onSelected(items) {
      dispatch({
        type: 'takeoutSet/updateState',
        payload: {
          selections: items.map(val => val.pkWmplatformconf),
        },
      });
    },
  };
  const modalProps = {
    loading: loading['takeoutSet/add'] || loading['takeoutSet/edit'],
    visible: modalVisible,
    modalData,
    modalKey,
    groupList,
    groupLoading,
    modalName: modalName || '新增',
    // 请求门店列表
    onGetGroupList(e) {
      dispatch({
        type: 'takeoutSet/queryGroupList',
        payload: {
          key: e,
        },
      });
    },
    onClearGroup() {
      dispatch({
        type: 'takeoutSet/updateState',
        payload: {
          groupList: [],
        },
      });
    },
    // 取消
    onCancel() {
      dispatch({
        type: 'takeoutSet/hideModal',
      });
    },
    // 确定新增
    onSubmit(val) {
      if (modalName === '新增') {
        dispatch({
          type: 'takeoutSet/add',
          payload: {
            ...val,
          },
        });
      } else {
        dispatch({
          type: 'takeoutSet/edit',
          payload: {
            ...modalData,
            ...val,
          },
        });
      }
    },
    // 表单内容更新
    onInputChange(value, key) {
      dispatch({
        type: 'takeoutSet/updateState',
        payload: {
          modalData: {
            ...modalData,
            [key]: value,
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
};

TakeoutSet.propTypes = {
  dispatch: PropTypes.func,
  cloudState: PropTypes.object,
};

const mapStateToProps = cloudState => ({ cloudState });


export default connect(mapStateToProps)(TakeoutSet);
