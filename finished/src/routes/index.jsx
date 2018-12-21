/**
 * Created by yunbaoyuan on 2017/9/4.
 */
import React from 'react';
import PropTypes from 'prop-types';
import RouterConfig from '../router';
import Login from './Login';
import Bussiness from './Business';
import Order from './Order';
import AppList from './AppList';
import AppDetail from './AppDetail';
import TakeoutSet from './TakeoutSet';
import BusinessApp from './BusinessApp';
import BusinessAppShop from './BusinessAppShop';
import AppExpire from './AppExpire';

const registerModel = (app, model) => {
  const { _models } = app;
  if (!(_models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model);
  }
};
const Router = ({ history, app }) => {
  const routes = [
    {
      path: '/login',
      component: Login,
    }, {
      path: '/business',
      component: Bussiness,
    },
    {
      path: '/business/receiptAccount/:id',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('../models/payment/receiptAccount'));
          cb(null, require('../routes/payment/ReceiptAccount'));
        }, 'receiptAccount');
      },
    }, {
      path: '/business/receiptAccount/channel/:merchantId/:accId',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('../models/payment/receiptChannel'));
          cb(null, require('../routes/payment/ReceiptChannel'));
        }, 'receiptChannel');
      },
    }, {
      path: '/business/receiptAccount/shop/:merchantId/:accId',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('../models/payment/receiptShop'));
          cb(null, require('../routes/payment/ReceiptShop'));
        }, 'receiptShop');
      },
    }, {
      path: '/order',
      component: Order,
    },
    {
      path: '/app/list',
      component: AppList,
    },
    {
      path: '/app/detail/:id',
      component: AppDetail,
    }, {
      path: '/payChannel',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('../models/payment/payChannel'));
          cb(null, require('../routes/payment/PayChannel'));
        }, 'payChannel');
      },
    },
    {
      path: '/aggregator',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('../models/payment/aggregator'));
          cb(null, require('../routes/payment/Aggregator'));
        }, 'aggregator');
      },
    },
    {
      path: '/isv',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('../models/payment/isv'));
          cb(null, require('../routes/payment/Isv'));
        }, 'isv');
      },
    },
    {
      path: '/takeout/set',
      component: TakeoutSet,
    }, {
      path: '/business/app/:businessId',
      component: BusinessApp,
    }, {
      path: '/business/app/shop/:businessId/:appId',
      component: BusinessAppShop,
    },
    {
      path: '/app/expire',
      component: AppExpire,
    },
  ];
  const routerProps = {
    history,
    app,
    routes,
  };

  return <RouterConfig {...routerProps} />;
};

Router.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
};

export default Router;
