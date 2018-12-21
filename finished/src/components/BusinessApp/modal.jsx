/**
 * Created by zhangnaiying on 2018/08/31
 */
import React, { PropTypes } from 'react';
import { Modal, Form, Select, DatePicker, Checkbox, message } from 'antd';

import Moment from 'moment';

const _ = require('lodash');

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const modal = ({
  loading,
  item,
  title,
  modalKey,
  modalType,
  modalVisible,
  appType,
  appList,
  setOptionList,
  treeShopOption,
  onConfirm,
  onCancle,
  onSelectApp,
  onChooseShop,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = getFieldsValue();
      if (Object.keys(data).length !== 0) {
        if (modalType === 'order' && data.app === '请选择') {
          message.warning('请选择应用');
          return;
        } else if (modalType === 'set' && data.opts.key === '请选择') {
          message.warning('请选择版本');
          return;
        }
      }
      onConfirm(data);
    });
  };

  const modalOpts = {
    title,
    key: modalKey,
    confirmLoading: loading,
    visible: modalVisible,
    maskClosable: false,
  };

   // 订购门店数
  const orderShopNum = treeShopOption.checkedKeys.length > 0 ?
   treeShopOption.checkedKeys.length : 0;

  const handleJudgeBody = () => {
    if (modalType === 'update') { // 如果是“修改到期时间”弹窗
      const disabledDate = current => current < Moment(item.createTime ? item.createTime : null);
      return (
        <Form>
          <FormItem {...formLayout} label="到期时间">
            {getFieldDecorator('deadLine', {
              initialValue: item.expirationTime ? Moment(item.expirationTime) : null,
              rules: [{
                required: true,
                message: '请选择日期',
              }],
            })(
              <DatePicker
                style={{ width: '100%' }}
                showTime
                disabledDate={disabledDate}
                format="YYYY-MM-DD HH:mm:ss"
              />,
            )}
          </FormItem>
        </Form>
      );
    } else if (modalType === 'set') { // 如果是“设置”弹窗
      const resolve = _.partial(_.map, _, 'id');
      const optionDataList = _.filter(setOptionList, opt => opt.type === '0'); // 下拉框数据
      const checkboxDataList = _.filter(setOptionList, opt => opt.type === '1'); // 多选框数据
      const options = optionDataList.map(opt => <Option key={opt.id}>{opt.name}</Option>); // 下拉框选项
      options.unshift(<Option key={'请选择'}>请选择</Option>);
      const checkboxes = checkboxDataList.map(opt => ({ label: opt.name, value: opt.id })); // 多选框选项
      const selectOpt = _.filter(optionDataList, opt => opt.selectType === '1'); // 得到选中的下拉框
      const selectCheck = resolve(_.filter(checkboxDataList, opt => opt.selectType === '1')); // 得到选中的多选框id
      return (
        <Form>
          { optionDataList.length === 0 && checkboxDataList.length === 0 && '暂无可配置项'}
          { optionDataList.length !== 0 &&
            <FormItem {...formLayout} label={checkboxDataList.length === 0 ? '模式' : '版本'}>
              {getFieldDecorator('opts', {
                initialValue: selectOpt.length === 0
                  ? { label: '请选择', key: '请选择' }
                  : { label: selectOpt[0].name, key: selectOpt[0].id },
                rules: [{
                  required: true,
                  message: '请选择版本',
                }],
              })(
                <Select labelInValue>
                  {options}
                </Select>,
              )}
            </FormItem>
          }
          { checkboxDataList.length !== 0 &&
            <FormItem {...formLayout} label="选装包">
              {getFieldDecorator('checks', {
                initialValue: selectCheck.length !== 0 ? selectCheck : null,
              })(
                <CheckboxGroup options={checkboxes} />,
              )}
            </FormItem>
          }
        </Form>
      );
    } else if (modalType === 'order') { // 如果是“订购应用”弹窗
      const options = appList.map(opt => <Option key={opt.id}>{opt.applicationName}</Option>);
      options.unshift(<Option key={'请选择'}>请选择</Option>);
      return (
        <Form>
          <FormItem {...formLayout} label="应用">
            {getFieldDecorator('app', {
              initialValue: '请选择',
              rules: [{
                required: true,
                message: '请选择应用',
              }],
            })(
              <Select onSelect={onSelectApp}>
                {options}
              </Select>,
              )}
          </FormItem>
          <FormItem {...formLayout} label="类型">
            {getFieldDecorator('sellType', {
              initialValue: appType,
            })(
              <text>{appType}</text>,
              )}
          </FormItem>
          {
            appType === '按商户订购' &&
            <FormItem {...formLayout} label="到期时间">
              {getFieldDecorator('businessDeadLine', {
                initialValue: null,
                rules: [{
                  required: true,
                  message: '请选择到期时间',
                }],
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />,
              )}
            </FormItem>
          }
          {
            appType === '按门店订购' &&
            <div>
              <FormItem {...formLayout} label="订购门店">
                {getFieldDecorator('shopList', {
                  initialValue: 0,
                })(
                  <span>
                    <span style={{ verticalAlign: 'top' }}>{ orderShopNum }家</span>
                    <button className="btn-link" type="button" onClick={onChooseShop}>修改</button>
                  </span>,
                )}
              </FormItem>
              <FormItem {...formLayout} label="到期时间">
                {getFieldDecorator('shopDeadLine', {
                  initialValue: null,
                  rules: [{
                    required: true,
                    message: '请选择到期时间',
                  }],
                })(
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                  />,
              )}
              </FormItem>
            </div>
          }
        </Form>
      );
    }
    return '';
  };

  return (
    <Modal
      {...modalOpts}
      onOk={handleOk}
      onCancel={onCancle}
      style={modalType === 'order' && { top: '30px' }}
    >
      {handleJudgeBody()}
    </Modal>
  );
};

modal.propTypes = {
  loading: PropTypes.bool,
  modalVisible: PropTypes.bool,
  title: PropTypes.string,
  appType: PropTypes.string,
  modalType: PropTypes.string,
  modalKey: PropTypes.string,
  setOptionList: PropTypes.array,
  appList: PropTypes.array,
  item: PropTypes.object,
  treeShopOption: PropTypes.object,
  form: PropTypes.object,
  onConfirm: PropTypes.func,
  onCancle: PropTypes.func,
  onSelectApp: PropTypes.func,
  onChooseShop: PropTypes.func,
};

export default Form.create()(modal);
