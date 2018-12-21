/**
 * Create by liukang on 2018/03/06
 * */
import React, { PropTypes } from 'react';
import { Table, Row, Col, Badge } from 'antd';
import { Payment } from '../../../utils/enums';

const { State } = Payment;

const list = ({ selectedRows, onSelect, onEidt, ...props }) => {
  const columns = [{
    title: '支付渠道名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    render: (text) => {
      let statusTxt = '';
      if (text === State.ENABLE) {
        statusTxt = <Badge status="success" text="正常" />;
      } else if (text === State.DISABLED) {
        statusTxt = <Badge status="default" text="停用" />;
      }
      return statusTxt;
    },
  }, {
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
    <div>
      <Row gutter={16}>
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
  onSelect: PropTypes.func,
  onEidt: PropTypes.func,
};

export default list;
