/**
 * Created by zhangnaiying on 2018/09/13
 */
import React, { PropTypes } from 'react';
import { Form, Input } from 'antd';

const FormItem = Form.Item;

const form = ({
                 item,
                 getFieldDecorator,
}) => {
  const FormItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  return (
    <div>
      <FormItem label="商户号" {...FormItemLayout}>
        {getFieldDecorator('cusid', {
          initialValue: item.cusid,
          rules: [{
            message: '请输入商户号！',
            required: true,
          }, {
            pattern: /^[a-zA-Z0-9]{1,32}$/,
            message: '商户号输入不合法！',
          }],
        })(<Input type="text" />)}
      </FormItem>
      <FormItem label="应用ID" {...FormItemLayout}>
        {getFieldDecorator('appId', {
          initialValue: item.appId,
          rules: [{
            message: '请输入appId！',
            required: true,
          }, {
            pattern: /^[a-zA-Z0-9]{1,32}$/,
            message: 'appId输入不合法！',
          }],
        })(<Input type="text" />)}
      </FormItem>
      <FormItem label="密钥" {...FormItemLayout}>
        {getFieldDecorator('key', {
          initialValue: item.key,
          rules: [{
            message: '请输入密钥！',
            whitespace: true,
            required: true,
          }],
        })(<Input type="text" />)}
      </FormItem>
    </div>
  );
};

form.propTypes = {
  item: PropTypes.object,
  getFieldDecorator: PropTypes.func,
};

export default form;
