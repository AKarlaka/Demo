/**
 * Create by xiaochenghua on 2018/02/01
 * */
import React, { PropTypes } from 'react';
import { Table, Badge } from 'antd';
// import {config} from '../../utils';

const List = ({
  selectedItemsId,
  loading,
  pagination,
  dataList,
  onEdit,
  onViewPath,
  onSelectItem,
  onDeleteItem,
  onPageChange,
  onRelation,
}) => {
  const columns = [{
    title: '应用名称',
    dataIndex: 'applicationName',
    key: 'applicationName',
  }, {
    title: '排序',
    dataIndex: 'applicationOrder',
    key: 'applicationOrder',
  }, {
    title: '收费',
    dataIndex: 'sellStrategy',
    key: 'sellStrategy',
    render: (text) => {
      if (text === 1) {
        return '收费';
      }
      return '免费';
    },
  },
  // {
  //   title: '是否需要审核',
  //   dataIndex: 'verifyStrategy',
  //   key: 'verifyStrategy',
  //   render: (text) => {
  //     if (text) {
  //       return '否';
  //     }
  //     return '是';
  //   },
  // },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => a.status - b.status,
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
    render: (text, item) => (
      <span>
        <button className="btn-link" onClick={() => onEdit(item)}>编辑</button>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <button className="btn-link" onClick={() => onViewPath(item.id)}>图文编辑</button>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <button className="btn-link" onClick={() => onRelation(item.id)}>应用关系</button>
      </span>
    ),
  },
  ];
  const rowSelection = {
    // 单选
    onSelect: (record, selected, selectedRows) => {
      if (selected) {
        onSelectItem(selectedRows, [{ id: record.id, status: record.status }]);
      } else {
        onDeleteItem([record.id]);
      }
    },
    // 多选
    onSelectAll: (selected, selectedRows, changeRows) => {
      const changeRowsIds = [];
      changeRows.map((item) => {
        changeRowsIds.push(item.id);
        return false;
      });
      if (selected) {
        onSelectItem(selectedRows, changeRows);
      } else {
        onDeleteItem(changeRowsIds);
      }
    },
    selectedRowKeys: selectedItemsId,
  };
  return (
    <div>
      <Table
        bordered
        rowKey={item => item.id}
        dataSource={dataList}
        rowSelection={rowSelection}
        columns={columns}
        pagination={pagination}
        style={{ marginTop: 10 }}
        onChange={onPageChange}
        loading={loading}
        scroll={{ x: 900 }}
      />
    </div>
  );
};

List.propTypes = {
  loading: PropTypes.bool,
  dataList: PropTypes.array,
  selectedItemsId: PropTypes.array,
  pagination: PropTypes.object,
  onEdit: PropTypes.func,
  onViewPath: PropTypes.func,
  onSelectItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onPageChange: PropTypes.func,
  onRelation: PropTypes.func,
};

export default List;

