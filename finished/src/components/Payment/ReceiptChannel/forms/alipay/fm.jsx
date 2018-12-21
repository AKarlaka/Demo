/**
 * Created by zhangnaiying on 2018/09/13
 */
import React, { PropTypes } from 'react';
import { Form, Input } from 'antd';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

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
        {getFieldDecorator('partnerId', {
          initialValue: item.partnerId,
          rules: [{
            message: '请输入商户号！',
            required: true,
          }, {
            pattern: /^[a-zA-Z0-9]{1,32}$/,
            message: '商户号输入不合法！',
          }],
        })(<Input type="text" />)}
      </FormItem>
      <FormItem label="接口地址" {...FormItemLayout}>
        {getFieldDecorator('url', {
          initialValue: item.url,
          rules: [{
            message: '请输入接口地址！',
            required: true,
          }, {
            pattern: /^((http|ftp|https):\/\/)[\w-_.]+(\/[\w-_]+)*\/?$/,
            message: '接口地址输入不合法！',
          }],
        })(<Input type="text" />)}
      </FormItem>
      <FormItem label="私钥" {...FormItemLayout}>
        {getFieldDecorator('privateKey', {
          initialValue: item.privateKey,
          rules: [{
            message: '请输入私钥！',
            whitespace: true,
            required: true,
          }],
        })(<TextArea rows={4} />)}
      </FormItem>
    </div>
  );
};

form.propTypes = {
  item: PropTypes.object,
  getFieldDecorator: PropTypes.func,
};

export default form;
