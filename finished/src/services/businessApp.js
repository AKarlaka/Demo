/**
 * Created by zhangnaiying on 2018/08/31
 */
import request from '../utils/request';

// 查询某商户订购的应用列表
export async function inquire(params) {
  return request('/api/app/listAppInfoByTenantId', {
    method: 'post',
    body: params,
  });
}

// 查询设置模态框选项
export async function inquireSetOpt(params) {
  return request('/api/app/listEditionsByAppId', {
    method: 'post',
    body: params,
  });
}

// 查询订购应用模态框所有应用列表
export async function inquireAppList(params) {
  return request('/api/application/getAppList', {
    method: 'post',
    body: params,
  });
}

// 获取门店树列表
export async function inquireShop(params) {
  return request('/api/store/getNotOrderStoreTreeByOrgTypesApp', {
    method: 'post',
    body: params,
  });
}

// 订购应用
export async function create(params) {
  return request('/api/orderApp/saveOrderApplication', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


// 修改到期时间
export async function updateExpireTime(params) {
  return request('/api/app/updateDeadLineByTenantIdAndAppId', {
    method: 'post',
    body: params,
  });
}

// 保存配置
export async function updateEdition(params) {
  return request('/api/app/saveApplicationShopEditionsByAppId', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 商户应用的启用、停用
export async function enable(params) {
  return request('/api/app/handleAppOnShop', {
    method: 'post',
    body: params,
  });
}

// 商户应用的删除
export async function remove(params) {
  return request('/api/app/logicalDeleteByTenantIdAndAppId', {
    method: 'post',
    body: params,
  });
}
