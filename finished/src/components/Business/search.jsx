import React, { PropTypes } from 'react';
import { Input, Button, Row, Col, Modal, Icon, Form } from 'antd';
import FormItem from 'antd/lib/form/FormItem';

const confirm = Modal.confirm;

const search = ({
  loading,
  searchInfo,    // 搜索信息
  deleteBtnStatus, // 删除按钮禁用状态
  startBtnStatus,  // 启用按钮禁用状态
  blockBtnStatus,  // 停用按钮禁用状态
  checkedBussinessStartId, // 选中可停用商户id
  checkedBussinessBlockId, // 选中可启用商户id
  checkedBussiness,  // 选中商户
  onClearSearchInfo,
  onSearch,      // 搜索按钮
  onAdd,      // 新增员工
  onEnable,       // 启用
  onDisable,       // 停用
  onDelete,      // 删除
  onUpdataJar,   // 更新配置包
  onSearchChange,
 }) => {
  // 显示弹框
  const handleShowConfirm = (e) => {
    const info = e.target.value;
    let BussinessNumber = 0;
    let content = '';
    const CheckedBussinessNumber = checkedBussiness.length;
    switch (info) {
      case '删除':
        BussinessNumber = checkedBussiness.length;
        content = `删除选中的${BussinessNumber}个商户！`;
        break;
      case '启用':
        BussinessNumber = checkedBussinessBlockId.length;
        content = `当前选中${CheckedBussinessNumber}个商户，可启用${BussinessNumber}个商户！`;
        break;
      case '停用':
        BussinessNumber = checkedBussinessStartId.length;
        content = `当前选中${CheckedBussinessNumber}个商户，可停用${BussinessNumber}个商户！`;
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
          case '删除':
            onDelete();
            break;
          case '启用':
            onEnable();
            break;
          case '停用':
            onDisable();
            break;
          case '重置配置包':
            onUpdataJar();
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
      <div className="components-search search">
        <div className="action-box">
          <Form layout="inline">
            <Row>
              <Col span={8} >
                <FormItem label="条件">
                  <Input
                    value={searchInfo}
                    onChange={onSearchChange}
                    onPressEnter={onSearch}
                    placeholder="商户名、管理员或手机号"
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
                <Button type="primary" onClick={onAdd}>+ 新增商户</Button>
                <Button value="停用" onClick={handleShowConfirm} disabled={blockBtnStatus}>停用</Button>
                <Button value="启用" onClick={handleShowConfirm} disabled={startBtnStatus}>启用</Button>
                <Button value="删除" onClick={handleShowConfirm} disabled={deleteBtnStatus}>删除</Button>
                <Button value="重置配置包" onClick={handleShowConfirm} loading={loading} >重置配置包</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>);
};

search.propTypes = {
  searchInfo: PropTypes.string,
  loading: PropTypes.bool,
  deleteBtnStatus: PropTypes.bool,
  startBtnStatus: PropTypes.bool,
  blockBtnStatus: PropTypes.bool,
  checkedBussinessStartId: PropTypes.array,
  checkedBussinessBlockId: PropTypes.array,
  checkedBussiness: PropTypes.array,
  onSearchChange: PropTypes.func,
  onClearSearchInfo: PropTypes.func,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  onEnable: PropTypes.func,
  onDisable: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdataJar: PropTypes.func,
};

export default search;
