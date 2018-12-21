import React, { PropTypes } from 'react';
import { Form, Input, Col, Row, Upload, Icon, message, Select, Modal } from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

const modal = ({
  title,
  modalVisible,
  fileList,
  tenProvinceList,
  tenCityList,
  tenDistrictList,
  tenName,
  tenAddress,
  tenEmail,
  tenProvinceName,
  tenCityName,
  tenDistrictName,
  superName,
  superMobile,
  previewVisible,
  braLogo,
  previewImgUrl,
  onChangeTenAddress,
  onCancelPic,
  onConfirm,
  onCancel,
  onProvinceChange,
  onCityChange,
  onDistrictChange,
  onBeforeUpload,
  onHandleUpload,
  onPreview,
  onRemove,
  form: {
    getFieldDecorator,
    validateFields,
    resetFields,
  },
 }) => {
  const FormItemLayout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 14,
    },
  };
  // 确定编辑
  const handleOk = () => {
    validateFields((errors, values) => {
      if (tenProvinceName === '请选择') {
        message.warning('省份不能为空');
        return;
      } else if (tenCityName === '请选择') {
        message.warning('城市不能为空');
        return;
      } else if (tenDistrictName === '请选择') {
        message.warning('区县不能为空');
        return;
      }
      if (!errors) {
        onConfirm(values);
      }
    });
  };
  const modalOpts = {
    maskClosable: false,
    width: 1000,
    title,
    visible: modalVisible,
    cancelText: '取消',
    okText: '保存',
    onOk: handleOk,
    onCancel,
    afterClose: resetFields,
  };
  const provinceSelectProps = tenProvinceName && {
    value: tenProvinceName,
  };
  const citySelectProps = tenCityName && {
    value: tenCityName,
  };
  const districtSelectProps = tenDistrictName && {
    value: tenDistrictName,
  };
  const handle = file => ({
    ...file,
  });
  const handlePreview = (file) => {
    onPreview(file);
  };
  const provinceOption = tenProvinceList.map(store =>
    <Select.Option value={store.id} key={store.id}>
      {store.areaName}
    </Select.Option>);
  const cityOption = tenCityList.map(store =>
    <Select.Option value={store.id} key={store.id}>
      {store.areaName}
    </Select.Option>);
  const districtOption = tenDistrictList.map(store =>
    <Select.Option value={store.id} key={store.id}>
      {store.areaName}
    </Select.Option>);
  const prefixSelector = getFieldDecorator('prefix', {
    initialValue: '86',
  })(
    <Select style={{ width: 70 }}>
      <Option key="0" value="86">+86</Option>
    </Select>,
  );
  const uploadProps = {
    action: '/api/tenant/upload',
    className: 'avatar-uploader',
    name: 'file',
    listType: 'picture-card',
    beforeUpload: file => onBeforeUpload(file),
    fileList,
    onPreview: handlePreview,
    onChange: onHandleUpload,
    onRemove,
    accept: 'image/jpeg, image/bmp, image/png, image/gif',
    data: handle,
  };
  return (
    <div className="components-modal">
      <Modal {...modalOpts}>
        <Form style={{ marginTop: 20 }}>
          <Row>
            <Col span={12} >
              <FormItem
                {...FormItemLayout}
                label="商户名称"
              >
                {getFieldDecorator('tenantsName', {
                  initialValue: tenName,
                  rules: [{
                    message: '请输入商户名称！',
                    required: true,
                  }, {
                    pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{2,20}$/, message: '请输入2-20位中/英文或数字字符！',
                  }],
                })(
                  <Input type="text" />,
                )}

              </FormItem>
              <FormItem
                {...FormItemLayout}
                label="商户logo"
              >
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
                <Modal visible={previewVisible} footer={null} onCancel={onCancelPic} >
                  <img style={{ width: '100%', paddingTop: 20 }} src={previewImgUrl} role="presentation" />
                </Modal>

                {getFieldDecorator('braLogo', {
                  initialValue: braLogo,
                  /* rules: [{
                    required: true,
                    message: '请上传品牌logo!',
                  }],*/
                })(
                  <Input type="hidden" />,
                )}
              </FormItem>
              <FormItem
                xs={24} sm={24} md={24} lg={12} xl={12}
                style={{ width: '80%', marginLeft: '20%', fontSize: 14, marginTop: -20 }}
              >
                图片大小不超过2M,图片尺寸(200x200),图片格式(gif,jpeg,bmp,png)
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...FormItemLayout}
                label="商户地址"
                required
              >
                <Select placeholder="省" style={{ width: 90 }} {...provinceSelectProps} onSelect={onProvinceChange}>
                  { provinceOption }
                </Select>
                <Select placeholder="市" style={{ width: 90 }} {...citySelectProps} onSelect={onCityChange}>
                  { cityOption }
                </Select>
                <Select placeholder="区" style={{ width: 90 }} {...districtSelectProps} onSelect={onDistrictChange}>
                  { districtOption }
                </Select>
              </FormItem>
              <FormItem
                {...FormItemLayout}
                label="详细地址"
              >{getFieldDecorator('tenAddreass', {
                initialValue: tenAddress,
                rules: [
                  { max: 50,
                    message: '不得多于50个字符',
                  },
                  {
                    pattern: /^[\w\u4e00-\u9fa5#（）()-]+$/g,
                    message: '非法字符！',
                  },
                ],
              })(
                <TextArea rows={2} onChange={onChangeTenAddress} />,
              )}
              </FormItem>
              <FormItem
                {...FormItemLayout}
                label="管理员姓名"
                required
              >{getFieldDecorator('administrator', {
                initialValue: superName,
                rules: [{
                  required: true,
                  message: '请输入管理员姓名！',
                }, {
                  pattern: /^[A-Za-z\u4e00-\u9fa5]{2,10}$/,
                  message: '请输入2-10位中文或英文字符！',
                }],
              })(
                <Input type="text" />,
              )}

              </FormItem>
              <FormItem
                {...FormItemLayout}
                label="管理员手机号"
                required
              >
                {getFieldDecorator('userAccount', {
                  initialValue: superMobile,
                  validateTrigger: 'onBlur',
                  rules: [{
                    required: true,
                    message: '请输入手机号!',
                  },
                  {
                    pattern: /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/,
                    message: '手机号格式错误！',
                  }],
                })(
                  <Input
                    addonBefore={prefixSelector}
                  />,
                )}
              </FormItem>
              <FormItem
                {...FormItemLayout}
                label="电子邮箱"
              >{getFieldDecorator('Email', {
                initialValue: tenEmail,
                validateTrigger: 'onBlur',
                rules: [{
                  message: '请输入电子邮箱！',
                  required: true,
                }, {
                  pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                  message: '邮箱格式错误',
                }],
              })(
                <Input type="text" />,
              )}
              </FormItem>
            </Col>
          </Row>
          <Row />
        </Form>
      </Modal>
    </div>
  );
};

modal.propTypes = {
  modalVisible: PropTypes.bool,
  previewVisible: PropTypes.bool,
  form: PropTypes.object,
  fileList: PropTypes.array,
  tenProvinceList: PropTypes.array,
  tenCityList: PropTypes.array,
  tenDistrictList: PropTypes.array,
  title: PropTypes.string,
  tenName: PropTypes.string,
  tenAddress: PropTypes.string,
  superName: PropTypes.string,
  superMobile: PropTypes.string,
  tenEmail: PropTypes.string,
  tenProvinceName: PropTypes.string,
  tenCityName: PropTypes.string,
  tenDistrictName: PropTypes.string,
  braLogo: PropTypes.string,
  previewImgUrl: PropTypes.string,
  onCancelPic: PropTypes.func,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onDistrictChange: PropTypes.func,
  onCityChange: PropTypes.func,
  onProvinceChange: PropTypes.func,
  onPreview: PropTypes.func,
  onBeforeUpload: PropTypes.func,
  onHandleUpload: PropTypes.func,
  onRemove: PropTypes.func,
  onChangeTenAddress: PropTypes.func,
};

export default Form.create()(modal);
