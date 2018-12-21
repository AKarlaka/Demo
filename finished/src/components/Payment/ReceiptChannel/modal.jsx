/**
 * Create by liukang on 2018/03/06
 * */
import React, { PropTypes } from 'react';
import { Form, Select, Col, Row, Modal, message } from 'antd';
import ProviderForm from './forms/index';
import { Payment } from '../../../utils/enums';

const { ProviderType, PayChannel, PayAggregator } = Payment;

const Option = Select.Option;
const FormItem = Form.Item;

const modal = ({
                 item,
                 visible,
                 form,
                 aggregator,
                 isv,
                 onItemChange,
                 onConfirm,
                 onCancel,
}) => {
  const {
    getFieldDecorator,
    getFieldsValue,
    validateFields,
  } = form;
  const FormItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  const providerFormProps = {
    getFieldDecorator,
    item,
    onItemChange,
  };
  const modalProps = {
    maskClosable: false,
    width: 700,
    title: `${item.channelName || ''}配置`,
    visible,
    cancelText: '取消',
    okText: '保存',
    // 确定保存
    onOk() {
      validateFields((errors) => {
        if (errors) {
          return;
        }
        const { type,
          isvId,
          aggCode,
          certificateFile,
          ...setting } = getFieldsValue();
        const {
          certificate,
          id,
          channelCode,
        } = item;
        if (!certificate && certificateFile) {
          message.warning('请上传证书！');
          return;
        }
        const data = {
          id,
          type: type || ProviderType.AGGREGATOR,
          channelCode,
          isvId,
          aggCode,
          setting: JSON.stringify(setting),
          certificate,
        };
        onConfirm('edit', data);
      });
    },
    onCancel,
  };
  return (
    <Modal {...modalProps}>
      <Form style={{ marginTop: 20 }}>
        <Row>
          <Col span={24}>
            <FormItem label="选择通道" {...FormItemLayout}>
              {getFieldDecorator('aggCode', {
                initialValue: item.aggCode,
                rules: [{
                  message: '请选择！',
                  required: true,
                }],
              })(
                <Select onChange={e => onItemChange(e, 'aggCode')}>
                  {
                    aggregator.map(it => <Option value={it.code} key={it.code}>{it.name}</Option>)
                  }
                </Select>,
              )}
            </FormItem>
            {
              item.channelCode === PayChannel.WXPAY && item.aggCode === PayAggregator.CHOICE &&
              <FormItem label="是否ISV模式" {...FormItemLayout}>
                {getFieldDecorator('type', {
                  initialValue: item.type,
                  rules: [{
                    message: '请选择！',
                    required: true,
                  }],
                })(
                  <Select onChange={e => onItemChange(e, 'type')}>
                    <Option key="0" value={ProviderType.ISV}>是</Option>
                    <Option key="1" value={ProviderType.AGGREGATOR}>否</Option>
                  </Select>,
                )}
              </FormItem>
            }
            {
              item.type === ProviderType.ISV && item.channelCode === PayChannel.WXPAY &&
              item.aggCode === PayAggregator.CHOICE &&
              <FormItem label="选择ISV" {...FormItemLayout}>
                {getFieldDecorator('isvId', {
                  initialValue: (item.isvId === '0' || item.isvId === '-1') ? '' : item.isvId,
                  rules: [{
                    message: '请选择！',
                    required: true,
                  }],
                })(
                  <Select placeholder="请选择ISV">
                    {
                      isv.map(it => <Option value={it.id} key={it.id}>{it.name}</Option>)
                    }
                  </Select>,
                )}
              </FormItem>
            }
            <ProviderForm {...providerFormProps} />
          </Col>
        </Row>
        <Row />
      </Form>
    </Modal>
  );
};

modal.propTypes = {
  item: PropTypes.object,
  form: PropTypes.object,
  visible: PropTypes.bool,
  aggregator: PropTypes.array,
  isv: PropTypes.array,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onItemChange: PropTypes.func,
};

export default Form.create()(modal);
