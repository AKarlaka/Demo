/**
 * Create by xiaochenghua on 2018/02/01
 * */

import React, { PropTypes } from 'react';
import { Modal, Form, Input, Radio, Col, Row, Upload, Icon, message, Select } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;


const modal = ({
  loading,
  item,
  applicationIcon,
  visible,
  previewVisible,
  fileList,
  iconFlag,
  modalType,
  onCancel,
  onCancelImg,
  onConfirm,
  onBeforeUpload, // 头像上传判断
  onPreview, // 预览头像
  onUploadChange, // 头像上传
  onRemoveImg, // 删除头像
  onSelectSellStrategy,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields, // 清空表单
  },
}) => {
  // 表单提交
  const handleSubmit = () => {
    validateFields((errors) => {
      const data = {
        ...getFieldsValue(),
      };
      if (!iconFlag) {
        message.warning('未上传图片！');
      }
      if (!errors) {
        onConfirm(data);
      }
    });
  };
  // 图片上传数据
  const handle = file => ({
    ...file,
  });
  // 预览
  const handleView = (file) => {
    onPreview(file);
  };
  // 删除图片
  const handleRemoveFun = () => {
    onRemoveImg();
  };
  const moadlProps = {
    maskClosable: false,
    width: 900,
    title: `${modalType === 'edit' ? '编辑' : '新增'}应用信息`,
    visible,
    cancelText: '取消',
    okText: '保存',
    onOk: handleSubmit,
    confirmLoading: loading,
    onCancel,
    afterClose: () => resetFields(), // 清空表单
  };
  const uploadProps = {
    action: '/api/tenant/upload',
    className: 'avatar-uploader',
    listType: 'picture-card',
    name: 'file',
    accept: 'image/jpeg, image/bmp, image/png, image/gif',
    beforeUpload: file => onBeforeUpload(file),
    fileList,
    onPreview: handleView,
    onChange: file => onUploadChange(file),
    onRemove: handleRemoveFun,
    data: handle,
  };
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const formItemLayout1 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  return (
    <Modal {...moadlProps}>
      <Form>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayout1}
              label="应用名称"
            >
              {getFieldDecorator('applicationName', {
                initialValue: item.applicationName,
                rules: [{
                  message: '请输入应用名称！',
                  required: true,
                }, {
                  pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,12}$/, message: '请输入1-12位中/英文或数字字符！',
                }],
              })(
                <Input type="text" />)}
            </FormItem>
          </Col>
          <Col span={12} >
            <FormItem
              {...formItemLayout1}
              label="排序"
            >{getFieldDecorator('applicationOrder', {
              initialValue: item.applicationOrder,
              rules: [{
                message: '请输入排序！',
                required: true,
              }, {
                pattern: /^[1-9][0-9]{0,2}$/, message: '请输入1-999之间的数字字符！',
              }],
            })(
              <Input type="text" style={{ width: 80 }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayout1}
              label="回调域名"
            >
              {getFieldDecorator('redirectDomain', {
                initialValue: item.redirectDomain,
              })(
                <Input type="text" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              {...formItemLayout}
              label="应用简介"
            >{getFieldDecorator('description', {
              initialValue: item.description,
              rules: [{
                message: '请输入应用简介！',
                required: true,
              },
              { max: 150,
                message: '不得多于150个字符',
              },
              { min: 1,
                message: '不得少于1个字符',
              }],
            })(
              <TextArea rows={4} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              {...formItemLayout}
              label="应用logo"
              required
            >
              <div className="clearfix">
                <Upload
                  {...uploadProps}
                >
                  {
                    fileList.length < 1 && [
                      <Icon type="plus" style={{ fontSize: 20 }} key="icon" />,
                      <div key="upload" className="ant-upload-text">上传图片</div>,
                    ]
                  }
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={onCancelImg}>
                  <img alt="example" style={{ width: '100%' }} src={applicationIcon} />
                </Modal>
                {getFieldDecorator('iconFlag', {
                  initialValue: iconFlag,
                })(<Input type="hidden" />)}
              </div>
              <p style={{ fontSize: '14px' }}>图片大小不超过2M,图片尺寸(200x200),图片格式(gif,jpeg,bmp,png)</p>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              {...formItemLayout}
              label="售卖策略"
            > {getFieldDecorator('sellStrategy', {
              initialValue: item.sellStrategy,
              rules: [{
                required: true,
                message: '选项不能为空!',
              }],
            })(
              <RadioGroup onChange={onSelectSellStrategy}>
                <Radio value={0}>免费</Radio>
                <Radio value={1}>付费</Radio>
              </RadioGroup>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              {...formItemLayout}
              label="应用类型"
            > {getFieldDecorator('sellType', {
              initialValue: item.sellType,
              rules: [{
                required: true,
                message: '选项不能为空!',
              }],
            })(
              <Select disabled={modalType !== 'create'}>
                <Option value={0}>按门店订购</Option>
                <Option value={1}>按商户订购</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

modal.propTypes = {
  form: PropTypes.object,
  item: PropTypes.object,
  // sellStrategy: PropTypes.number,
  // sellType: PropTypes.number,
  // authType: PropTypes.number,
  // myPrice: PropTypes.number,
  // freeDays: PropTypes.number,
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  previewVisible: PropTypes.bool,
  fileList: PropTypes.array,
  applicationIcon: PropTypes.string,
  iconFlag: PropTypes.string,
  modalType: PropTypes.string,
  onCancel: PropTypes.func,
  onCancelImg: PropTypes.func,
  onConfirm: PropTypes.func,
  // onSetFreeDays: PropTypes.func,
  // onSelectFreeDays: PropTypes.func,
  // onSelectAuthType: PropTypes.func,
  // onSelectSellType: PropTypes.func,
  // onSelectPrice: PropTypes.func,
  onSelectSellStrategy: PropTypes.func,
  onBeforeUpload: PropTypes.func,
  onPreview: PropTypes.func,
  onUploadChange: PropTypes.func,
  onRemoveImg: PropTypes.func,
  // onSelectAuthDuration: PropTypes.func,
};

export default Form.create()(modal);
