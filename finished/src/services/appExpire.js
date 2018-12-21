/**
 * Created by zhangnaiying on 2018/09/03
 */
import request from '../utils/request';

export async function inquire(params) {
  return request('/api/appdeadLine/appDeadLinePage', {
    method: 'post',
    body: params,
  });
}
// 查询门店过期信息
export async function inquireShopInfo(params) {
  return request('/api/appdeadLine/appDeadLineShopPage', {
    method: 'post',
    body: params,
  });
}
// 查询应用信息
export async function inquireAppInfo(params) {
  return request('/api/application/getApplicationById', {
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
