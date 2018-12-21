/**
 * Created by zhangnaiying on 2018/08/31
 */
import React, { PropTypes } from 'react';
import { Button, Row, Col, Modal } from 'antd';

const confirm = Modal.confirm;
const _ = require('lodash');

const resolve = _.partial(_.map, _, 'id');

const search = ({
  selectedRows,
  onDelete,
  onEnable,
  onDisable,
  onOrder,
}) => {
  const canDisableList = _.filter(selectedRows, item => item.appStatus === '1');
  const canEnableList = _.filter(selectedRows, item => item.appStatus === '0');
  const shopTypeList = _.filter(selectedRows, item => item.appStatus === '-1');
  shopTypeList.map((item) => {
    if (item.shopUsedCount !== '0') {
      canDisableList.push(item);
    }
    return null;
  });
  shopTypeList.map((item) => {
    if (item.shopUsedCount === '0') {
      canEnableList.push(item);
    }
    return null;
  });
  const handleShowConfirm = (e) => {
    const info = e.target.value;
    let content = '';
    switch (info) {
      case '删除':
        content = `您选中了${selectedRows.length}条数据，可以删除${selectedRows.length}条数据`;
        break;
      case '启用':
        content = `您选中了${selectedRows.length}条数据，可以启用${canEnableList.length}条数据`;
        break;
      case '停用':
        content = `您选中了${selectedRows.length}条数据，可以停用${canDisableList.length}条数据`;
        break;
      default:
        break;
    }
    confirm({
      title: `确定${e.target.value}吗？`,
      content,
      cancelText: '取消',
      okText: '确定',
      onOk() {
        switch (info) {
          case '删除':
            onDelete(resolve(selectedRows));
            break;
          case '启用':
            onEnable(resolve(selectedRows));
            break;
          case '停用':
            onDisable(resolve(selectedRows));
            break;
          default:
            break;
        }
      },
      onCancel() {},
    });
  };
  return (
    <div>
      <div className="components-search search">
        <div className="action-box">
          <Row>
            <Col span={16}>
              <Button type="primary" onClick={onOrder}>订购应用</Button>
              <Button value="停用" disabled={canDisableList.length === 0} onClick={handleShowConfirm}>停用</Button>
              <Button value="启用" disabled={canEnableList.length === 0} onClick={handleShowConfirm}>启用</Button>
              <Button value="删除" disabled={selectedRows.length === 0} onClick={handleShowConfirm}>删除</Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

search.propTypes = {
  selectedRows: PropTypes.array,
  onDelete: PropTypes.func,
  onEnable: PropTypes.func,
  onDisable: PropTypes.func,
  onOrder: PropTypes.func,
};

export default search;
