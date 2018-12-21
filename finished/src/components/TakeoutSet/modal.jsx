/* eslint-disable import/no-duplicates,react/prop-types */
/**
 * Create by xiaochenghua on 2018/03/10
 * */
import React, { PropTypes } from 'react';
import { Modal, Form, Select, Input, Spin } from 'antd';
import { message } from 'antd/lib/index';

const FormItem = Form.Item;
const Option = Select.Option;

let timeout;
let groupCode;

const modal = ({
  loading,
  visible,
  groupLoading,
  groupList,
  modalData,
  modalName,
  modalKey,
  onInputChange, // 字段修改
  onCancel,
  onSubmit, // 新增提交方法
  onGetGroupList,
  onClearGroup,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
               }) => {
  // 编辑保存
  const handleSave = () => {
    validateFields((errors) => {
      if (!errors) {
        const data = getFieldsValue();
        const params = {
          ...modalData,
          ...data,
          groupCode,
        };
        onSubmit(params);
      } else {
        message.warning(errors);
      }
    });
  };
  // 取消
  const handleLeave = () => {
    onCancel();
  };
  const modalProps = {
    visible,
    onCancel: handleLeave,
    onOk: handleSave,
    title: `${modalName}外卖平台配置项`,
    okText: '保存',
    key: modalKey,
    confirmLoading: loading,
    afterClose: () => resetFields(),
  };
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  const groupProps = {
    showSearch: true,
    placeholder: '请输入关键词查询 (例如: 北京)',
    filterOption: false,
    showArrow: true,
    notFoundContent: groupLoading ? (<Spin size="small" />) : (<span>没有查到相关内容</span>),
    onSearch: (e) => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      onClearGroup();
      timeout = setTimeout(() => {
        if (e) {
          onGetGroupList(e);
        }
      }, 300);
    },
    onChange: (e, option) => {
      groupCode = option.key;
    },
  };
  return (
    <Modal {...modalProps}>
      <Form>
        <FormItem
          {...formLayout}
          label="appid"
        >{getFieldDecorator('vappid', {
          initialValue: modalData.vappid,
          rules: [{
            required: true,
            message: '请输入应用ID',
          }, {
            max: 20,
            message: '最大输入20个字符',
          }],
        })(
          // eslint-disable-next-line no-return-assign,no-param-reassign
          <Input type="text" placeholder="请输入应用ID" onChange={eId => eId.target.value = eId.target.value.replace(/(^\s*)|(\s*$)/g, '')} />)}
        </FormItem>
        <FormItem
          {...formLayout}
          label="名称"
        >{getFieldDecorator('vname', {
          initialValue: modalData.vname,
          rules: [{
            required: true,
            message: '请输入名称',
          },
          {
            max: 20,
            message: '最大输入20个字符',
          }],
        })(
// eslint-disable-next-line no-return-assign,no-param-reassign
          <Input type="text" placeholder="请输入名称" onChange={eName => eName.target.value = eName.target.value.replace(/(^\s*)|(\s*$)/g, '')} />)}
        </FormItem>
        <FormItem
          {...formLayout}
          label="key"
        >{getFieldDecorator('vappkey', {
          initialValue: modalData.vappkey,
          rules: [{
            required: true,
            message: '请输入key',
          },
          {
            max: 50,
            message: '最大输入50个字符',
          }],
        })(
          // eslint-disable-next-line no-return-assign,no-param-reassign
          <Input type="text" placeholder="请输入key" onChange={eVap => eVap.target.value = eVap.target.value.replace(/(^\s*)|(\s*$)/g, '')} />)}
        </FormItem>
        <FormItem
          {...formLayout}
          label="secret"
        >{getFieldDecorator('vsecret', {
          initialValue: modalData.vsecret,
          rules: [{
            required: true,
            message: '请输入secret',
          },
          {
            max: 50,
            message: '最大输入50个字符',
          }],
        })(
          // eslint-disable-next-line no-return-assign,no-param-reassign
          <Input type="text" placeholder="请输入secret" onChange={eVse => eVse.target.value = eVse.target.value.replace(/(^\s*)|(\s*$)/g, '')} />)}
        </FormItem>
        <FormItem
          {...formLayout}
          label="回调地址"
        >{getFieldDecorator('vcallbackurl', {
          initialValue: modalData.vcallbackurl,
          rules: [{
            max: 100,
            message: '最大输入100个字符',
          }],
        })(
          // eslint-disable-next-line no-return-assign,no-param-reassign
          <Input type="text" placeholder="请输入回调地址" onChange={eVca => eVca.target.value = eVca.target.value.replace(/(^\s*)|(\s*$)/g, '')} />)}
        </FormItem>
        <FormItem
          {...formLayout}
          label="类型"
        >{getFieldDecorator('vtype', {
          initialValue: modalData.vtype,
          rules: [{
            required: true,
            message: '请选择类型',
          }],
        })(
          <Select style={{ width: 120 }} onChange={e => onInputChange(e, 'vtype')}>
            <Option key="0" value="eleme">饿了么</Option>
            <Option key="1" value="meiTuan">美团外卖</Option>
          </Select>)}
        </FormItem>
        {modalData.vtype === 'meiTuan' &&
        <FormItem
          {...formLayout}
          label="商户名称"
        >{getFieldDecorator('groupName', {
          initialValue: modalData.groupName || '',
          rules: [{
            required: true,
            message: '请选择商户',
          }],
        })(<Select {...groupProps}>
          {groupList.map(_ =>
            <Option key={_.id} value={_.tenName} title={_.tenName}>{_.tenName}</Option>)}
        </Select>)}
        </FormItem>}
      </Form>
    </Modal>
  );
};

modal.propTypes = {
  modalData: PropTypes.object,
  form: PropTypes.object,
  modalKey: PropTypes.string,
  modalName: PropTypes.string,
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(modal);
