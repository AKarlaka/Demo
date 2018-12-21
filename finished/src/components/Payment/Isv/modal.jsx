/**
 * Create by liukang on 2018/03/06
 * */
import React, { PropTypes } from 'react';
import { Form, Input, Col, Row, Modal, message } from 'antd';
import PaymentUpload from '../../common/PaymentUpload/index';

const FormItem = Form.Item;

const modal = ({
  form,
  formKey,
  item,
  visible,
  onConfirm,
  onCancel,
  onSelectedFile,
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
  const modalProps = {
    maskClosable: false,
    width: 600,
    title: item.id ? '编辑ISV' : '新增ISV',
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
        const id = item.id;
        if (item.certificate) {
          data.certificate = item.certificate;
        } else {
          message.warning('请上传证书');
          return;
        }
        if (id) {
          data.id = id;
          onConfirm('edit', data);
        } else {
          onConfirm('add', data);
        }
      });
    },
    onCancel,
  };
  // 上传证书
  const uploadProps = {
    btnText: '选择证书',
    detail() {
      if (item.certificate) {
        return (<span>已有证书</span>);
      }
      return <span>未上传证书</span>;
    },
    onSucceed(data) {
      onSelectedFile(data);
    },
  };
  return (
    <Modal {...modalProps}>
      <Form style={{ marginTop: 20 }} key={formKey}>
        <Row>
          <Col span={24}>
            <FormItem label="ISV名称" {...FormItemLayout}>
              {getFieldDecorator('name', {
                initialValue: item.name,
                rules: [{
                  message: '请输入ISV名称！',
                  required: true,
                }, {
                  pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,32}$/, message: '请输入1-32位字符！',
                }],
              })(
                <Input type="text" />,
              )}
            </FormItem>
            <FormItem label="appid" {...FormItemLayout}>
              {getFieldDecorator('appid', {
                initialValue: item.appid,
                rules: [{
                  message: '请输入appid！',
                  required: true,
                }, {
                  pattern: /^[A-Za-z0-9]{1,32}$/,
                  message: '请输入1-32位字符！',
                }],
              })(
                <Input type="text" />,
              )}
            </FormItem>
            <FormItem label="ISV商户号" {...FormItemLayout}>
              {getFieldDecorator('code', {
                initialValue: item.code,
                rules: [{
                  message: '请输入ISV商户号！',
                  required: true,
                }, {
                  pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,32}$/, message: '请输入1-32位字符！',
                }],
              })(
                <Input type="text" />,
              )}
            </FormItem>
            <FormItem label="ISV商户密钥" {...FormItemLayout}>
              {getFieldDecorator('key', {
                initialValue: item.key,
                rules: [{
                  message: '请输入ISV商户密钥！',
                  required: true,
                }, {
                  pattern: /^[A-Za-z0-9]{1,32}$/,
                  message: '请输入1-32位字符！',
                }],
              })(
                <Input type="text" />,
              )}
            </FormItem>
            <FormItem label="上传证书" {...FormItemLayout}>
              {getFieldDecorator('certificateFile', {
                initialValue: 456,
                rules: [{
                  message: '请上传证书！',
                  required: true,
                }],
              })(
                <Input type="text" style={{ display: 'none' }} />,
              )}
              <PaymentUpload {...uploadProps} />
            </FormItem>
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
  formKey: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onSelectedFile: PropTypes.func,
};

export default Form.create()(modal);
