/**
 * Create by liukang on 2018/03/06
 * */
import React, { PropTypes } from 'react';
import { Form, Input, Col, Row, Modal, Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

const modal = ({
  item,
  visible,
  form,
  channel,
  onChannelChange,
  onConfirm,
  onCancel,
}) => {
  const {
    getFieldDecorator,
  } = form;
  const FormItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  const modalProps = {
    maskClosable: false,
    width: 600,
    title: '编辑聚合服务商',
    visible,
    cancelText: '取消',
    okText: '保存',
    // 确定保存
    onOk() {
      const data = {
        id: item.id,
        code: item.code,
        channels: item.channels,
      };
      onConfirm(data);
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
            <FormItem label="服务商" {...FormItemLayout}>
              {getFieldDecorator('name', {
                initialValue: item.name,
                rules: [{
                  message: '请输入服务商名称！',
                  required: true,
                }, {
                  pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,32}$/, message: '请输入1-32位中文字符！',
                }],
              })(
                <Input type="text" disabled />,
              )}
            </FormItem>
            <FormItem label="开通渠道" {...FormItemLayout}>
              <CheckboxGroup style={{ width: '100%' }} value={item.channels} onChange={e => onChannelChange(e)}>
                <Row>
                  {
                    channel.map(it =>
                      <Col span={12} key={it.code} style={{ marginTop: '10px' }}>
                        <Checkbox value={it.code}>{it.name}</Checkbox>
                      </Col>,
                    )
                  }
                </Row>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>
        <Row />
      </Form>
    </Modal>
  );
};

modal.propTypes = {
  channel: PropTypes.array,
  item: PropTypes.object,
  form: PropTypes.object,
  visible: PropTypes.bool,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onChannelChange: PropTypes.func,
};

export default Form.create()(modal);
