import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'dva/router';
import { connect } from 'dva';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import App from './routes/App';


const RouterConfig = ({ history, dispatch, routes }) => {
  const router = [
    {
      path: '/',
      name: 'app',
      component: App,
      indexRoute: { onEnter: (nextState, replace) => replace('/login') },
      onEnter(nextState) {
        const { pathname } = nextState.location;
        if (pathname !== '/' && pathname !== '/register' && pathname !== '/registerResult' && pathname !== '/forgetPassword' && pathname !== '/forgetPasswordResult') {
          dispatch({
            type: 'manage/checkLogin',
          });
        }
      },
      childRoutes: routes,
    },
  ];
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history} routes={router} />
    </LocaleProvider>
  );
};

RouterConfig.propTypes = {
  history: PropTypes.object,
  dispatch: PropTypes.func,
  routes: PropTypes.array,
};

export default connect()(RouterConfig);
