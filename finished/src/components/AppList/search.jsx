/**
 * Create by xiaochenghua on 2018/02/01
 * */
import React, { PropTypes } from 'react';
import { Button, Input, Row, Col, Icon, Modal, Form } from 'antd';

const FormItem = Form.Item;
const confirm = Modal.confirm;

const search = ({
  name,
  stopFlag,
  startFlag,
  removeFlag,
  selectedItem,
  selectedStart,
  selectedStop,
  onAdd,
  onStop,
  onStart,
  onDelete,
  onSearch,
  onClearName,
  onSearchChange,
}) => {
  // 确认弹窗
  const handleShowConfirm = (e) => {
    const info = e.target.value;
    let AppNumber = 0;
    let content = '';
    const selectedItemNumber = selectedItem.length;
    switch (info) {
      case '删除':
        AppNumber = selectedItem.length;
        content = `删除选中的${AppNumber}个应用！`;
        break;
      case '启用':
        AppNumber = selectedStart.length;
        content = `当前选中${selectedItemNumber}个应用，可启用${AppNumber}个应用！`;
        break;
      case '停用':
        AppNumber = selectedStop.length;
        content = `当前选中${selectedItemNumber}个应用，可停用${AppNumber}个应用！`;
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
            onDelete();
            break;
          case '启用':
            onStart();
            break;
          case '停用':
            onStop();
            break;
          default:
            break;
        }
      },
      onCancel() {
      },
    });
  };
  return (
    <div className="components-search search">
      <div className="action-box">
        <Form layout="inline">
          <Row>
            <Col span={8}>
              <FormItem label="条件">
                <Input
                  key="search"
                  value={name}
                  onChange={onSearchChange}
                  onPressEnter={onSearch}
                  placeholder="输入应用名称"
                  suffix={name &&
                  <Icon
                    type="close-circle"
                    style={{ fontSize: 13, color: 'rgba(0, 0, 0, 0.35)', cursor: 'pointer', marginRight: '8px' }}
                    onClick={onClearName}
                  />}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <Button type="primary" onClick={onSearch}>搜索</Button>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <Button value="新增应用" type="primary" icon="plus" onClick={onAdd}>新增应用</Button>
              <Button value="停用" disabled={stopFlag} onClick={handleShowConfirm}>停用</Button>
              <Button value="启用" disabled={startFlag} onClick={handleShowConfirm}>启用</Button>
              <Button value="删除" disabled={removeFlag} onClick={handleShowConfirm}>删除</Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};


search.propTypes = {
  stopFlag: PropTypes.bool,
  startFlag: PropTypes.bool,
  removeFlag: PropTypes.bool,
  name: PropTypes.string,
  selectedItem: PropTypes.array,
  selectedStart: PropTypes.array,
  selectedStop: PropTypes.array,
  onAdd: PropTypes.func,
  onStop: PropTypes.func,
  onStart: PropTypes.func,
  onDelete: PropTypes.func,
  onSearch: PropTypes.func,
  onClearName: PropTypes.func,
  onSearchChange: PropTypes.func,
};

export default search;
