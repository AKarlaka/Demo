/**
 * Create by liukang on 2018/03/06
 * */
import React, { PropTypes } from 'react';
import { Form, Checkbox, Col, Row, Modal } from 'antd';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

const modal = ({
                 visible,
                 channel,
                 selectedChannel,
                 onConfirm,
                 onCancel,
                 onChannelChange,
}) => {
  const FormItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  const modalProps = {
    maskClosable: false,
    width: 500,
    title: '配置渠道',
    visible,
    cancelText: '取消',
    okText: '保存',
    // 保存
    onOk() {
      onConfirm();
    },
    onCancel,
  };
  return (
    <Modal {...modalProps}>
      <Form style={{ marginTop: 20 }}>
        <Row>
          <Col span={24}>
            <FormItem label="开通渠道" {...FormItemLayout}>
              <CheckboxGroup style={{ width: '100%' }} value={selectedChannel} onChange={e => onChannelChange(e)}>
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
  visible: PropTypes.bool,
  channel: PropTypes.array,
  selectedChannel: PropTypes.array,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onChannelChange: PropTypes.func,
};

export default Form.create()(modal);
