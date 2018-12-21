/**
 * Create by liukang on 2018/03/06
 * */
import React, { PropTypes } from 'react';
import { Input, Button, Row, Col, Icon, Modal, message, Form } from 'antd';

const FormItem = Form.Item;
const confirm = Modal.confirm;

const search = ({
  selectedRows,
  searchInfo,
  onSearchChange,
  onSearch,
  onAdd,
  onClearSearchInfo,
  onBack,
  onUnbind,
}) => {
  // 显示弹框
  const showConfirm = (e) => {
    const info = e.target.value;
    let content = '';
    const CheckedSelectedRows = selectedRows.length;
    if (CheckedSelectedRows <= 0) {
      message.warning('没有选择的账户');
      return;
    }
    switch (info) {
      case '取消绑定':
        content = `当前选中${CheckedSelectedRows}个门店，确定取消绑定吗！`;
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
          case '取消绑定':
            onUnbind();
            break;
          default:
            break;
        }
      },
      onCancel() {},
    });
  };

  return (
    <div className="components-search search">
      <div className="action-box">
        <Form layout="inline">
          <Row>
            <Col span={8}>
              <FormItem label="门店名称">
                <Input
                  key="search"
                  value={searchInfo}
                  onChange={onSearchChange}
                  onPressEnter={onSearch}
                  placeholder="输入门店名称"
                  suffix={searchInfo &&
                  <Icon
                    type="close-circle"
                    style={{ fontSize: 13, color: 'rgba(0, 0, 0, 0.35)', cursor: 'pointer' }}
                    onClick={onClearSearchInfo}
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
            <Col span={12}>
              <Button onClick={onAdd} type="primary">绑定门店</Button>
              <Button value="取消绑定" onClick={showConfirm}>取消绑定</Button>
              <Button value="后退" onClick={onBack}>后退</Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>);
};

search.propTypes = {
  searchInfo: PropTypes.string,
  selectedRows: PropTypes.array,
  onSearchChange: PropTypes.func,
  onSearch: PropTypes.func,
  onClearSearchInfo: PropTypes.func,
  onAdd: PropTypes.func,
  onBack: PropTypes.func,
  onUnbind: PropTypes.func,
};

export default search;
