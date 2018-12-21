/**
 * Created by zhangnaiying on 2018/09/02
 */
import request from '../utils/request';

// 查询列表
export async function inquire(params) {
  return request('/api/app/listStoreInfoByTenantIdAndAppId', {
    method: 'post',
    body: params,
  });
}
// 根据应用及商户id及门店id获取按门店配置信息
export async function inquireSetOpt(params) {
  return request('/api/app/listEditionsByAppId', {
    method: 'post',
    body: params,
  });
}
// 根据应用及商户id获取到期详情统计
export async function inquireDeadLineInfo(params) {
  return request('/api/appdeadLine/tenantAppDeadLineInfo', {
    method: 'post',
    body: params,
  });
}
// 获取应用信息
export async function inquireAppInfo(params) {
  return request('/api/application/getApplicationById', {
    method: 'post',
    body: params,
  });
}
// 修改到期时间
export async function update(params) {
  return request('/api/app/updateStoreDeadLineByTenantIdAndAppId', {
    method: 'post',
    body: params,
  });
}

// 修改应用配置
export async function updateEdition(params) {
  return request('/api/app/saveApplicationShopEditionsByAppId', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 停用启用
export async function enable(params) {
  return request('/api/app/handleAppOnShopByAppIdAndShopId', {
    method: 'post',
    body: params,
  });
}
