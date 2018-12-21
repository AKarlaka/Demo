/**
 * Created by zhangnaiying on 2018/09/03
 */
import React, { PropTypes } from 'react';
import { Button, Row, Col, Form, Select, Input } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

const search = ({
  onSearch,
  form: {
    getFieldDecorator,
    getFieldsValue,
    resetFields,
  },
}) => {
  const handleSearch = (e) => {
    if (e.target) {
      if (e.target.innerText === '清除条件') {
        resetFields();
        onSearch();
      } else {
        const data = getFieldsValue();
        onSearch(data);
      }
    }
  };
  const handleInputSearch = () => {
    const data = getFieldsValue();
    onSearch(data);
  };
  return (
    <div>
      <div className="components-search search">
        <div className="action-box">
          <Form layout="inline">
            <Row >
              <Col md={8} xxl={6}>
                <FormItem label="到期状态">
                  {getFieldDecorator('overdueType', {
                    initialValue: '-1',
                  })(
                    <Select>
                      <Option key={-1} >全部</Option>
                      <Option key={1} >即将到期</Option>
                      <Option key={2} >已到期</Option>
                      <Option key={3} >严重逾期</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={2} xxl={8} />
              <Col md={8} xxl={6}>
                <FormItem label="商户">
                  {getFieldDecorator('tenantName', {
                    initialValue: '',
                  })(
                    <Search placeholder="搜索商户" onSearch={handleInputSearch} />,
                  )}
                </FormItem>
              </Col>
              <Col md={6} xxl={4} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={handleSearch}>搜索</Button>
                <Button type="default" onClick={handleSearch}>清除条件</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

search.propTypes = {
  form: PropTypes.object,
  onSearch: PropTypes.func,
};

export default Form.create()(search);
