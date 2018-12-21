/**
 * Create by xiaochenghua on 2018/03/10
 * */
import React, { PropTypes } from 'react';
import { Table } from 'antd';

const list = ({
  // pagination,
  loading,
  dataList,
  onEdit,
  onSelected,
  }) => {
  const rowSelection = {
    // 单选是否选中
    onSelect(record, selected, selectedRows) {
      onSelected(selectedRows);
    },
    // 多选是否选中
    onSelectAll(selected, selectedRows) {
      onSelected(selectedRows);
    },
  };
  const columns = [{
    title: '名称',
    dataIndex: 'vname',
    key: 'vname',
  }, {
    title: 'AppId',
    dataIndex: 'vappid',
    key: 'vappid',
  }, {
    title: 'key',
    dataIndex: 'vappkey',
    key: 'vappkey',
  }, {
    title: 'secret',
    dataIndex: 'vsecret',
    key: 'vsecret',
  }, {
    title: '商户名称',
    dataIndex: 'groupName',
    key: 'groupName',
  }, {
    title: '类型',
    dataIndex: 'vtype',
    key: 'vtype',
    render: (text) => {
      let typeName;
      if (text === 'meiTuan') {
        typeName = '美团外卖';
      } else if (text === 'baidu') {
        typeName = '百度外卖';
      } else if (text === 'eleme') {
        typeName = '饿了么';
      } else {
        typeName = '其他外卖';
      }
      return typeName;
    },
  }, {
    title: '操作',
    dataIndex: 'address',
    key: 'address',
    render: (text, record) => (<button className="btn-link" onClick={() => onEdit(record)}>编辑</button>),
  }];
  return (
    <Table
      bordered
      dataSource={dataList}
      columns={columns}
      rowSelection={rowSelection}
      loading={loading}
      pagination={false}
      rowKey={record => record.pkWmplatformconf}
    />
  );
};
list.propTypes = {
  dataList: PropTypes.array,
  loading: PropTypes.bool,
  onEdit: PropTypes.func,
  onSelected: PropTypes.func,
};
export default list;
