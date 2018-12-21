/**
 * Created by Wangtaidong on 2018/2/8.
 */
import request from '../utils/request';

export async function inquire(params) {
  return request('/api/orderApplication/getOrderApplications', {
    method: 'post',
    body: params,
  });
}

// 查询所有服务
export async function inquireApps(params) {
  return request('/api/orderApplication/getApplicationInOrder', {
    method: 'post',
    body: params,
  });
}

// 请求门店列表
export async function inquireShops(params) {
  return request('/api/orderApplication/getOrderStores', {
    method: 'post',
    body: params,
  });
}

// 验证通过
export async function verify(params) {
  return request('/api/orderApplication/verifyOrderApplication', {
    method: 'post',
    body: params,
  });
}

// 验证不通过
export async function reject(params) {
  return request('/api/orderApplication/refuseOrderApplication', {
    method: 'post',
    body: params,
  });
}

// 审核通过供应链应用发送消息
export async function passScmMsg(params) {
  return request('/api/organization/sendInitMessage', {
    method: 'post',
    body: params,
  });
}
