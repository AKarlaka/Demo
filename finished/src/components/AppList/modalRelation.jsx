/**
 * Create by xiaochenghua on 2018/02/22
 * */

import React, { PropTypes } from 'react';
import { Modal, Form, TreeSelect, Row, Col, Spin } from 'antd';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

const relation = ({
  id,
  relationVisible,
  title,
  preApps,
  mutexApps,
  appTreeData,
  relationLoading,
  onCancel,
  onConfirm,
  onChange,
                  }) => {
  const relationProps = {
    title,
    visible: relationVisible,
    style: {
      width: 900,
    },
    onCancel,
    onOk: onConfirm,
    confirmLoading: relationLoading,
    maskClosable: false,
  };
  const treeData = appTreeData.filter(value => value.key !== id);
  // 前置应用
  const baseApp = {
    value: preApps,
    treeData,
    showCheckedStrategy: SHOW_PARENT,
    searchPlaceholder: '选择订购此应用需要先订购的应用',
    treeCheckable: true,
    allowClear: true,
    // disabled: relationLoading,
    style: {
      width: 300,
    },
  };

// 互斥应用
  const rejectApp = {
    value: mutexApps,
    treeData,
    showCheckedStrategy: SHOW_PARENT,
    searchPlaceholder: '不能与此应用同时订购的应用',
    treeCheckable: true,
    allowClear: true,
    // disabled: relationLoading,
    style: {
      width: 300,
    },
  };
  return (
    <Modal
      {...relationProps}
      id="relation"
    >
      <Spin spinning={relationLoading} >
        <Form>
          <Row style={{ marginBottom: 16 }}>
            <Col span={4} style={{ paddingTop: 4 }}>
              <b>前置应用：</b>
            </Col>
            <Col span={20}>
              <TreeSelect
                {...baseApp}
                onChange={e => onChange(e, 'pre')}
              />
            </Col>
          </Row>
          <Row>
            <Col span={4} style={{ paddingTop: 4 }}>
              <b>互斥应用：</b>
            </Col>
            <Col span={20}>
              <TreeSelect
                {...rejectApp}
                onChange={e => onChange(e, 'mutex')}
              />
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

relation.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  appTreeData: PropTypes.array,
  preApps: PropTypes.array,
  mutexApps: PropTypes.array,
  relationLoading: PropTypes.bool,
  relationVisible: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onChange: PropTypes.func,
};

export default Form.create()(relation);
