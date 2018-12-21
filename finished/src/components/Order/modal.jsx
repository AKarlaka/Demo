/**
 * Created by Wangtaidong on 2018/2/2.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Table, List, Avatar, Icon } from 'antd';

const modal = ({ modalData, shopList, ...modalProps, pageModal, onPage, onConfirm }) => {
  const columns = [
    {
      title: <div>
        <p>订购门店</p>
        <p style={{ fontSize: 12 }}>门店ID</p>
      </div>,
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <p style={{ marginBottom: 0, fontSize: 14 }}>{record.name}</p>
          <p style={{ marginBottom: 0 }}>{record.id}</p>
        </div>),
    }, {
      title: '门店地址',
      dataIndex: 'shopAddress',
      key: 'shopAddress',
      render: (text, record) => `${record.province}${record.city}${record.district}${record.address}`,
    }, {
      title: '第三方绑定信息',
      dataIndex: 'isMeiweiOrShop',
      key: 'isMeiweiOrShop',
      render: (text, record) => (text ? (text.map((item, index) => {
        let third = '';
        const SpanElem = <i style={{ marginRight: 18 }} />;
        const IconElem = <Icon type="check-circle" style={{ color: '#52c41a' }} />;
        if (item) {
          switch (item) {
            case 'isMeiWei':
              // eslint-disable-next-line max-len
              third = <span key={index}>{IconElem} 美味 ( 门店ID : {record.meiweiPid}{SpanElem}门店名 : {record.meiweiShopName} ){SpanElem}</span>;
              break;
            case 'isShopId':
              third = <span key={index}>{IconElem} 口碑{SpanElem}</span>;
              break;
            default:
              third = '';
          }
        }
        return (third || null);
      })) : null),
    },
  ];
  return (
    <Modal {...modalProps}>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={shopList}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar style={{ width: 94, height: 94 }} src={item.applicationIcon} />}
              title={item.applicationName}
              description={item.description}
            />
          </List.Item>
        )}
      />
      <Table
        columns={columns}
        dataSource={modalData}
        pagination={pageModal}
        rowKey={record => record.id}
        onChange={onPage}
      />
      <Button
        type="primary"
        onClick={onConfirm}
        style={{ position: 'relative', left: '92%', bottom: -14 }}
      >
        确定
      </Button>
    </Modal>
  );
};
modal.propTypes = {
  modalProps: PropTypes.object,
  pageModal: PropTypes.object,
  modalData: PropTypes.array,
  shopList: PropTypes.array,
  onConfirm: PropTypes.func,
  onPage: PropTypes.func,
};

export default modal;
