/* global BUILD_MODE */
let envConfig = {
  // 默认
  // 开发环境jar包下载
  jarUrl: 'http://file.dev.choicesaas.cn/file/choicecloud_manage',
  // 开发环境配置包下载
  fileUrl: 'http://admin.dev.choicesaas.cn/api/tenant/downloadOAuthCert?tenantId=',
};

if (BUILD_MODE === 'dev') {
  envConfig = {
    // 开发环境jar包下载
    jarUrl: 'http://file.dev.choicesaas.cn/file/choicecloud_manage',
    // 开发环境配置包下载
    fileUrl: 'http://admin.dev.choicesaas.cn/api/tenant/downloadOAuthCert?tenantId=',
  };
}
if (BUILD_MODE === 'tst') {
  envConfig = {
    // 测试环境jar包下载
    jarUrl: 'http://file.tst.choicesaas.cn/file/choicecloud_manage',
    // 测试环境配置包下载
    fileUrl: 'http://admin.tst.choicesaas.cn/api/tenant/downloadOAuthCert?tenantId=',
  };
}
if (BUILD_MODE === 'ttt') {
  envConfig = {
    // 测试环境jar包下载
    jarUrl: 'http://file.ttt.choicesaas.cn/file/choicecloud_manage',
    // 测试环境配置包下载
    fileUrl: 'http://admin.ttt.choicesaas.cn/api/tenant/downloadOAuthCert?tenantId=',
  };
}
if (BUILD_MODE === 'pre') {
  envConfig = {
    // 预发环境jar包下载
    jarUrl: 'http://file.pre.choicesaas.cn/file/choicecloud_manage',
    // 预发环境配置包下载
    fileUrl: 'http://admin.pre.choicesaas.cn/api/tenant/downloadOAuthCert?tenantId=',
  };
}
if (BUILD_MODE === 'pro') {
  envConfig = {
    // 生产环境jar包下载
    jarUrl: 'http://fileyun.choicesaas.cn/file/choicecloud_manage',
    // 生产环境下载配置文件
    fileUrl: 'http://admin.choicesaas.cn/api/tenant/downloadOAuthCert?tenantId=',
  };
}

module.exports = envConfig;
