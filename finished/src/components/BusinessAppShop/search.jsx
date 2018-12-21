/**
 * Created by zhangnaiying on 2018/09/02
 */
import React, { PropTypes } from 'react';
import { Button, Row, Col, Modal, Form, Select, DatePicker, message, TimePicker } from 'antd';
import Moment from 'moment';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;

const _ = require('lodash');

const resolve = _.partial(_.map, _, 'shopId');

const search = ({
  selectedRows,
  queryEditionsList,
  query,
  canOpenTimePicker,
  onEnable,
  onDisable,
  onSetting,
  onUpdateTime,
  onSearch,
  onTimeFocus,
  form: {
    getFieldDecorator,
    setFieldsValue,
    getFieldsValue,
    resetFields,
  },
}) => {
  const handleSearch = (e) => {
    if (e.target) {
      if (e.target.innerText === '清除条件') {
        resetFields();
        onSearch();
      } else {
        let data = {
          ...getFieldsValue(),
        };
        if (data.editionId === '请选择') {
          data = {
            ...data,
            editionId: null,
          };
        }
        if (data.appStatusQuery === '-1') {
          data.appStatusQuery = null;
        }
        onSearch(data);
      }
    }
  };

  const canDisableList = _.filter(selectedRows, item => item.storeStatus === '1');
  const canEnableList = _.filter(selectedRows, item => item.storeStatus === '0');
  const resolveExpire = _.partial(_.map, _, 'editionName');
  const resolveExpireName = _.partial(_.map, _, 'name');
  const EditionList = resolveExpire(selectedRows);
  const EditionNameList = _.uniq(
    resolveExpireName(
      _.filter(
        EditionList.map(o => o[0]),
        () => true),
    ),
  );
  const handleSetting = () => {
    if (canEnableList.length === 0) {
      if (EditionNameList.length === 1) {
        onSetting();
      } else {
        message.warning('您选择的门店中存在多种配置，无法批量设置！');
      }
    } else {
      message.warning('您选择的门店中存在停用门店，无法设置配置！');
    }
  };
  const handleUpdateTime = () => {
    if (canEnableList.length === 0) {
      onUpdateTime();
    } else {
      message.warning('您选择的门店中存在停用门店，无法修改到期时间！');
    }
  };
  const handleShowConfirm = (e) => {
    const info = e.target.value;
    let content = '';
    switch (info) {
      case '启用':
        content = `您选中了${selectedRows.length}条数据，可以启用${canEnableList.length}条数据`;
        break;
      case '停用':
        content = `您选中了${selectedRows.length}条数据，可以停用${canDisableList.length}条数据`;
        break;
      default:
        break;
    }
    confirm({
      title: `确定${e.target.value}吗？`,
      content,
      cancelText: '取消',
      okText: '确定',
      onOk() {
        switch (info) {
          case '启用':
            onEnable(resolve(_.filter(canEnableList, () => true)));
            break;
          case '停用':
            onDisable(resolve(_.filter(canDisableList, () => true)));
            break;
          default:
            break;
        }
      },
      onCancel() {},
    });
  };

  const handleFocus = () => {
    const { deadLineQuery } = getFieldsValue();
    if (deadLineQuery !== null) {
      onTimeFocus(true);
    } else {
      onTimeFocus(false);
    }
  };

  const handleDateClear = (date) => {
    if (date === null) {
      setFieldsValue({ deadLineTimeQuery: null });
    }
  };

  const optionDataList = _.filter(queryEditionsList, opt => opt.type === '0'); // 下拉框数据
  const options = optionDataList.map(opt => <Option key={opt.id}>{opt.name}</Option>); // 下拉框选项
  options.unshift(<Option key={'请选择'}>全部配置</Option>);
  return (
    <div>
      <div className="components-search search">
        <div className="action-box">
          <Form layout="inline">
            <Row >
              <Col md={8} xxl={6}>
                <FormItem label="到期日期">
                  {getFieldDecorator('deadLineQuery', {
                    initialValue: query.deadLineQuery || null,
                  })(
                    <DatePicker
                      format="YYYY-MM-DD"
                      onChange={handleDateClear}
                      style={{ width: '100%' }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col md={8} xxl={6}>
                <FormItem label="到期时间">
                  {getFieldDecorator('deadLineTimeQuery', {
                    initialValue: query.deadLineTimeQuery || null,
                  })(
                    canOpenTimePicker
                    ? <TimePicker
                      defaultOpenValue={Moment('00:00:00', 'HH:mm:ss')}
                      format="HH:mm:ss"
                      inputReadOnly={false}
                      onFocus={handleFocus}
                      style={{ width: '100%' }}
                    /> : <TimePicker
                      defaultOpenValue={Moment('00:00:00', 'HH:mm:ss')}
                      format="HH:mm:ss"
                      inputReadOnly={false}
                      onFocus={handleFocus}
                      open={false}
                      style={{ width: '100%' }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col md={8} xxl={6}>
                <FormItem label="配置">
                  {getFieldDecorator('editionId', {
                    initialValue: '请选择',
                  })(
                    <Select >
                      {options}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col md={8} xxl={6}>
                <FormItem label="运行状态">
                  {getFieldDecorator('appStatusQuery', {
                    initialValue: '-1',
                  })(
                    <Select >
                      <Option key={'-1'}>全部状态</Option>
                      <Option key={'0'}>停用</Option>
                      <Option key={'1'}>正常</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={8} xxl={6} />
              <Col md={8} xxl={6} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={handleSearch}>搜索</Button>
                <Button type="default" onClick={handleSearch}>清除条件</Button>
              </Col>
            </Row>
            <Row>
              <Col md={24} xxl={24} style={{ textAlign: 'left' }}>
                <Button type="primary" disabled={selectedRows.length === 0} onClick={handleSetting}>设置</Button>
                <Button value="停用" disabled={canDisableList.length === 0} onClick={handleShowConfirm}>停用</Button>
                <Button value="启用" disabled={canEnableList.length === 0} onClick={handleShowConfirm}>启用</Button>
                <Button value="修改到期时间" disabled={selectedRows.length === 0} onClick={handleUpdateTime}>修改到期时间</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

search.propTypes = {
  canOpenTimePicker: PropTypes.bool,
  selectedRows: PropTypes.array,
  queryEditionsList: PropTypes.array,
  query: PropTypes.object,
  form: PropTypes.object,
  onTimeFocus: PropTypes.func,
  onEnable: PropTypes.func,
  onDisable: PropTypes.func,
  onSetting: PropTypes.func,
  onUpdateTime: PropTypes.func,
  onSearch: PropTypes.func,
};

export default Form.create()(search);
