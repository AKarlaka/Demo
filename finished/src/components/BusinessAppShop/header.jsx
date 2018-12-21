/**
 * Created by zhangnaiying on 2018/09/02
 */
import React, { PropTypes } from 'react';
import { List, Divider, Badge, Tag, Button, Tooltip } from 'antd';
import classNames from 'classnames';
import style from './header.less';

const ButtonGroup = Button.Group;

const header = ({
    deadLineInfo,
    appInfo,
    btnSelectedStatus,
    onSearch,
  }) => {
  const headerDataList = [{
    id: appInfo.id,
    applicationName: appInfo.applicationName,
    applicationIcon: appInfo.applicationIcon,
  }];
  const handleClick = (index, e) => {
    onSearch(index, e.target.value);
  };
  return (<div>
    <List
      itemLayout="horizontal"
      dataSource={headerDataList}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            avatar={<img style={{ width: 80 }} src={item.applicationIcon} role="presentation" />}
            title={
              <b style={{ fontSize: 16 }}>
                {item.applicationName}
                {appInfo.sellStrategy === 0 && <Tag style={{ marginLeft: '10px' }} color="green">免费</Tag>}
                {appInfo.sellStrategy === 1 && <Tag style={{ marginLeft: '10px' }} color="orange">收费</Tag>}
              </b>
            }
            description={
              <ButtonGroup>
                <Tooltip>
                  <Button
                    value={'-1'}
                    className={
                    classNames([style.initial], { [style.selected]: btnSelectedStatus[0] })
                  }
                    onClick={e => handleClick(0, e)}
                  >共{deadLineInfo.applicationOff + deadLineInfo.applicationOn}家门店：</Button>
                </Tooltip>
                <Tooltip placement="bottomLeft" title={'该数字为严重逾期且正常状态下的门店数'}>
                  <Button
                    value={'3'}
                    className={
                    classNames([style.initial], { [style.selected]: btnSelectedStatus[1] })
                  }
                    onClick={e => handleClick(1, e)}
                  >
                    <Badge status="error" text={`${deadLineInfo.seriousOverdueShop}门店严重逾期`} />
                  </Button>
                </Tooltip>
                <Tooltip placement="bottomLeft" title={'该数字为已到期且正常状态下的门店数'}>
                  <Button
                    value={'2'}
                    className={
                      classNames([style.initial], { [style.selected]: btnSelectedStatus[2] })
                    }
                    onClick={e => handleClick(2, e)}
                  >
                    <Badge status="error" text={`${deadLineInfo.overdueShop}门店已到期`} />
                  </Button>
                </Tooltip>
                <Tooltip placement="bottomLeft" title={'该数字为即将到期且正常状态下的门店数'}>
                  <Button
                    value={'1'}
                    className={
                    classNames([style.initial], { [style.selected]: btnSelectedStatus[3] })
                  }
                    onClick={e => handleClick(3, e)}
                  >
                    <Badge status="warning" text={`${deadLineInfo.almostOverdueShop}门店即将到期`} />
                  </Button>
                </Tooltip>
                <Tooltip placement="bottomLeft" title={'该数字为未到期且正常状态下的门店数'}>
                  <Button
                    value={'0'}
                    className={
                    classNames([style.initial], { [style.selected]: btnSelectedStatus[4] })
                  }
                    onClick={e => handleClick(4, e)}
                  >
                    <Badge status="success" text={`${deadLineInfo.noOverdueShop}门店未到期`} />
                  </Button>
                </Tooltip>
              </ButtonGroup>
            }
          />
        </List.Item>
      )}
    />
    <Divider />
  </div>);
};

header.propTypes = {
  btnSelectedStatus: PropTypes.array,
  appInfo: PropTypes.object,
  deadLineInfo: PropTypes.object,
  onSearch: PropTypes.func,
};

export default header;
