/**
 * Created by zhangnaiying on 2018/09/03
 */
import React, { PropTypes } from 'react';
import { Table, Badge } from 'antd';

const list = ({
  loading,
  pagination,
  dataList,
  onPageChange,
  onDetail,
}) => {
  const columns = [{
    title: '商户名称',
    dataIndex: 'tenantName',
    key: 'tenantName',
  }, {
    title: '到期时间',
    dataIndex: 'deadline',
    key: 'deadline',
    render: text => new Date(text).Format('yyyy-MM-dd hh:mm:ss'),
  }, {
    title: '应用名称',
    dataIndex: 'applicationName',
    key: 'applicationName',
  }, {
    title: '应用类型',
    dataIndex: 'sellType',
    key: 'sellType',
    render: (text) => {
      if (text === 0) {
        return '按门店订购';
      } else if (text === 1) {
        return '按商户订购';
      }
      return '';
    },
  }, {
    title: '到期详情',
    dataIndex: 'info',
    key: 'info',
    render: (text, record) => {
      if (record.sellType === 0) {
        return (
          <div>
            { record.seriousOverdueShop !== 0 && <p><Badge status="error" text={`${record.seriousOverdueShop}门店严重逾期`} /></p> }
            { record.overdueShop !== 0 && <p><Badge status="error" text={`${record.overdueShop}门店已到期`} /></p> }
            { record.almostOverdueShop !== 0 && <p><Badge status="warning" text={`${record.almostOverdueShop}门店即将到期`} /></p> }
          </div>
        );
      } else if (record.sellType === 1) {
        return (
          <div>
            { <text style={{ color: `${record.almostOverdueShop > 0 ? '#faad14' : '#f5222d'}` }}>{new Date(record.deadline).Format('yyyy-MM-dd hh:mm:ss')}</text> }
            { record.seriousOverdueShop > 0 && <p><Badge status="error" text={'严重逾期'} /></p> }
            { record.overdueShop > 0 && <p><Badge status="error" text={'已到期'} /></p> }
            { record.almostOverdueShop > 0 && <p><Badge status="warning" text={'即将到期'} /></p> }
          </div>
        );
      }
      return '---';
    },
  }, {
    title: '联系方式',
    dataIndex: 'tenTel',
    key: 'tenTel',
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <button className="btn-link" onClick={() => onDetail(record)}>查看详情</button>
      </span>
      ),
  }];
  return (
    <Table
      bordered
      loading={loading}
      rowKey={item => `${item.tenantId},${item.applicationId}`}
      dataSource={dataList}
      columns={columns}
      pagination={pagination}
      onChange={onPageChange}
    />
  );
};

list.propTypes = {
  loading: PropTypes.bool,
  dataList: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onDetail: PropTypes.func,
};

export default list;
