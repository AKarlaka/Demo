/**
 * Created by zhangnaiying on 2018/09/02
 */
import React, { PropTypes } from 'react';
import { Table, Badge } from 'antd';

const _ = require('lodash');

const list = ({
  loading,
  pagination,
  dataList,
  selectedRows,
  onEditTime,
  onSelectRow,
  onDelectRow,
  onPageChange,
}) => {
  const columns = [{
    title: '门店名称/ID',
    dataIndex: 'shop',
    key: 'shop',
    render: (text, record) => (
      <div>
        <p>{record.shopName}</p>
        <p>{record.shopId}</p>
      </div>
      ),
  }, {
    title: '到期时间',
    dataIndex: 'expirationTime',
    key: 'expirationTime',
    render: text => new Date(text).Format('yyyy-MM-dd hh:mm:ss'),
  }, {
    title: '配置',
    dataIndex: 'edition',
    key: 'edition',
    render: (text, record) => {
      if (record.editionName) {
        return record.editionName[0].name;
      }
      return '---';
    },
  }, {
    title: '到期状态',
    dataIndex: 'storeTimeStatus',
    key: 'storeTimeStatus',
    render: (text) => {
      let statusTxt = '';
      if (text === '0') {
        statusTxt = <Badge status="success" text="未到期" />;
      } else if (text === '1') {
        statusTxt = <Badge status="warning" text="即将到期" />;
      } else if (text === '2') {
        statusTxt = <Badge status="error" text="已到期" />;
      } else if (text === '3') {
        statusTxt = <Badge status="error" text="严重逾期" />;
      }
      return statusTxt;
    },
  }, {
    title: '状态',
    dataIndex: 'storeStatus',
    key: 'storeStatus',
    render: (text) => {
      let statusTxt = '';
      if (text === '1') {
        statusTxt = <Badge status="success" text="正常" />;
      } else if (text === '0') {
        statusTxt = <Badge status="error" text="停用" />;
      }
      return statusTxt;
    },
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => {
      if (record.storeStatus === '1') {
        return (
          <span>
            <button className="btn-link" onClick={() => onEditTime(record)}>修改到期时间</button>
          </span>
        );
      }
      return '---';
    },
  }];
  const resolve = _.partial(_.map, _, 'shopId');
  const rowSelection = {
    onSelect: (selectRow, selected) => {
      if (selected) {
        onSelectRow(selectRow);
      } else {
        onDelectRow(selectRow);
      }
    },
    onSelectAll: (selected, selectRows) => {
      if (selected) {
        onSelectRow(selectRows);
      } else {
        onDelectRow(selectRows);
      }
    },
    selectedRowKeys: resolve(selectedRows),
  };
  return (
    <Table
      bordered
      loading={loading}
      rowKey={item => item.shopId}
      dataSource={dataList}
      rowSelection={rowSelection}
      columns={columns}
      pagination={pagination}
      onChange={onPageChange}
    />
  );
};

list.propTypes = {
  loading: PropTypes.bool,
  dataList: PropTypes.array,
  selectedRows: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onEditTime: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDelectRow: PropTypes.func,
};

export default list;
