/**
 * Create by liukang on 2018/03/06
 * */
import React, { PropTypes } from 'react';
import { Table, Row, Col } from 'antd';

const list = ({ onEidt, ...props }) => {
  const columns = [{
    title: '服务商',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '开通的支付渠道',
    dataIndex: 'code',
    key: 'code',
    render: (text, record) =>
      (record.channels && record.channels.length > 0 ?
      record.channels.map((it, index) => (
        <span style={{ color: 'rgb(148, 148, 148)' }} key={index}>&nbsp;{ it.name }&nbsp;</span>
      )) : <span>-</span>),
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
  const tableProps = {
    rowKey: record => record.id,
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
  onEidt: PropTypes.func,
};

export default list;
