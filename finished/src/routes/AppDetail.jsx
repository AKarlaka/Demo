/**
 * Create by xiaochenghua on 2018/02/01
 * */
import React, { PropTypes } from 'react';
import { connect } from 'dva/index';
import Detail from '../components/AppDetail/detail';

const AppDetail = ({ dispatch, cloudState }) => {
  const { id, viewPath } = cloudState.appDetail;
  const loading = cloudState.loading.effects;
  const detailProps = {
    id,
    viewPath,
    loading: loading['appDetail/query'],
    // 提交
    onSubmit(value) {
      dispatch({
        type: 'appDetail/edit',
        payload: {
          viewPath: value || viewPath,
        },
      });
    },
    // 取消
    onCancel() {
      dispatch({
        type: 'appDetail/returnList',
      });
      dispatch({
        type: 'appDetail/updateState',
        payload: {
          viewPath: '',
        },
      });
    },
    // 输入内容
    onChange(value) {
      dispatch({
        type: 'appDetail/updateState',
        payload: {
          viewPath: value,
        },
      });
    },
  };
  return (
    <div>
      <Detail {...detailProps} />
    </div>
  );
};

AppDetail.propTypes = {
  cloudState: PropTypes.object,
  dispatch: PropTypes.func,
};
const mapStateToProps = cloudState => ({ cloudState });

export default connect(mapStateToProps)(AppDetail);
