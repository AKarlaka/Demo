/**
 * Created by Wangtaidong on 2018/2/1.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Col, Row, Select, Input, Icon, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const search = ({
  apps,
  searchWord,
  onSelectApp,
  onSelectStatus,
  onSearchChange,
  onClear,
  onSearch,
}) => {
  // 生成选项
  const appOptions = apps.map(item =>
    <Option key={item.id} value={item.id}>{item.applicationName}</Option>,
  );

  return (
    <div className="components-search search">
      <Form layout="inline">
        <Row >
          <Col md={8} xxl={6}>
            <FormItem label="应用">
              <Select
                defaultValue="所有应用"
                onSelect={onSelectApp}
              >
                <Option key="0" value="">所有应用</Option>
                {appOptions}
              </Select>
            </FormItem>
          </Col>
          <Col md={8} xxl={6}>
            <FormItem label="状态">
              <Select
                defaultValue="所有状态"
                onSelect={onSelectStatus}
              >
                <Option key="0" value="">所有状态</Option>
                <Option key="1" value="0">待处理</Option>
                <Option key="2" value="1">已生效</Option>
                <Option key="3" value="2">已取消</Option>
                <Option key="4" value="3">未通过</Option>
              </Select>
            </FormItem>
          </Col>
          <Col md={8} xxl={6}>
            <FormItem label="条件">
              <Input
                key="search"
                value={searchWord}
                onChange={onSearchChange}
                onPressEnter={onSearch}
                placeholder="商家、订单号、联系人姓名"
                suffix={searchWord &&
                <Icon
                  type="close-circle"
                  style={{ fontSize: 13, color: 'rgba(0, 0, 0, 0.35)', cursor: 'pointer' }}
                  onClick={onClear}
                />}
              />
            </FormItem>
          </Col>
          <Col md={24} xxl={6} style={{ textAlign: 'right' }}>
            <FormItem>
              <Button type="primary" onClick={onSearch}>搜索</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

search.propTypes = {
  apps: PropTypes.array,
  searchWord: PropTypes.string,
  onSelectApp: PropTypes.func,
  onSelectStatus: PropTypes.func,
  onClear: PropTypes.func,
  onSearch: PropTypes.func,
  onSearchChange: PropTypes.func,
};

export default search;
