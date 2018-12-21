/**
 * Created by zhangnaiying on 2018/09/02
 */
import React, { PropTypes } from 'react';
import { Modal, Form, Select, DatePicker, Checkbox, message } from 'antd';

import Moment from 'moment';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const Option = Select.Option;

const _ = require('lodash');

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const modal = ({
  title,
  item,
  modalKey,
  modalType,
  modalVisible,
  setOptionList,
  onConfirm,
  onCancle,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      const data = getFieldsValue();
      if (errors) {
        return;
      }
      if (Object.keys(data).length !== 0) {
        if (modalType === 'set' && data.opts.key === '请选择') {
          message.warning('请选择版本');
          return;
        }
      }
      onConfirm(data);
    });
  };

  const modalOpts = {
    title,
    item,
    key: modalKey,
    visible: modalVisible,
    maskClosable: false,
  };
  const resolve = _.partial(_.map, _, 'id');
  const optionDataList = _.filter(setOptionList, opt => opt.type === '0'); // 下拉框数据
  const checkboxDataList = _.filter(setOptionList, opt => opt.type === '1'); // 多选框数据
  const options = optionDataList.map(opt => <Option key={opt.id}>{opt.name}</Option>); // 下拉框选项
  options.unshift(<Option key={'请选择'}>请选择</Option>);
  const checkboxes = checkboxDataList.map(opt => ({ label: opt.name, value: opt.id })); // 多选框选项
  const selectOpt = _.filter(optionDataList, opt => opt.selectType === '1'); // 得到选中的下拉框
  const selectCheck = resolve(_.filter(checkboxDataList, opt => opt.selectType === '1')); // 得到选中的多选框id

  const disabledDate = current => current < Moment(item.createTime ? item.createTime : null);


  return (
    <Modal
      {...modalOpts}
      onOk={handleOk}
      onCancel={onCancle}
    >
      {
        (modalType === 'update' || modalType === 'updateAll') &&
        <Form>
          <FormItem {...formLayout} label="到期时间">
            {getFieldDecorator('deadLine', {
              initialValue: modalType === 'update' ? Moment(item.expirationTime ? item.expirationTime : 0) : null,
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
      }
      {
        modalType === 'set' &&
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
      }
    </Modal>
  );
};
modal.propTypes = {
  modalVisible: PropTypes.bool,
  title: PropTypes.string,
  modalType: PropTypes.string,
  modalKey: PropTypes.string,
  setOptionList: PropTypes.array,
  item: PropTypes.object,
  form: PropTypes.object,
  onConfirm: PropTypes.func,
  onCancle: PropTypes.func,
};

export default Form.create()(modal);
