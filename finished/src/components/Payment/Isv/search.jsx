/**
 * Create by liukang on 2018/03/06
 * */
import React, { PropTypes } from 'react';
import { Input, Form, Button, Row, Col, Icon, Modal, message } from 'antd';

const confirm = Modal.confirm;
const FormItem = Form.Item;

const search = ({
  searchInfo,
  selectedRows,
  onSearchChange,
  onSearch,
  onClearSearchInfo,
  onAdd,
  onDelete,
}) => {
  // 显示弹框
  const handleConfirmDel = () => {
    const CheckedSelectedRows = selectedRows.length;
    if (CheckedSelectedRows <= 0) {
      message.warning('没有选择的ISV');
      return;
    }
    confirm({
      title: '确定删除吗？',
      content: `已选中${CheckedSelectedRows}条数据，确定删除这些ISV吗？`,
      cancelText: '取消',
      okText: '确定',
      onOk() {
        onDelete();
      },
      onCancel() {},
    });
  };
  return (
    <div className="components-search search">
      <div className="action-box">
        <Form layout="inline">
          <Row>
            <Col span={8} >
              <FormItem label="ISV名称" >
                <Input
                  key="search"
                  value={searchInfo}
                  onChange={onSearchChange}
                  onPressEnter={onSearch}
                  placeholder="输入ISV名称"
                  suffix={searchInfo &&
                  <Icon
                    type="close-circle"
                    style={{ fontSize: 13, color: 'rgba(0, 0, 0, 0.35)', cursor: 'pointer', marginRight: '8px' }}
                    onClick={onClearSearchInfo}
                  />}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <Button type="primary" onClick={onSearch} >搜索</Button>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Button value="添加" type="primary" icon="plus" onClick={onAdd}>新增ISV</Button>
              <Button value="删除" onClick={handleConfirmDel}>删除</Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};


search.propTypes = {
  searchInfo: PropTypes.string,
  selectedRows: PropTypes.array,
  onSearchChange: PropTypes.func,
  onSearch: PropTypes.func,
  onClearSearchInfo: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
};

export default search;
