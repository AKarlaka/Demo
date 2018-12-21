/**
 * Created by Wangtaidong on 2018/2/1.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Tag } from 'antd';

const secondRowColor = '#807d78';

const List = ({
  loading,
  dataSource,
  pagination,
  onView,
  onPageChange,
  // onReview,
  // onRefuse,
}) => {
  const columns = [{
    title: <div>
      <p>订单信息</p>
      <p style={{ color: secondRowColor }}>编号|时间</p>
    </div>,
    dataIndex: 'orderInfo',
    key: 'orderInfo',
    render: (text, record) => (
      <div style={{ textAlign: 'left' }}>
        <p style={{ marginBottom: 0 }}>{record.orderCode}</p>
        <p style={{ marginBottom: 0, color: secondRowColor }}>{record.createTime}</p>
      </div>),
  }, {
    title: '服务名称',
    dataIndex: 'applicationName',
    key: 'applicationName',
  }, {
    title: <div style={{ textAlign: 'left' }}>
      <p>订购商户</p>
      <p>PID</p>
    </div>,
    dataIndex: 'tenantName',
    key: 'tenantName',
    render: (text, record) => (
      <div style={{ textAlign: 'left' }}>
        <p style={{ marginBottom: 0 }}>{record.tenantName}</p>
        <p style={{ marginBottom: 0 }}>{record.tenantId}</p>
      </div>
    ),
  }, {
    title: <div>
      <p>联系人信息</p>
      <p style={{ color: secondRowColor }}>姓名|手机</p>
    </div>,
    dataIndex: 'connectInfo',
    key: 'connectInfo',
    render: (text, record) => (
      <div style={{ textAlign: 'left' }}>
        <p style={{ marginBottom: 0 }}>{record.connectName}</p>
        <p style={{ marginBottom: 0, color: secondRowColor }}>{record.connectMobile}</p>
      </div>
    ),
  }, {
    title: <div>
      <p>订购信息</p>
      <p style={{ color: secondRowColor }}>周期</p>
    </div>,
    dataIndex: 'period',
    key: 'period',
    render: (text, record) => {
      if (record.period === -1) {
        return (
          <p>永久</p>
        );
      } else if (record.namt === 0) {
        return (
          <p>{record.period}天</p>
        );
      } else if (record.namt !== 0) {
        return (<p>{record.period / 30}个月</p>);
      }
      return true;
    },
  }, {
    title: '门店数',
    dataIndex: 'shop',
    key: 'shop',
    width: 78,
    render: (text, record) => (
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: 2 }}>{record.shopCount}</p>
        <p style={{ marginBottom: 0 }}>
          <span>
            <button className="btn-link" onClick={() => onView(record)}>查看</button>
          </span>
        </p>
      </div>
    ),
  }, {
    title: '订单总价',
    dataIndex: 'namt',
    key: 'namt',
    render: (text) => {
      if (text === -1) {
        return '面议';
      } else if (text === 0) {
        return '免费';
      } else if (text === -2) {
        return 0;
      }
      return text;
    },
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    // 下列注释部分不要删，后期可能会重新使用
    // render: (text) => {
    //   let statusText = '';
    //   if (text === 0) {
    //     statusText = <Tag color="#FF9900">待处理</Tag>;
    //   } else if (text === 1) {
    //     statusText = <Tag color="#87D068">已生效</Tag>;
    //   } else if (text === 2) {
    //     statusText = <Tag color="#CCCCCC">已取消</Tag>;
    //   } else if (text === 3) {
    //     statusText = <Tag color="#F04134">未通过</Tag>;
    //   }
    //   return statusText;
    // },
    render: () => <Tag color="#FF9900">待处理</Tag>,
  }, {
    title: '操作',
    key: 'action',
    // 下列注释部分不要删，后期可能会重新使用
    // render: (text, record) => {
    //   if (record.status === 0) {
    //     return (
    //       <div>
    //         <span>
    //           <button
    //             className="btn-link"
    //             style={{ color: '#108EE9' }}
    //             onClick={(e) => { onReview(e, record); }}
    //           >审核通过</button>
    //         </span>
    //         <span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
    //         <span>
    //           <button
    //             className="btn-link"
    //             style={{ color: '#FF9900' }}
    //             onClick={(e) => { onRefuse(e, record); }}
    //           >不通过</button>
    //         </span>
    //       </div>
    //     );
    //   }
    //   return ('---');
    // },
    render: () => '---',
  }];
  return (
    <div>
      <Table
        columns={columns}
        bordered
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        rowKey={record => record.id}
        onChange={onPageChange}
        scroll={{ x: 1150 }}
      />
    </div>
  );
};

List.propTypes = {
  loading: PropTypes.bool,
  dataSource: PropTypes.array,
  pagination: PropTypes.object,
  onView: PropTypes.func,
  onPageChange: PropTypes.func,
  // onReview: PropTypes.func,
  // onRefuse: PropTypes.func,
};

export default List;
