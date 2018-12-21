import React from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { connect } from 'dva';

import Search from '../components/Business/search';
import List from '../components/Business/list';
import Modal from '../components/Business/modal';

const Business = ({ dispatch, cloudState }) => {
  const {
    modalVisible,
    pagination,
    title,
    dataList,
    checkedBussiness,
    deleteBtnStatus,
    startBtnStatus,
    blockBtnStatus,
    checkedBussinessStartId,
    checkedBussinessBlockId,
    checkedBussinessId,
    tenProvinceList,
    tenCityList,
    tenDistrictList,
    tenProvinceName,
    tenCityName,
    tenDistrictName,
    status,
    searchInfo,
    searchData,
    braLogo,
    braName,
    tenName,
    superName,
    superMobile,
    tenAddress,
    tenEmail,
    tenProvince,
    tenantId,
    tenCity,
    tenDistrict,
    fileList,
    modalKey,
    previewVisible,
    previewImgUrl,
  } = cloudState.business;
  const loading = cloudState.loading.effects;
  const realImg = window.document.createElement('img');  //  用于图片上传宽高验证
  const searchProps = {
    loading: loading['business/editJar'],
    checkedBussiness,
    deleteBtnStatus, // 删除按钮禁用状态
    startBtnStatus,  // 启用按钮禁用状态
    blockBtnStatus,  // 停用按钮禁用状态
    checkedBussinessStartId, // 选中可停用员工id
    checkedBussinessBlockId, // 选中可启用员工id
    checkedBussinessId,
    searchInfo,
    // 搜索输入改变
    onSearchChange(e) {
      const value = e.target.value;
      dispatch({
        type: 'business/updateState',
        payload: {
          searchInfo: value,
          // searchData: {
          //   ...searchData,
          //   key: value,
          // },
        },
      });
    },
    // 清空搜索条件，再次请求列表，响应无搜索条件的列表
    onClearSearchInfo() {
      dispatch({
        type: 'business/updateState',
        payload: {
          searchInfo: '',
          searchData: {
            ...searchData,
            key: '',
          },
        },
      });
      dispatch({
        type: 'business/query',
        payload: {
          page: {
            pageno: 1, // 查看第几页内容 默认1
            rowcount: 10, // 一页展示条数 默认10
          },
          key: '',
        },
      });
    },
    // 搜索按钮
    onSearch() {
      dispatch({
        type: 'business/query',
        payload: {
          page: {
            pageno: 1, // 查看第几页内容 默认1
            rowcount: 10, // 一页展示条数 默认10
          },
          key: searchInfo,
        },
      });
      dispatch({
        type: 'business/updateState',
        payload: {
          searchData: {
            ...searchData,
            key: searchInfo,
          },
        },
      });
    },
    // 新增商户
    onAdd() {
      dispatch({
        type: 'business/updateState',
        payload: {
          title: '新增商户',
          fileList: [],
          braName: '',
          tenName: '',
          superName: '',
          superMobile: '',
          tenDistrictName: '',
          tenProvinceName: '',
          tenCityName: '',
          tenAddress: '',
          tenEmail: '',
          tenantId: '',
          tenCity: '',
          tenDistrict: '',
          tenProvince: '',
          braLogo: '',
        },
      });
      dispatch({
        type: 'business/queryProvince',
      });
      dispatch({
        type: 'business/showModal',
      });
    },
    // 启用
    onEnable() {
      const checkedBussinessIds = checkedBussinessBlockId.join(',');
      dispatch({
        type: 'business/onOff',
        payload: {
          ids: checkedBussinessIds,
          status: '1',
        },
      });
      dispatch({
        type: 'business/updateState',
        payload: {
          checkedBussinessId: [],
          checkedBussiness: [],
          checkedBussinessStartId: [], // 选中可停用商户id
          checkedBussinessBlockId: [],
          deleteBtnStatus: true,
          startBtnStatus: true,
          blockBtnStatus: true,
        },
      });
    },
    // 停用
    onDisable() {
      const checkedBussinessIds = checkedBussinessStartId.join(',');
      dispatch({
        type: 'business/onOff',
        payload: {
          ids: checkedBussinessIds,
          status: '0',
        },
      });
      dispatch({
        type: 'business/updateState',
        payload: {
          checkedBussinessId: [],
          checkedBussiness: [],
          checkedBussinessStartId: [], // 选中可停用商户id
          checkedBussinessBlockId: [],
          deleteBtnStatus: true,
          startBtnStatus: true,
          blockBtnStatus: true,
        },
      });
    },
    // 删除
    onDelete() {
      const checkedBussinessIds = checkedBussinessId.join(',');
      dispatch({
        type: 'business/delete',
        payload: {
          ids: checkedBussinessIds,
        },
      });
      dispatch({
        type: 'business/updateState',
        payload: {
          checkedBussinessId: [],
          checkedBussiness: [],
          checkedBussinessStartId: [], // 选中可停用商户id
          checkedBussinessBlockId: [],
          deleteBtnStatus: true,
          startBtnStatus: true,
          blockBtnStatus: true,
        },
      });
    },
    // 更新配置包
    onUpdataJar() {
      dispatch({
        type: 'business/editJar',
      });
    },

  };
  const listProps = {
    loading: loading['business/query'] || loading['business/reload'],
    dataList,
    pagination,
    checkedBussinessId,
    status,
    // 编辑商户
    onEdit(record) {
      dispatch({
        type: 'business/updateState',
        payload: {
          tenantId: record.id,
          title: '编辑商户',
          braLogo: '',
          braName: '',
          tenName: '',
          superName: '',
          superMobile: '',
          tenDistrictName: '',
          tenProvinceName: '',
          tenCityName: '',
          tenAddress: '',
          tenEmail: '',
          tenDistrict: '',
          tenProvince: '',
          tenCity: '',
          fileList: [],
        },
      });
      dispatch({
        type: 'business/queryDetail',
        payload: {
          tenantId: record.id,
        },
      });
      dispatch({
        type: 'business/queryProvince',
      });
      dispatch({
        type: 'business/showModal',
      });
    },
    // 删除商户
    onDelete(idArray) {
      const checkedBussinessIds = []; // 删除后数组
      const checkedArray = []; // 去除后的状态数组
      const startArray = [];      // 启用按钮数组
      const blockArray = [];      //  停用按钮数组
      checkedBussinessId.map((item) => {
        if (idArray.indexOf(item) < 0) {
          checkedBussinessIds.push(item);
        }
        return false;
      });
      checkedBussiness.map((item) => {
        if (idArray.indexOf(item.id) < 0) {
          checkedArray.push(item);
        }
        return false;
      });
      const judgeStartArray = checkedArray.filter(item => item.status === 1);
      const judgeBlockArray = checkedArray.filter(item => item.status === 0);
      judgeStartArray.map((item) => {
        startArray.push(item.id);
        return false;
      });
      judgeBlockArray.map((item) => {
        blockArray.push(item.id);
        return false;
      });
      dispatch({
        type: 'business/updateState',
        payload: {
          deleteBtnStatus: !((checkedArray.length > 0)),
          startBtnStatus: (judgeStartArray.length === checkedArray.length),
          blockBtnStatus: (judgeBlockArray.length === checkedArray.length),
          checkedBussiness: checkedArray,
          checkedBussinessId: checkedBussinessIds,
          checkedBussinessStartId: startArray, // 选中可停用员工id
          checkedBussinessBlockId: blockArray, // 选中可启用员工id
        },
      });
    },
    // 是否选中
    onSelectBusiness(selectedRows, record) {
      const checkedArray = [];
      const checkedBussinessIds = [];
      record.map((item) => {
        checkedArray.push({ id: item.id, status: item.status });
        checkedBussinessIds.push(item.id);
        return false;
      });
      dispatch({
        type: 'business/updateState',
        payload: {
          checkedBussiness: [...checkedBussiness, ...checkedArray],
          checkedBussinessId: [...checkedBussinessIds, ...checkedBussinessId],
        },
      });
      dispatch({
        type: 'business/judgeStatus',
      });
    },
    // 查询商户列表
    onChangeSorter(page) {
      dispatch({
        type: 'business/query',
        payload: {
          page: {
            pageno: page.current, // 查看第几页内容 默认1
            rowcount: page.pageSize, // 一页展示条数 默认10
          },
          key: searchData.key,
        },
      });
    },
  };
  const modalProps = {
    loading: loading['business/save'],
    modalVisible,
    title,
    tenProvinceName,
    tenCityName,
    tenDistrictName,
    braLogo,
    braName,
    tenName,
    superName,
    superMobile,
    tenAddress,
    tenEmail,
    tenantId,
    tenCity,
    tenDistrict,
    tenProvince,
    tenProvinceList,
    tenCityList,
    tenDistrictList,
    fileList,
    previewVisible,
    key: modalKey,
    previewImgUrl,
    onConfirm(value) {
      dispatch({
        type: 'business/save',
        payload: {
          braLogo,
          braName: value.brandName,
          status,
          superMobile: value.userAccount,
          superName: value.administrator,
          tenAddress: value.tenAddreass,
          tenCity,
          tenCityName,
          tenDistrict,
          tenDistrictName,
          tenEmail: value.Email,
          tenName: value.tenantsName,
          tenProvince,
          tenProvinceName,
          id: tenantId,
        },
      });
    },
    onCancel() {
      dispatch({
        type: 'business/updateState',
        payload: {
          modalVisible: false,
          tenantId: '',
        },
      });
    },

    onProvinceChange(selectedKeys, info) {
      dispatch({
        type: 'business/updateState',
        payload: {
          tenProvince: selectedKeys,
          tenProvinceName: info.props.children,
          tenCity: '',
          tenDistrict: '',
          tenCityName: '请选择',
          tenDistrictName: '请选择',
        },
      });
      dispatch({
        type: 'business/queryAreaById',
        payload: {
          parentId: selectedKeys,
          flag: 'provinceClick',
        },
      });
    },
    onCityChange(selectedKeys, info) {
      dispatch({
        type: 'business/updateState',
        payload: {
          tenCity: selectedKeys,
          tenCityName: info.props.children,
          tenDistrictName: '请选择',
        },
      });
      dispatch({
        type: 'business/queryAreaById',
        payload: {
          parentId: selectedKeys,
          flag: 'cityClick',
        },
      });
    },
    onDistrictChange(selectedKeys, info) {
      dispatch({
        type: 'business/updateState',
        payload: {
          tenDistrict: selectedKeys,
          tenDistrictName: info.props.children,

        },
      });
    },
    onBeforeUpload(file) {
      return new Promise((resolve, reject) => {
        const isTooLarge = file.size / 1024 / 1024 > 2;
        const arr = ['image/jpeg', 'image/bmp', 'image/png', 'image/gif'];
        const isImg = arr.indexOf(file.type) !== -1;
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
    onHandleUpload(info) {
      const oldImgUrl = braLogo;
      if (info.file.status === 'error') {
        message.warning('图片上传失败！');
        dispatch({
          type: 'business/setFileList',
          fileList: [],
        });
        return false;
      }
      const list = info.fileList.slice(-1);
      if (info.fileList && info.fileList.length > 0 && info.fileList[0].thumbUrl) {
        realImg.src = info.fileList[0].thumbUrl;
      }
      const isTooLarge = info.file.size > 2 * 1024 * 1024;
      const arr = ['image/jpeg', 'image/bmp', 'image/png', 'image/gif'];
      const isImg = arr.indexOf(info.file.type) !== -1;
      let fileId = '';
      if (list && list.length) {
        const { response } = list[0];
        if (response && response.code === '200') {
          fileId = response.data;
          list[0].url = response.data;
        }
      }
      dispatch({
        type: 'business/updateState',
        payload: {
          braLogo: fileId,
        },
      });
      if (realImg.width > 200 || realImg.height > 200) {
        message.error('图片大小不能超过200px*200px，请重新上传！');
        dispatch({
          type: 'business/setFileList',
          fileList: [],
        });
        dispatch({
          type: 'business/updateState',
          braLogo: oldImgUrl,
        });
      } else if (isTooLarge || !isImg) {
        dispatch({
          type: 'business/setFileList',
          fileList: [],
        });
        dispatch({
          type: 'business/updateState',
          braLogo: oldImgUrl,
        });
      } else {
        dispatch({
          type: 'business/setFileList',
          fileList: list,
        });
      }
      return null;
    },
    onPreview(file) {
      dispatch({
        type: 'business/updateState',
        payload: {
          previewVisible: true,
          previewImgUrl: file.url,
        },
      });
    },

    onCancelPic() {
      dispatch({
        type: 'business/updateState',
        payload: {
          previewVisible: false,
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

function mapStateToProps(cloudState) {
  return { cloudState };
}

Business.propTypes = {
  dispatch: PropTypes.func,
  cloudState: PropTypes.object,
};
export default connect(mapStateToProps)(Business);
