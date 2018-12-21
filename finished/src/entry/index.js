import dva from 'dva';
import createLoading from 'dva-loading';
import './index.less';

// 1. Initialize
const app = dva({
  onError(error) {
    console.error(error);
  },
});

// 2. Plugins
app.use(createLoading({
  effects: true,
}));

// 3. Model
app.model(require('../models/app'));
app.model(require('../models/login'));
app.model(require('../models/business'));
app.model(require('../models/order'));
app.model(require('../models/appList'));
app.model(require('../models/appDetail'));
app.model(require('../models/takeoutSet'));
app.model(require('../models/businessApp'));
app.model(require('../models/businessAppShop'));
app.model(require('../models/appExpire'));

// 4. Router
app.router(require('../routes'));

// 5. Start
app.start('#root');

