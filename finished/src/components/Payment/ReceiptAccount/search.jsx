/**
 * Create by liukang on 2018/03/06
 * */
import React, { PropTypes } from 'react';
import { Input, Button, Row, Col, Icon, Modal, Form } from 'antd';

const confirm = Modal.confirm;
const FormItem = Form.Item;

const search = ({
  searchInfo,
  selectedRows,
  selectedStarts,
  selectedBlocks,
  startBtnStatus,
  blockBtnStatus,
  deleteBtnStatus,
  onAdd,
  onClearSearchInfo,
  onBlock,
  onStart,
  onSearchChange,
  onSearch,
  onDelete,
}) => {
  // 显示弹框
  const handleConfirm = (e) => {
    const info = e.target.value;
    let AccountNumber = 0;
    let content = '';
    const CheckedSelectedRows = selectedRows.length;
    switch (info) {
      case '启用':
        AccountNumber = selectedBlocks.length;
        content = `当前选中${CheckedSelectedRows}个账户，可启用${AccountNumber}个商户！`;
        break;
      case '停用':
        AccountNumber = selectedStarts.length;
        content = `当前选中${CheckedSelectedRows}个账户，可停用${AccountNumber}个商户！`;
        break;
      case '删除':
        AccountNumber = selectedRows.length;
        content = `当前选中${CheckedSelectedRows}个账户，确定删除吗！`;
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
          case '删除':
            onDelete();
            break;
          default:
            break;
        }
      },
      onCancel() {},
    });
  };

  return (
    <div className="components-search search">
      <div className="action-box">
        <Form layout="inline">
          <Row>
            <Col span={8}>
              <FormItem label="账户名称">
                <Input
                  key="search"
                  value={searchInfo}
                  onChange={onSearchChange}
                  onPressEnter={onSearch}
                  placeholder="输入账户名称"
                  suffix={searchInfo &&
                  <Icon
                    type="close-circle"
                    style={{ fontSize: 13, color: 'rgba(0, 0, 0, 0.35)', cursor: 'pointer' }}
                    onClick={onClearSearchInfo}
                  />}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <Button type="primary" onClick={onSearch}>搜索</Button>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <Button onClick={onAdd} icon="plus" type="primary">新增账户</Button>
              <Button value="停用" onClick={handleConfirm} disabled={blockBtnStatus}>停用</Button>
              <Button value="启用" onClick={handleConfirm} disabled={startBtnStatus}>启用</Button>
              <Button value="删除" onClick={handleConfirm} disabled={deleteBtnStatus}>删除</Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>);
};

search.propTypes = {
  selectedStarts: PropTypes.array,
  selectedRows: PropTypes.array,
  selectedBlocks: PropTypes.array,
  startBtnStatus: PropTypes.bool,
  blockBtnStatus: PropTypes.bool,
  deleteBtnStatus: PropTypes.bool,
  searchInfo: PropTypes.string,
  onBlock: PropTypes.func,
  onStart: PropTypes.func,
  onSearchChange: PropTypes.func,
  onSearch: PropTypes.func,
  onClearSearchInfo: PropTypes.func,
  onDelete: PropTypes.func,
  onAdd: PropTypes.func,
};

export default search;
