/**
 * Create by liukang on 2018/03/06
 * */
import React, { PropTypes } from 'react';
import { Table, Row, Col } from 'antd';

const list = ({ selectedRows, onEidt, onSelect, ...props }) => {
  const columns = [{
    title: 'ISV',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '操作',
    dataIndex: 'option',
    key: 'option',
    render: (text, record) => (
      <span>
        <button className="btn-link" onClick={() => onEidt(record)}>编辑</button>
      </span>
    ),
  }];
  const rowSelection = {
    onChange: (selectedRowKeys, Rows) => {
      onSelect(Rows);
    },
    selectedRowKeys: selectedRows.map(item => item.id),
  };
  const tableProps = {
    rowKey: record => record.id,
    rowSelection,
    columns,
    ...props,
  };
  return (
    <div className="components-staffManagement">
      <Row gutter={16} className="list">
        <Col span={24}>
          <Table
            bordered
            {...tableProps}
          />
        </Col>
      </Row>
    </div>);
};

list.propTypes = {
  selectedRows: PropTypes.array,
  onEidt: PropTypes.func,
  onSelect: PropTypes.func,
};

export default list;
