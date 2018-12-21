/* CREATE BY ZC 2017/12/22 下午1:48:16*/
import React, { PropTypes } from 'react';
import { connect } from 'dva';
import Search from '../../components/System/Role/search';
import List from '../../components/System/Role/list';
import Modal from '../../components/System/Role/modal';

const Role = ({ dispatch, cloudState }) => {
  const {
    visible,
    realname,
    gender,
    mobile,
    provinceName,
    cityName,
    districtName,
    address,
    post,
    searchInfo,
    listPagination,
    title,
    checkedRole,
    authorityTreeData,
    postList,
    orderby,
    modalKey,
    provinceList,
    cityList,
    districtList,
    roleList,
    deleteBtnStatus,
    startBtnStatus,
    blockBtnStatus,
    checkedRoleId,
    checkedRoleStartId,
    checkedRoleBlockId,
    storeid,
    authStores,
    idCard,
    editStoreId,
    status,
    roleId,
    tenantid,
    province,
    city,
    district,
    loading,
  } = cloudState.role;
  // 取得role页面的button权限
  const roleButton = cloudState.account.buttonPermissions.system.set.role;
  const searchProps = {
    loading,
    searchInfo,
    storeid,
    status,
    orderby,
    checkedRole,
    deleteBtnStatus, // 删除按钮禁用状态
    startBtnStatus,  // 启用按钮禁用状态
    blockBtnStatus,  // 停用按钮禁用状态
    checkedRoleStartId, // 选中可停用员工id
    checkedRoleBlockId, // 选中可启用员工id
    authorityTreeData,
    checkedRoleId,
    roleButton,
    onAdd() {
      dispatch({
        type: 'role/updateState',
        payload: {
          realname: '',
          mobile: '',
          post: '',
          gender: 1,
          provinceName: '',
          cityName: '',
          districtName: '',
          address: '',
          authStores: [],
          idCard: '',
          editStoreId: '',
          title: '新增员工',
          roleId: '',
        },
      });
      dispatch({
        type: 'role/queryProvinceList',
      });
      dispatch({
        type: 'role/queryPostList',
      });
      dispatch({
        type: 'role/showModal',
      });
    },
    // 停用
    onBlock() {
      const checkedRoleIds = checkedRoleStartId.join(',');
      dispatch({
        type: 'role/enableOrDisable',
        payload: {
          ids: checkedRoleIds,
          status: '0',
        },
      });
      dispatch({
        type: 'role/updateState',
        payload: {
          checkedRoleId: [],
          checkedRole: [],
          checkedRoleStartId: [], // 选中可停用员工id
          checkedRoleBlockId: [], // 选中可启用员工id
          deleteBtnStatus: true,
          startBtnStatus: true,
          blockBtnStatus: true,
        },
      });
    },
    // 启用
    onStart() {
      const checkedRoleIds = checkedRoleBlockId.join(',');
      dispatch({
        type: 'role/enableOrDisable',
        payload: {
          ids: checkedRoleIds,
          status: '1',
        },
      });
      dispatch({
        type: 'role/updateState',
        payload: {
          checkedRoleId: [],
          checkedRole: [],
          checkedRoleStartId: [], // 选中可停用员工id
          checkedRoleBlockId: [], // 选中可启用员工id
          deleteBtnStatus: true,
          startBtnStatus: true,
          blockBtnStatus: true,

        },
      });
    },
    // 删除
    onDelete() {
      const checkedRoleIds = checkedRoleId.join(',');
      dispatch({
        type: 'role/deleteRole',
        payload: {
          ids: checkedRoleIds,
        },
      });
      dispatch({
        type: 'role/updateState',
        payload: {
          checkedRoleId: [],
          checkedRole: [],
          checkedRoleStartId: [], // 选中可停用员工id
          checkedRoleBlockId: [], // 选中可启用员工id
          deleteBtnStatus: true,
          startBtnStatus: true,
          blockBtnStatus: true,
        },
      });
    },
    // 搜索输入
    onSearchItem(event) {
      dispatch({
        type: 'role/updateState',
        payload: {
          searchInfo: event.target.value,
        },
      });
    },
    // 清空搜索条件
    onClearSearch() {
      dispatch({
        type: 'role/updateState',
        payload: {
          searchInfo: '',
        },
      });
    },
    // 搜索按钮
    onSearch() {
      dispatch({
        type: 'role/queryList',
        payload: {
          page: {
            pageno: 1, // 查看第几页内容 默认1
            rowcount: 10, // 一页展示条数 默认10
            orderby: (Object.keys(orderby).length === 0) ? {} : orderby,
          },
          key: searchInfo,
          storeids: storeid,
          status,
        },
      });
    },
    // 隶属机构
    onSubsidiaryTreeChange(selectedKeys) {
      dispatch({
        type: 'role/updateState',
        payload: {
          pageNo: 1,
          storeid: selectedKeys.join(','),
        },
      });
      dispatch({
        type: 'role/queryList',
        payload: {
          page: {
            pageno: 1, // 查看第几页内容 默认1
            rowcount: 10, // 一页展示条数 默认10
            orderby: (Object.keys(orderby).length === 0) ? {} : orderby,
          },
          key: searchInfo,
          storeids: selectedKeys.join(','),
          status,
        },
      });
    },
    onChangeStatus(event) {
      dispatch({
        type: 'role/queryList',
        payload: {
          page: {
            pageno: 1, // 查看第几页内容 默认1
            rowcount: 10, // 一页展示条数 默认10
            orderby: (Object.keys(orderby).length === 0) ? {} : orderby,
          },
          key: searchInfo,
          storeids: storeid,
          status: event.target.value,
        },
      });
      dispatch({
        type: 'role/updateState',
        payload: {
          status: event.target.value,
        },
      });
    },
  };
  const listProps = {
    listPagination,
    storeid,
    status,
    searchInfo,
    orderby,
    roleList,
    checkedRoleId,
    roleButton,
    loading,
    onEdit(record) {
      dispatch({
        type: 'role/updateState',
        payload: {
          roleId: record.id,
          title: '编辑员工',
          realname: '',
          mobile: '',
          post: '',
          gender: null,
          provinceName: '',
          cityName: '',
          districtName: '',
          address: '',
          editStoreId: '',
          authStores: [],
          idCard: '',
        },
      });
      dispatch({
        type: 'role/editRole',
        payload: {
          id: record.id,
        },
      });
      dispatch({
        type: 'role/queryProvinceList',
      });
      dispatch({
        type: 'role/queryPostList',
      });
      dispatch({
        type: 'role/showModal',
      });
    },
    onDelectRole(idAarray) {
      const checkedRoleIds = []; // 删除后数组
      const checkedArray = []; // 去除后的状态数组
      const startArray = [];      // 启用按钮数组
      const blockArray = [];      //  停用按钮数组
      checkedRoleId.map((item) => {
        if (idAarray.indexOf(item) < 0) {
          checkedRoleIds.push(item);
        }
        return null;
      });
      checkedRole.map((item) => {
        if (idAarray.indexOf(item.id) < 0) {
          checkedArray.push(item);
        }
        return null;
      });
      const judgeStartArray = checkedArray.filter(item => item.status === 1);
      const judgeBlockArray = checkedArray.filter(item => item.status === 0);
      judgeStartArray.map((item) => {
        startArray.push(item.id);
        return null;
      });
      judgeBlockArray.map((item) => {
        blockArray.push(item.id);
        return null;
      });
      dispatch({
        type: 'role/updateState',
        payload: {
          deleteBtnStatus: !((checkedArray.length > 0)),
          startBtnStatus: (judgeStartArray.length === checkedArray.length),
          blockBtnStatus: (judgeBlockArray.length === checkedArray.length),
          checkedRole: checkedArray,
          checkedRoleId: checkedRoleIds,
          checkedRoleStartId: startArray, // 选中可停用员工id
          checkedRoleBlockId: blockArray, // 选中可启用员工id
        },
      });
    },
    // 选择员工
    onSelectRole(selectedRows, record) {
      const checkedArray = [];   // 状态数组
      const checkedRoleIds = [];  // 员工Id
      record.map((item) => {
        checkedArray.push({ id: item.id, status: item.status });
        checkedRoleIds.push(item.id);
        return null;
      });
      dispatch({
        type: 'role/updateState',
        payload: {
          checkedRole: [...checkedRole, ...checkedArray],
          checkedRoleId: [...checkedRoleIds, ...checkedRoleId],
        },
      });
      dispatch({
        type: 'role/judgeStatus',
      });
    },
    onChangeSorter(pagination) {
      dispatch({
        type: 'role/queryList',
        payload: {
          page: {
            pageno: pagination.current, // 查看第几页内容 默认1
            rowcount: pagination.pageSize, // 一页展示条数 默认10
            orderby: (Object.keys(orderby).length === 0) ? {} : orderby,
          },
          key: searchInfo,
          storeids: storeid,
          status,
        },
      });
    },
  };
  const modalProps = {
    loading,
    maskClosable: false,
    visible,
    title,
    roleId,
    tenantid,
    realname,
    mobile,
    province,
    city,
    district,
    gender,
    provinceName,
    cityName,
    districtName,
    address,
    post,
    storeid,
    authStores,
    idCard,
    postList,
    provinceList,
    cityList,
    districtList,
    authorityTreeData,
    editStoreId,
    key: modalKey,
    onChange(value) {
      dispatch({
        type: 'role/updateState',
        payload: {
          authStores: value,
        },
      });
    },
    onSubmit(value) {
      const {
        post_id,
        stores,
        id_card,
      } = value;
      dispatch({
        type: 'role/addRole',
        payload: {
          id: roleId,
          tenantId: tenantid,
          storeId: value.editStoreId,
          province,
          city,
          district,
          postId: post_id,
          authStores: stores,
          idCard: id_card,
          realname: value.realname,
          mobile: value.mobile,
          gender: value.gender,
          address: value.address,
        },
      });
    },
    onCancel() {
      dispatch({
        type: 'role/updateState',
        payload: {
          visible: false,
          roleId: '',
        },
      });
    },
    onProvinceChange(selectedKeys, info) {
      dispatch({
        type: 'role/updateState',
        payload: {
          province: selectedKeys,
          provinceName: info.props.children,
          city: '',
          district: '',
          cityName: '请选择',
          districtName: '请选择',
        },
      });
      dispatch({
        type: 'role/queryAreaListByParentId',
        payload: {
          parentid: selectedKeys,
          flag: 'provinceClick',
        },
      });
    },
    onCityChange(selectedKeys, info) {
      dispatch({
        type: 'role/updateState',
        payload: {
          city: selectedKeys,
          cityName: info.props.children,
        },
      });
      dispatch({
        type: 'role/queryAreaListByParentId',
        payload: {
          parentid: selectedKeys,
          flag: 'cityClick',
        },
      });
    },
    onDistrictChange(selectedKeys, info) {
      console.log('key', selectedKeys);
      dispatch({
        type: 'role/updateState',
        payload: {
          district: selectedKeys,
          districtName: info.props.children,

        },
      });
    },
  };
  return (
    // noinspection JSAnnotator
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

Role.propTypes = {
  dispatch: PropTypes.func,
  cloudState: PropTypes.object,
};
export default connect(mapStateToProps)(Role);
