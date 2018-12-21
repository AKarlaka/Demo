import React, { PropTypes } from 'react';
import { Table, Row, Col, Badge } from 'antd';

const list = ({
   loading,
   roleButton,
   roleList,
   checkedRoleId,
   onEdit,
   onSelectRole,
   listPagination,
   onChangeSorter,
   onDelectRole,
  }) => {
  const disabled = roleButton && roleButton.edit;
  const columns = [{
    title: '角色名称',
    dataIndex: 'postName',
    key: 'postName',
  }, {
    title: '所含员工数',
    dataIndex: 'userCount',
    key: 'userCount',
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      const badgeProps = {
        status: text === 1 ? 'success' : 'default',
        text: text === 1 ? '正常' : '停用',
      };
      return (<Badge {...badgeProps} />);
    },
  }, {
    title: '操作',
    dataIndex: 'option',
    key: 'option',
    render: (text, record) => (
      <span>
        { disabled && <button className="btn-link" onClick={() => onEdit(record)}>编辑</button> }
        { !disabled && <span>编辑</span> }
      </span>
    ),
  }];
  const rowSelection = {
    onSelect: (record, selected, selectedRows) => {
      if (!selected) {
        onDelectRole([record.id]);
      } else {
        onSelectRole(selectedRows, [{ id: record.id, status: record.status }]);
      }
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      const changeRowsIds = [];
      changeRows.map((item) => {
        changeRowsIds.push(item.id);
        return null;
      });
      if (!selected) {
        onDelectRole(changeRowsIds);
      } else {
        onSelectRole(selectedRows, changeRows);
      }
    },
    selectedRowKeys: checkedRoleId,
  };
  return (<div>
    <Row gutter={16}>
      <Col span={24}>
        <Table
          loading={loading}
          columns={columns}
          dataSource={roleList}
          pagination={listPagination}
          bordered
          rowSelection={rowSelection}
          rowKey={record => record.id}
          onChange={onChangeSorter}
        />
      </Col>
    </Row>
  </div>);
};
list.propTypes = {
  onEdit: PropTypes.func,
  roleButton: PropTypes.object,
  roleList: PropTypes.array,
  checkedRoleId: PropTypes.array,
  onChangeSorter: PropTypes.func,
  onSelectRole: PropTypes.func,
  listPagination: PropTypes.object,
  loading: PropTypes.bool,
  onDelectRole: PropTypes.func,
};

export default list;
