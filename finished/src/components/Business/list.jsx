import React, { PropTypes } from 'react';
import { Table, Row, Col, Badge, Menu, Dropdown, Icon } from 'antd';
import { Link } from 'dva/router';
import config from '../../utils/config';

const list = ({
    dataList,
    checkedBussinessId,
    pagination,
    loading,
    onEdit,
    onDelete,
    onChangeSorter,
    onSelectBusiness,
  }) => {
  const columns = [{
    title: '商户名称',
    dataIndex: 'tenName',
    key: 'tenName',
  }, {
    title: '管理员',
    dataIndex: 'superName',
    key: 'superName',
  }, {
    title: '管理员手机号',
    dataIndex: 'superMobile',
    key: 'superMobile',
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    // sorter: (a, b) => b.status - a.status,
    render: (text) => {
      let statusTxt = '';
      if (text === 1) {
        statusTxt = <Badge status="success" text="正常" />;
      } else if (text === 0) {
        statusTxt = <Badge status="default" text="停用" />;
      }
      return statusTxt;
    },
  }, {
    title: '操作',
    dataIndex: 'option',
    key: 'option',
    render: (text, record) => {
      const menu = (
        <Menu>
          <Menu.Item>
            <Link target={'_blank'} href={`${config.jarUrl}/${record.id}/choiceassembly.jar`}>下载配置包</Link>
          </Menu.Item>
          <Menu.Item>
            <Link target={'_blank'} href={`${config.fileUrl}${record.id}`}>下载配置文件</Link>
          </Menu.Item>
        </Menu>
      );
      return (<span>
        <button className="btn-link" onClick={() => onEdit(record)}>编辑</button>
        <span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
        <Link to={`/business/receiptAccount/${record.id}`}>收款账号管理</Link>
        <span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
        <Link to={`/business/app/${record.id}`}>应用管理</Link>
        <span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
        <Dropdown overlay={menu}>
          <button className="ant-dropdown-link btn-link">
            更多<Icon type="down" />
          </button>
        </Dropdown>
      </span>
      );
    },
  }];
  const rowSelection = {
    // 单选是否选中
    onSelect: (record, selected, selectedRows) => {
      if (!selected) {
        onDelete([record.id]);
      } else {
        onSelectBusiness(selectedRows, [{ id: record.id, status: record.status }]);
      }
    },
    // 全选是否选中
    onSelectAll: (selected, selectedRows, changeRows) => {
      const changeRowsIds = [];
      changeRows.map((item) => {
        changeRowsIds.push(item.id);
        return false;
      });
      if (!selected) {
        onDelete(changeRowsIds);
      } else {
        onSelectBusiness(selectedRows, changeRows);
      }
    },
    selectedRowKeys: checkedBussinessId,
  };
  return (
    <div className="components-staffManagement">
      <Row gutter={16} className="list">
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={dataList}
            pagination={pagination}
            bordered
            rowSelection={rowSelection}
            rowKey={record => record.id}
            onChange={onChangeSorter}
            loading={loading}
          />
        </Col>
      </Row>
    </div>);
};
list.propTypes = {
  loading: PropTypes.bool,
  dataList: PropTypes.array,
  checkedBussinessId: PropTypes.array,
  pagination: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onSelectBusiness: PropTypes.func,
  onChangeSorter: PropTypes.func,
};

export default list;
