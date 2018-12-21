/**
 * Create by liukang on 2018/03/06
 * */
import React, { PropTypes } from 'react';
import { Input, Form, Row, Col, Icon, Button } from 'antd';

const FormItem = Form.Item;

const search = ({
  searchInfo,
  onSearchChange,
  onSearch,
  onClearSearchInfo,
}) => (
  <div className="components-search search">
    <div className="action-box">
      <Form layout="inline">
        <Row>
          <Col span={8} >
            <FormItem label="服务商">
              <Input
                key="search"
                value={searchInfo}
                onChange={onSearchChange}
                onPressEnter={onSearch}
                placeholder="输入聚合服务商"
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
      </Form>
    </div>
  </div>
);


search.propTypes = {
  searchInfo: PropTypes.string,
  onSearchChange: PropTypes.func,
  onSearch: PropTypes.func,
  onClearSearchInfo: PropTypes.func,
};

export default search;
