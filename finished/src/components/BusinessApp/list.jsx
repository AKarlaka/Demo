/**
 * Created by zhangnaiying on 2018/08/31
 */
import React, { PropTypes } from 'react';
import { Table, Badge } from 'antd';
import { Link } from 'dva/router';

const _ = require('lodash');

const list = ({
  loading,
  tenantId,
  pagination,
  dataList,
  selectedRows,
  onEditTime,
  onPageChange,
  onSelectRow,
  onDelectRow,
  onEditSet,
}) => {
  const columns = [{
    title: '应用',
    dataIndex: 'applicationName',
    key: 'applicationName',
  }, {
    title: '类型',
    dataIndex: 'sellType',
    key: 'sellType',
    render: (text) => {
      if (text === 0) {
        return '按门店订购';
      } else if (text === 1) {
        return '按商户订购';
      }
      return '---';
    },
  }, {
    title: '到期时间',
    dataIndex: 'expirationTime',
    key: 'expirationTime',
    render: (text) => {
      if (text) {
        return new Date(text).Format('yyyy-MM-dd hh:mm:ss');
      }
      return '---';
    },
  }, {
    title: '配置',
    dataIndex: 'edition',
    key: 'edition',
    render: (text, record) => {
      if (record.editionName) {
        if (record.sellType === 0) {
          return record.editionName.map((item, i) => (
            <p key={i}>
              {`${item.count}家${item.name}`}
            </p>
          ));
        } else if (record.sellType === 1) {
          return record.editionName[0].name;
        }
      }
      return '---';
    },
  }, {
    title: '应用状态',
    dataIndex: 'appStatus',
    key: 'appStatus',
    render: (text, record) => {
      if (text === '1') {
        return <Badge status="success" text="正常" />;
      } else if (text === '0') {
        return <Badge status="error" text="停用" />;
      } else if (text === '-1') {
        return record.shopUsedCount === '0' ? <Badge status="error" text="停用" /> : <Badge status="success" text="正常" />;
      }
      return '---';
    },
  }, {
    title: '正常门店/已订购门店数',
    width: 150,
    dataIndex: 'count',
    key: 'count',
    render: (text, record) => {
      if (record.sellType === 0) {
        return `${record.shopUsedCount ? record.shopUsedCount : '暂无数据'} / ${record.shopAllCount ? record.shopAllCount : '暂无数据'}`;
      }
      return '---';
    },
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => {
      if (record.sellType === 1) {
        if (record.appStatus === '1') {
          return (
            <span>
              <button className="btn-link" onClick={() => onEditTime(record)}>修改到期时间</button>
              <span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
              <button className="btn-link" onClick={() => onEditSet(record)}>设置</button>
            </span>
          );
        }
      } else if (record.sellType === 0 || record.sellType === null) {
        return (
          <span>
            <Link to={`/business/app/shop/${tenantId}/${record.id}`}>管理门店</Link>
          </span>
        );
      }
      return ('---');
    },
  }];

  const resolve = _.partial(_.map, _, 'id');
  const rowSelection = {
    onSelect: (selectRow, selected) => {
      if (selected) {
        onSelectRow(selectRow);
      } else {
        onDelectRow(selectRow);
      }
    },
    onSelectAll: (selected, selectRow) => {
      if (selected) {
        onSelectRow(selectRow);
      } else {
        onDelectRow(selectRow);
      }
    },
    selectedRowKeys: resolve(selectedRows),
  };
  return (
    <Table
      bordered
      loading={loading}
      rowKey={item => item.id}
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
  tenantId: PropTypes.string,
  dataList: PropTypes.array,
  selectedRows: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onEditTime: PropTypes.func,
  onEditSet: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDelectRow: PropTypes.func,
};

export default list;
