/**
 * Created by Wangtaidong on 2018/2/1.
 */
import React from 'react';
import Moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Modal } from 'antd';
import List from '../components/Order/list';
import Search from '../components/Order/search';
import ViewModal from '../components/Order/modal';

const confirm = Modal.confirm;

const Order = ({ dispatch, cloudState }) => {
  const {
    apps,
    selectAppId,
    selectStatus,
    searchWord,
    searchData,
    dataList,
    pagination,
    modalVisible,
    modalData,
    shopList,
    orderId,
    tenantId,
    pageModal,
  } = cloudState.order;
  const loading = cloudState.loading.effects;
  // 从所有应用中根据applicationId查找applicationName
  const mapList = (listItems, appItems) => {
    listItems.map((listItem) => {
      const item = listItem;
      item.createTime = Moment(listItem.createTime).format('YYYY-MM-DD HH:mm:ss');
      appItems.map((appItem) => {
        if (appItem.id === item.applicationId) {
          item.applicationName = appItem.applicationName;
          item.applicationIcon = appItem.applicationIcon;
          item.description = appItem.description;
        }
        return false;
      });
      return false;
    });
  };
  mapList(dataList, apps);
  const searchProps = {
    apps,
    searchWord,
    searchData,
    // 选择应用
    onSelectApp(value) {
      dispatch({
        type: 'order/query',
        payload: {
          page: {
            pageno: 1,
            rowcount: 10,
          },
          key: searchData.key || '',
          applicationId: value,
          status: selectStatus,
        },
      });
      dispatch({
        type: 'order/updateState',
        payload: {
          selectAppId: value,
          searchData: {
            ...searchData,
            applicationId: value,
          },
        },
      });
    },
    // 选择状态
    onSelectStatus(value) {
      dispatch({
        type: 'order/query',
        payload: {
          page: {
            pageno: 1,
            rowcount: 10,
          },
          key: searchData.key || '',
          applicationId: selectAppId,
          status: value,
        },
      });
      dispatch({
        type: 'order/updateState',
        payload: {
          selectStatus: value,
          searchData: {
            ...searchData,
            status: value,
          },
        },
      });
    },
    // 搜索输入
    onSearchChange(e) {
      const value = e.target.value;
      dispatch({
        type: 'order/updateState',
        payload: {
          searchWord: value,
        },
      });
    },
    // 清空内容
    onClear() {
      dispatch({
        type: 'order/updateState',
        payload: {
          searchWord: '',
          searchData: {
            ...searchData,
            key: '',
          },
        },
      });
      dispatch({
        type: 'order/query',
        payload: {
          page: {
            pageno: 1, // 查看第几页内容 默认1
            rowcount: 10, // 一页展示条数 默认10
          },
          key: '',
          applicationId: selectAppId,
          status: selectStatus,
        },
      });
    },
    // 搜索
    onSearch() {
      dispatch({
        type: 'order/query',
        payload: {
          page: {
            pageno: 1, // 查看第几页内容 默认1
            rowcount: 10, // 一页展示条数 默认10
          },
          key: searchWord,
          applicationId: selectAppId,
          status: selectStatus,
        },
      });
      dispatch({
        type: 'order/updateState',
        payload: {
          searchData: {
            ...searchData,
            key: searchWord,
          },
        },
      });
    },
  };
  const listProps = {
    loading: loading['order/query'],
    dataSource: dataList,
    pagination,
    // 查看门店
    onView(record) {
      dispatch({
        type: 'order/showModal',
      });
      dispatch({
        type: 'order/updateState',
        payload: {
          shopList: [
            {
              applicationName: record.applicationName,
              applicationIcon: record.applicationIcon,
              description: record.description,
            },
          ],
          orderId: record.id,
          tenantId: record.tenantId,
        },
      });
      dispatch({
        type: 'order/queryShops',
        payload: {
          orderId: record.id,
          tenantId: record.tenantId,
        },
      });
    },
    // 分页
    onPageChange(page) {
      dispatch({
        type: 'order/query',
        payload: {
          page: {
            pageno: page.current, // 查看第几页内容 默认1
            rowcount: page.pageSize, // 一页展示条数 默认10
          },
          key: searchData.key || '',
          applicationId: selectAppId,
          status: selectStatus,
        },
      });
      dispatch({
        type: 'order/updateState',
        payload: {
          searchData: {
            ...searchData,
            page: {
              pageno: page.current, // 查看第几页内容 默认1
              rowcount: page.pageSize, // 一页展示条数 默认10
            },
          },
        },
      });
    },
    // 审核通过
    onReview(e, record) {
      e.preventDefault();
      confirm({
        title: '确认',
        content: '确定审核通过？',
        cancelText: '取消',
        okText: '确定',
        onOk() {
          dispatch({
            type: 'order/review',
            payload: {
              orderApplicationId: record.id,
            },
          });
          if (record.applicationName === '供应链') {
            dispatch({
              type: 'order/sendScmMsg',
              payload: {
                tenantId: record.tenantId,
              },
            });
          }
        },
        onCancel() {},
      });
    },
    // 审核不通过
    onRefuse(e, record) {
      e.preventDefault();
      confirm({
        title: '确认',
        content: '确定审核不通过？',
        cancelText: '取消',
        okText: '确定',
        onOk() {
          dispatch({
            type: 'order/refuse',
            payload: {
              orderApplicationId: record.id,
            },
          });
        },
        onCancel() {},
      });
    },
  };
  const modalProps = {
    visible: modalVisible,
    title: '订购门店详情',
    width: 780,
    footer: null,
    modalData,
    shopList,
    pageModal,
    maskClosable: false,
    // 弹窗取消
    onCancel() {
      dispatch({
        type: 'order/hideModal',
      });
      dispatch({
        type: 'order/hideLoading',
      });
    },
    // 弹窗确认
    onConfirm() {
      dispatch({
        type: 'order/hideModal',
      });
      dispatch({
        type: 'order/hideLoading',
      });
    },
    // 分页
    onPage(page) {
      dispatch({
        type: 'order/queryShops',
        payload: {
          tenantId,
          orderId,
          page: {
            pageno: page.current, // 查看第几页内容 默认1
            rowcount: page.pageSize, // 一页展示条数 默认10
          },
        },
      });
    },
  };
  return (
    <div>
      <Search {...searchProps} />
      <List {...listProps} />
      <ViewModal {...modalProps} />
    </div>
  );
};

Order.propTypes = {
  cloudState: PropTypes.object,
  dispatch: PropTypes.func,
};
const mapStateToProps = cloudState => ({ cloudState });
export default connect(mapStateToProps)(Order);
