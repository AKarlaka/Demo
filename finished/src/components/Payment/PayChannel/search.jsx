/**
 * Create by liukang on 2018/03/06
 * */
import React, { PropTypes } from 'react';
import { Form, Input, Button, Row, Col, Icon, Modal } from 'antd';

const FormItem = Form.Item;
const confirm = Modal.confirm;

const search = ({
  searchInfo,
  selectedRows,
  selectedStarts,
  selectedBlocks,
  startBtnStatus,
  blockBtnStatus,
  onBlock,
  onStart,
  onSearchChange,
  onSearch,
  onClearSearchInfo,
}) => {
  const formItemLayout = {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 14,
    },
  };
  // 显示弹框
  const handleConfirm = (e) => {
    const info = e.target.value;
    let content = '';
    let num = 0;
    const CheckedSelectedRows = selectedRows.length;
    // if (CheckedSelectedRows <= 0) {
    //   message.warning('没有选择的支付渠道');
    //   return;
    // }
    switch (info) {
      case '启用':
        num = selectedBlocks.length;
        content = `当前选中${CheckedSelectedRows}个渠道，可启用${num}个！`;
        break;
      case '停用':
        num = selectedStarts.length;
        content = `当前选中${CheckedSelectedRows}个渠道，可停用${num}个！`;
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
            onStart();
            break;
          case '停用':
            onBlock();
            break;
          default:
            break;
        }
      },
      onCancel() {},
    });
  };

  return (
    <div>
      <Form layout="inline">
        <Row>
          <Col span={8} >
            <FormItem
              {...formItemLayout}
              label="支付渠道名称"
            >
              <Input
                value={searchInfo}
                onChange={onSearchChange}
                onPressEnter={onSearch}
                placeholder="输入支付渠道名称"
                style={{ width: 200 }}
                suffix={searchInfo &&
                <Icon
                  type="close-circle"
                  style={{ fontSize: 13, color: 'rgba(0, 0, 0, 0.35)', cursor: 'pointer' }}
                  onClick={onClearSearchInfo}
                />}
              />
            </FormItem>
          </Col>
          <Col span={8} style={{ marginLeft: 60 }}>
            <FormItem>
              <Button type="primary" onClick={onSearch}>搜索</Button>
            </FormItem>
          </Col>
        </Row>
        <Row style={{ marginTop: 10 }}>
          <Col span={12}>
            <FormItem>
              <Button value="停用" onClick={handleConfirm} disabled={blockBtnStatus}>停用</Button>
            </FormItem>
            <FormItem>
              <Button value="启用" onClick={handleConfirm} disabled={startBtnStatus}>启用</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>);
};

search.propTypes = {
  searchInfo: PropTypes.string,
  selectedRows: PropTypes.array,
  selectedStarts: PropTypes.array,
  selectedBlocks: PropTypes.array,
  startBtnStatus: PropTypes.bool,
  blockBtnStatus: PropTypes.bool,
  onBlock: PropTypes.func,
  onStart: PropTypes.func,
  onSearchChange: PropTypes.func,
  onSearch: PropTypes.func,
  onClearSearchInfo: PropTypes.func,
};

export default Form.create()(search);
