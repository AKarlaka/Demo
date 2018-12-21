/**
 * Create by xiaochenghua on 2018/02/01
 * */

import React, { PropTypes } from 'react';
import { connect } from 'dva/index';
import { message } from 'antd/lib/index';
import Search from '../components/AppList/search';
import List from '../components/AppList/list';
import Modal from '../components/AppList/modal';
import Relation from '../components/AppList/modalRelation';

const AppList = ({ dispatch, cloudState }) => {
  const {
    name,
    id,
    applicationIcon,
    stopFlag,
    startFlag,
    removeFlag,
    dataList,
    currentItem,
    // defaultItem,
    modalType,
    modalVisible,
    modalKey,
    selectedItem,
    selectedItemsId,
    selectedStart,
    selectedStop,
    pagination,
    previewVisible,
    fileList,
    iconFlag,
    viewPathId, // 跳转页面
    relationVisible,
    preApps, // 前置应用
    mutexApps, // 互斥应用
    appTreeData,
    relationLoading,
    searchData,
  } = cloudState.appList;
  const loading = cloudState.loading.effects;
  const realImg = window.document.createElement('img');  //  用于图片上传宽高验证

  const searchProps = {
    selectedItem,
    selectedStart,
    selectedStop,
    name,
    stopFlag,
    startFlag,
    removeFlag,
    // 新增
    onAdd() {
      dispatch({
        type: 'appList/showModal',
        payload: {
          modalType: 'create',
          fileList: [],
          sellStrategy: 0,
          id: '',
        },
      });
    },
    // 停用
    onStop() {
      const selectedItemsIds = selectedItemsId.join(',');
      dispatch({
        type: 'appList/onOff',
        payload: {
          appids: selectedItemsIds,
          status: '0',
        },
      });
      dispatch({
        type: 'appList/updateState',
        payload: {
          selectedItemsId: [],
          selectedItem: [],
          selectedStart: [],
          selectedStop: [],
          removeFlag: true,
          startFlag: true,
          stopFlag: true,
        },
      });
    },
    // 启用
    onStart() {
      const selectedItemsIds = selectedItemsId.join(',');
      dispatch({
        type: 'appList/onOff',
        payload: {
          appids: selectedItemsIds,
          status: '1',
        },
      });
      dispatch({
        type: 'appList/updateState',
        payload: {
          selectedItemsId: [],
          selectedItem: [],
          selectedStart: [],
          selectedStop: [],
          removeFlag: true,
          startFlag: true,
          stopFlag: true,
        },
      });
    },
    // 删除
    onDelete() {
      const selectedItemsIds = selectedItemsId.join(',');
      dispatch({
        type: 'appList/delete',
        payload: {
          appids: selectedItemsIds,
        },
      });
      dispatch({
        type: 'appList/updateState',
        payload: {
          selectedItemsId: [],
          selectedItem: [],
          selectedStart: [],
          selectedStop: [],
          removeFlag: true,
          startFlag: true,
          stopFlag: true,
        },
      });
    },
    // 搜索
    onSearch() {
      dispatch({
        type: 'appList/query',
        payload: {
          name,
        },
      });
      dispatch({
        type: 'appList/updateState',
        payload: {
          searchData: {
            ...searchData,
            name,
          },
        },
      });
    },
    // 搜索输入
    onSearchChange(e) {
      const value = e.target.value;
      dispatch({
        type: 'appList/updateState',
        payload: {
          name: value,
        },
      });
    },
    // 清空搜索
    onClearName() {
      dispatch({
        type: 'appList/updateState',
        payload: {
          name: '',
          searchData: {
            ...searchData,
            name: '',
          },
        },
      });
      dispatch({
        type: 'appList/query',
        payload: {
          page: {
            pageno: 1, // 查看第几页内容 默认1
            rowcount: 10, // 一页展示条数 默认10
          },
          name: '',
        },
      });
    },
  };
  const listProps = {
    loading: loading['appList/query'],
    dataList,
    pagination,
    selectedItemsId,
    viewPathId,
    // 编辑
    onEdit(item) {
      dispatch({
        type: 'appList/updateState',
        payload: {
          modalType: 'edit',
        },
      });
      dispatch({
        type: 'appList/showModal',
        payload: {
          ...item,
          currentItem: {
            ...item,
            sellType: item.sellType || 0,
          },
          fileList: [{
            uid: item.id,
            name: item.applicationName,
            status: 'done',
            url: item.applicationIcon,
          }],
          iconFlag: item.applicationIcon,
        },
      });
    },
    // 图文编辑
    onViewPath(itemId) {
      dispatch({
        type: 'appList/viewPath',
        payload: {
          viewPathId: itemId,
        },
      });
    },
    // 应用关系
    onRelation(itemId) {
      dispatch({
        type: 'appList/queryAppRelation',
        payload: {
          appid: itemId,
        },
      });
      dispatch({
        type: 'appList/updateState',
        payload: {
          relationVisible: true,
          id: itemId,
        },
      });
    },
    // 勾选
    onSelectItem(selectedRows, record) {
      const selectedArray = [];
      const selectedItemsIds = [];
      record.map((item) => {
        selectedArray.push({ id: item.id, status: item.status });
        selectedItemsIds.push(item.id);
        return false;
      });
      dispatch({
        type: 'appList/updateState',
        payload: {
          selectedItem: [...selectedItem, ...selectedArray],
          selectedItemsId: [...selectedItemsIds, ...selectedItemsId],
        },
      });
      dispatch({
        type: 'appList/editStatus',
      });
    },
    // 取消勾选
    onDeleteItem(idArray) {
      const selectedItemsIds = []; // 删除后数组
      const checkedArray = []; // 去除后的状态数组
      const startArray = [];      // 启用按钮数组
      const stopArray = [];      //  停用按钮数组
      selectedItemsId.map((item) => {
        if (idArray.indexOf(item) < 0) {
          selectedItemsIds.push(item);
        }
        return false;
      });
      selectedItem.map((item) => {
        if (idArray.indexOf(item.id) < 0) {
          checkedArray.push(item);
        }
        return false;
      });
      const judgeStartArray = checkedArray.filter(item => item.status === 1);
      const judgeStopArray = checkedArray.filter(item => item.status === 0);
      judgeStartArray.map((item) => {
        startArray.push(item.id);
        return false;
      });
      judgeStopArray.map((item) => {
        stopArray.push(item.id);
        return false;
      });
      dispatch({
        type: 'appList/updateState',
        payload: {
          removeFlag: !(checkedArray.length > 0),
          startFlag: (judgeStartArray.length === checkedArray.length),
          stopFlag: (judgeStopArray.length === checkedArray.length),
          selectedItem: checkedArray,
          selectedItemsId: selectedItemsIds,
          selectedStop: startArray, // 选中可停用员工id
          selectedStart: stopArray, // 选中可启用员工id
        },
      });
    },
    // 分页
    onPageChange(page) {
      dispatch({
        type: 'appList/query',
        payload: {
          page: {
            pageno: page.current,
            rowcount: page.pageSize,
          },
          name: searchData.name,
        },
      });
    },
  };
  const modalProps = {
    loading: loading['appList/save'],
    applicationIcon,
    visible: modalVisible,
    previewVisible,
    fileList,
    iconFlag,
    modalType,
    item: modalType === 'create' ? {} : currentItem,
    key: modalKey,
    // 弹窗关闭
    onCancel() {
      dispatch({
        type: 'appList/hideModal',
      });
      dispatch({
        type: 'appList/updateState',
        payload: {
          currentItem: {},
        },
      });
    },
    // 关闭预览图片
    onCancelImg() {
      dispatch({
        type: 'appList/updateState',
        payload: {
          previewVisible: false,
        },
      });
    },


    // 弹窗表单提交
    onConfirm(val) {
      dispatch({
        type: 'appList/save',
        payload: {
          ...val,
          id: id || '',
          applicationIcon: val.iconFlag,
        },
      });
    },


    // 头像上传判断
    onBeforeUpload(file) {
      return new Promise((resolve, reject) => {
        const isTooLarge = file.size / 1024 / 1024 > 2;
        const arr = ['image/jpeg', 'image/bmp', 'image/png', 'image/gif'];
        const isImg = arr.includes(file.type);
        if (isTooLarge) {
          reject('图片不能超过2M，请重新上传！');
        } else if (!isImg) {
          reject('请上传 bmp, png, jpg, gif 格式的文件');
        }
        resolve();
      }).catch((error) => {
        message.warning(error);
      });
    },
    // 预览头像
    onPreview(file) {
      dispatch({
        type: 'appList/updateState',
        payload: {
          previewVisible: true,
          applicationIcon: file.url,
        },
      });
    },
    // 头像上传
    onUploadChange(info) {
      const oldImgUrl = iconFlag;
      const list = info.fileList.slice(-1);
      // 获取图片宽高
      if (info.file.status === 'error') {
        message.warning('图片上传失败！');
        dispatch({
          type: 'business/setFileList',
          fileList: [],
        });
        return false;
      }
      if (info.fileList && info.fileList.length > 0 && info.fileList[0].thumbUrl) {
        realImg.src = info.fileList[0].thumbUrl;
      }
      const isTooLarge = info.file.size > 2 * 1024 * 1024;
      const arr = ['image/jpeg', 'image/bmp', 'image/png', 'image/gif'];
      const isImg = arr.indexOf(info.file.type) !== -1;
      if (list && list.length) {
        const { response } = list[0];
        if (response && response.code === '200') {
          list[0].url = response.data;
        }
      }
      dispatch({
        type: 'appList/updateState',
        payload: {
          iconFlag: list[0].url,
        },
      });
      if (realImg.width > 200 || realImg.height > 200) {
        message.error('图片大小不能超过200px*200px，请重新上传！');
        dispatch({
          type: 'appList/updateState',
          payload: {
            fileList: [],
          },
        });
        dispatch({
          type: 'business/updateState',
          iconFlag: oldImgUrl,
        });
      } else if (isTooLarge || !isImg) {
        dispatch({
          type: 'appList/updateState',
          payload: {
            fileList: [],
          },
        });
        dispatch({
          type: 'business/updateState',
          iconFlag: oldImgUrl,
        });
      } else {
        dispatch({
          type: 'appList/updateState',
          payload: {
            applicationIcon: list[0].url,
            fileList: list,
          },
        });
      }
      return null;
    },
    // 删除头像
    onRemoveImg() {
      dispatch({
        type: 'appList/updateState',
        payload: {
          fileList: [],
          iconFlag: '',
        },
      });
    },
    // 售卖策略  付费还是免费
    onSelectSellStrategy(e) {
      dispatch({
        type: 'appList/updateState',
        payload: {
          sellStrategy: e.target.value,
          // 付费应用展示效果受下两字段影响，需重置
          authType: 1,
          sellType: 0,
        },
      });
    },
  };
  const relaionProps = {
    id,
    title: '编辑应用关系',
    relationVisible,
    preApps,
    mutexApps,
    appTreeData,
    relationLoading,
    // 弹窗取消
    onCancel: () => {
      dispatch({
        type: 'appList/updateState',
        payload: {
          id: '',
          relationVisible: false,
          preApps: [],
          mutexApps: [],
          relationLoading: false,
        },
      });
    },
    // 弹窗确认
    onConfirm: () => {
      const concatArray = (preApps !== null && mutexApps !== null) ?
        preApps.concat(mutexApps).sort()
        : [];
      const isOnly = () => {
        let onlyFlag = true;
        concatArray.forEach((value, index, arr) => {
          if (value === arr[index + 1]) {
            onlyFlag = false;
            return false;
          }
          return onlyFlag;
        });
        return onlyFlag;
      };
      if (isOnly()) {
        dispatch({
          type: 'appList/editRelation',
          payload: {
            appid: id,
            preApps,
            mutexApps,
          },
        });
      } else {
        message.warning('前置/互斥应用不能有相同选项！', 3);
      }
    },
    // 前置互斥选择
    onChange: (e, type) => {
      if (type === 'pre') {
        dispatch({
          type: 'appList/updateState',
          payload: {
            preApps: e,
          },
        });
      } else {
        dispatch({
          type: 'appList/updateState',
          payload: {
            mutexApps: e,
          },
        });
      }
    },
  };
  return (
    <div>
      <Search {...searchProps} />
      <List {...listProps} />
      <Modal {...modalProps} />
      <Relation {...relaionProps} />
    </div>
  );
};

AppList.propTypes = {
  cloudState: PropTypes.object,
  dispatch: PropTypes.func,
};

const mapStateToProps = cloudState => ({ cloudState });


export default connect(mapStateToProps)(AppList);

