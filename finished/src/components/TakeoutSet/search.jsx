/**
 * Create by xiaochenghua on 2018/03/10
 * */
import React, { PropTypes } from 'react';
import { Form, Input, Row, Col, Button, Select, Modal } from 'antd';

const confirm = Modal.confirm;

const FormItem = Form.Item;
const Option = Select.Option;

const search = ({
  loading,
  name,
  type,
  selections,
  onAdd,
  onDelete,
  onSearch,
  onClear,
  onChangeType,
  onChangeName,
                }) => {
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };
  // 显示弹框
  const handleShowConfirm = () => {
    confirm({
      title: '确定删除吗？',
      cancelText: '取消',
      okText: '确定',
      onOk() {
        onDelete();
      },
      onCancel() {},
    });
  };
  return (
    <div className="search">
      <Form>
        <Row>
          <Col span={8} xl={8} xxl={6}>
            <FormItem
              {...formItemLayout}
              label="类型"
            >
              <Select value={type} onChange={val => onChangeType(val)} >
                <Option key="0" value="">全部</Option>
                <Option key="1" value="meiTuan">美团外卖</Option>
                <Option key="2" value="eleme">饿了么</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={8} xl={8} xxl={6}>
            <FormItem
              {...formItemLayout}
              label="条件"
            >
              <Input value={name} onChange={e => onChangeName(e)} placeholder="名称、Appid、key、secret、商户名称查询" />
            </FormItem>
          </Col>
          <Col span={8} xl={8} xxl={6} className="search-btn" style={{ textAlign: 'right' }} >
            <Button type="primary" onClick={onSearch} style={{ marginRight: 30 }} >搜索</Button>
            <Button onClick={onClear}>清除条件</Button>
          </Col>
        </Row>
      </Form>
      <div className="action-box">
        <Row>
          <Col span={12}>
            <Button type="primary" onClick={onAdd}>+ 新增</Button>
            <Button
              onClick={handleShowConfirm}
              disabled={!selections.length}
              loading={loading}
            >删除</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};
search.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  selections: PropTypes.array,
  loading: PropTypes.bool,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onSearch: PropTypes.func,
  onChangeType: PropTypes.func,
  onClear: PropTypes.func,
  onChangeName: PropTypes.func,
};
export default Form.create()(search);
