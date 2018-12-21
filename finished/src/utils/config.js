import envConfig from './envConfig';

const PAYMENT = '/plAdmin';
// const TEST_PAYMENT = '/test_payment';

module.exports = {
  name: '云中控台',
  prefix: 'rt-report',
  footerText: 'Choice云中控台 v1.0',
  logo: './images/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  openPages: ['/login', '/register', '/registerResult', '/forgetPassword', '/forgetPasswordResult', '/password', '/baseInfo'],
  api: {
    payment: {
      payChannel: `${PAYMENT}`,
      aggregator: `${PAYMENT}`,
      isv: `${PAYMENT}`,
      receiptAccount: `${PAYMENT}`,
      receiptChannel: `${PAYMENT}`,
      receiptShop: `${PAYMENT}`,
    },
  },
  ...envConfig,
};
