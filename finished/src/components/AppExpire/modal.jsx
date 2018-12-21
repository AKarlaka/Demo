/**
 * Created by zhangnaiying on 2018/09/03
 */
import React, { PropTypes } from 'react';
import { Modal, Form, Input, Row, Col, Badge, Table, Button, List, Divider, Tag } from 'antd';
import classNames from 'classnames';
import style from './modal.less';

const ButtonGroup = Button.Group;
const FormItem = Form.Item;

const modal = ({
  loading,
  appInfo,
  deadLineInfo,
  shopPagination,
  shopDataList,
  title,
  modalVisible,
  modalKey,
  queryShopInfo,
  btnSelectedStatus,
  onPageChange,
  onStatusChange,
  onCancle,
  onSearch,
  form: {
    getFieldDecorator,
    getFieldsValue,
    resetFields,
  },
}) => {
  // header部分
  const headerDataList = [{
    id: appInfo.id,
    applicationName: appInfo.applicationName,
    applicationIcon: appInfo.applicationIcon,
  }];

  const handleClickHeader = (index, e) => {
    onStatusChange(index, e.target.value);
  };

  const header = (<div>
    <List
      itemLayout="horizontal"
      dataSource={headerDataList}
      renderItem={data => (
        <List.Item>
          <List.Item.Meta
            avatar={<img style={{ width: 80 }} src={data.applicationIcon} role="presentation" />}
            title={
              <b style={{ fontSize: 16 }}>
                {data.applicationName}
                {appInfo.sellStrategy === 0 && <Tag style={{ marginLeft: '10px' }} color="green">免费</Tag>}
                {appInfo.sellStrategy === 1 && <Tag style={{ marginLeft: '10px' }} color="orange">收费</Tag>}
              </b>
            }
            description={
              <ButtonGroup>
                <Button
                  value={'-1'}
                  className={
                    classNames([style.initial], { [style.selected]: btnSelectedStatus[0] })
                  }
                  onClick={e => handleClickHeader(0, e)}
                >共{deadLineInfo.applicationOff + deadLineInfo.applicationOn}家门店：</Button>
                <Button
                  value={'3'}
                  className={
                    classNames([style.initial], { [style.selected]: btnSelectedStatus[1] })
                  }
                  onClick={e => handleClickHeader(1, e)}
                >
                  <Badge status="error" text={`${deadLineInfo.seriousOverdueShop}门店严重逾期`} />
                </Button>
                <Button
                  value={'2'}
                  className={
                    classNames([style.initial], { [style.selected]: btnSelectedStatus[2] })
                  }
                  onClick={e => handleClickHeader(2, e)}
                >
                  <Badge status="error" text={`${deadLineInfo.overdueShop}门店已到期`} />
                </Button>
                <Button
                  value={'1'}
                  className={
                    classNames([style.initial], { [style.selected]: btnSelectedStatus[3] })
                  }
                  onClick={e => handleClickHeader(3, e)}
                >
                  <Badge status="warning" text={`${deadLineInfo.almostOverdueShop}门店即将到期`} /></Button>
                <Button
                  value={'0'}
                  disabled
                  className={
                    classNames([style.initial], { [style.selected]: btnSelectedStatus[4] })
                  }
                  onClick={e => handleClickHeader(4, e)}
                >
                  <Badge status="success" text={`${deadLineInfo.noOverdueShop}门店未到期`} />
                </Button>
                <Button
                  value={'停用'}
                  className={
                    classNames([style.initial], { [style.selected]: btnSelectedStatus[5] })
                  }
                  onClick={e => handleClickHeader(5, e)}
                >
                  <Badge status="error" text={`${deadLineInfo.applicationOff}门店已停用`} />
                </Button>
                <Button
                  value={'正常'}
                  className={
                    classNames([style.initial], { [style.selected]: btnSelectedStatus[6] })
                  }
                  onClick={e => handleClickHeader(6, e)}
                >
                  <Badge status="success" text={`${deadLineInfo.applicationOn}门店正常`} />
                </Button>
              </ButtonGroup>
            }
          />
        </List.Item>
      )}
    />
    <Divider />
  </div>);

  // search部分
  const handleSearch = (e) => {
    if (e.target) {
      if (e.target.innerText === '清除条件') {
        resetFields();
        onSearch();
      } else {
        const data = getFieldsValue();
        onSearch(data);
      }
    }
  };
  const search = (
    <div>
      <div className="components-search search">
        <div className="action-box">
          <Form layout="inline">
            <Row >
              <Col md={11} xxl={12} />
              <Col md={8} xxl={8}>
                <FormItem label="门店名称">
                  {getFieldDecorator('shopName', {
                    initialValue: queryShopInfo.shopName,
                  })(
                    <Input placeholder="搜索门店" />,
                  )}
                </FormItem>
              </Col>
              <Col md={5} xxl={4} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={handleSearch}>搜索</Button>
                <Button type="default" onClick={handleSearch}>清除条件</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );

  // list部分
  const columns = [{
    title: '门店名称/ID',
    dataIndex: 'shop',
    key: 'shop',
    render: (text, record) => (
      <div>
        <p>{record.shopName}</p>
        <p>{record.shopId}</p>
      </div>
      ),
  }, {
    title: '到期时间',
    dataIndex: 'deadline',
    key: 'deadline',
    render: text => new Date(text).Format('yyyy-MM-dd hh:mm:ss'),
  }, {
    title: '到期状态',
    dataIndex: 'overdueType',
    key: 'overdueType',
    render: (text) => {
      let statusTxt = '';
      if (text === 0) {
        statusTxt = <Badge status="success" text="使用中" />;
      } else if (text === 1) {
        statusTxt = <Badge status="warning" text="即将到期" />;
      } else if (text === 2) {
        statusTxt = <Badge status="error" text="已到期" />;
      } else if (text === 3) {
        statusTxt = <Badge status="error" text="严重逾期" />;
      }
      return statusTxt;
    },
  }, {
    title: '运行状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      let statusTxt = '';
      if (text === 1) {
        statusTxt = <Badge status="success" text="正常" />;
      } else if (text === 0) {
        statusTxt = <Badge status="error" text="停用" />;
      }
      return statusTxt;
    },
  }];

  const list = (
    <Table
      bordered
      rowKey={data => data.shopId}
      dataSource={shopDataList}
      columns={columns}
      loading={loading}
      pagination={shopPagination}
      onChange={onPageChange}
    />
  );

  // modal部分
  const modalOpts = {
    title,
    visible: modalVisible,
    key: modalKey,
    maskClosable: false,
  };

  return (
    <Modal
      {...modalOpts}
      width={'80%'}
      onOk={onCancle}
      onCancel={onCancle}
      footer={[<Button type="primary" onClick={onCancle}>知道了</Button>]}
    >
      {header}
      {search}
      {list}
    </Modal>
  );
};

modal.propTypes = {
  loading: PropTypes.bool,
  modalVisible: PropTypes.bool,
  title: PropTypes.string,
  modalKey: PropTypes.string,
  shopDataList: PropTypes.array,
  btnSelectedStatus: PropTypes.array,
  shopPagination: PropTypes.object,
  appInfo: PropTypes.object,
  deadLineInfo: PropTypes.object,
  queryShopInfo: PropTypes.object,
  form: PropTypes.object,
  onCancle: PropTypes.func,
  onPageChange: PropTypes.func,
  onSearch: PropTypes.func,
  onStatusChange: PropTypes.func,
};

export default Form.create()(modal);
