/**
 * Create by liukang on 2018/03/06
 * */
import React, { PropTypes } from 'react';
import { Form, Input, Col, Row, Select, Modal } from 'antd';
import { Payment } from '../../../utils/enums';

const { IsDiscount, PayChannel, PayAggregator } = Payment;

const Option = Select.Option;
const FormItem = Form.Item;

const modal = ({
                 item,
                 visible,
                 onConfirm,
                 onCancel,
                 form,
                 onItemChange,
                 aggregator,
                 isv,
}) => {
  const {
    getFieldDecorator,
    getFieldsValue,
    validateFields,
  } = form;
  const FormItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };
  const modalProps = {
    maskClosable: false,
    width: 700,
    title: '编辑支付渠道',
    visible,
    cancelText: '取消',
    okText: '保存',
    // 确定保存
    onOk() {
      validateFields((errors) => {
        if (errors) {
          return;
        }
        const data = getFieldsValue();
        data.id = item.id;
        onConfirm(data);
      });
    },
    onCancel,
    wrapClassName: 'components-staffManagement',
    className: 'staffManagement-modal',
  };
  return (
    <Modal {...modalProps}>
      <Form style={{ marginTop: 20 }}>
        <Row>
          <Col span={24}>
            <FormItem label="渠道名称" {...FormItemLayout}>
              {getFieldDecorator('name', {
                initialValue: item.name,
                rules: [{
                  message: '请输入渠道名称！',
                  required: true,
                }, {
                  pattern: /^[\u4e00-\u9fa5A-Za-z]{2,12}$/, message: '请输入1-12位中文或英文字符！',
                }],
              })(
                <Input type="text" disabled />,
              )}
            </FormItem>
            <FormItem label="渠道编码" {...FormItemLayout}>
              {getFieldDecorator('code', {
                initialValue: item.code,
                rules: [{
                  message: '请输入渠道编码！',
                  required: true,
                }, {
                  pattern: /^[A-Za-z]{1,10}$/, message: '请输入1-10位英文字符！',
                }],
              })(
                <Input type="text" disabled />,
              )}
            </FormItem>
            <FormItem label="是否计算优惠" {...FormItemLayout}>
              {getFieldDecorator('isDiscount', {
                initialValue: item.isDiscount,
                rules: [{
                  message: '请选择！',
                  required: true,
                }],
              })(
                <Select onChange={e => onItemChange(e, 'isDiscount')}>
                  <Option key="0" value={IsDiscount.NO_DISCOUNT}>不计算优惠</Option>
                  <Option key="1" value={IsDiscount.DISCOUNT}>计算优惠</Option>
                </Select>,
              )}
            </FormItem>
            {
              item.isDiscount === IsDiscount.DISCOUNT &&
              <FormItem label="优惠编码" {...FormItemLayout}>
                {getFieldDecorator('discountCode', {
                  initialValue: item.discountCode,
                  rules: [{
                    message: '请输入优惠编码！',
                    required: true,
                  }, {
                    pattern: /^[A-Za-z0-9]{1,20}$/, message: '请输入英文和数字！',
                  }],
                })(
                  <Input type="text" />,
                )}
              </FormItem>
            }
            <FormItem
              label="起始位"
              {...FormItemLayout}
            >
              {getFieldDecorator('startBit', {
                initialValue: item.startBit,
              })(
                <Input type="text" />,
              )}
            </FormItem>
            <FormItem label="默认聚合服务商" {...FormItemLayout}>
              {getFieldDecorator('defAggregator', {
                initialValue: item.defAggregator,
                rules: [{
                  message: '请选择！',
                  required: true,
                }],
              })(
                <Select onChange={e => onItemChange(e, 'defAggregator')}>
                  {
                    aggregator.map(it => <Option value={it.code} key={it.code}>{it.name}</Option>)
                  }
                </Select>,
              )}
            </FormItem>
            {
              item.defAggregator === PayAggregator.CHOICE && item.code === PayChannel.WXPAY &&
              <FormItem label="默认ISV" {...FormItemLayout}>
                {getFieldDecorator('defIsv', {
                  initialValue: item.defIsv,
                  rules: [{
                    message: '请选择！',
                    required: true,
                  }],
                })(
                  <Select>
                    <Option value="-1" key={1}>不使用</Option>
                    {
                      isv.map(it => <Option value={it.id} key={it.id}>{it.name}</Option>)
                    }
                  </Select>,
                )}
              </FormItem>
            }
          </Col>
        </Row>
        <Row />
      </Form>
    </Modal>
  );
};

modal.propTypes = {
  item: PropTypes.object,
  visible: PropTypes.bool,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  form: PropTypes.object,
  onItemChange: PropTypes.func,
  aggregator: PropTypes.array,
  isv: PropTypes.array,
};

export default Form.create()(modal);
