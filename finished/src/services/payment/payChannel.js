/**
 * Create by liukang on 2018/03/06
 * */
import request from '../../utils/request';
import { api } from '../../utils/config';

const path = api.payment.payChannel;

// 获取列表
export async function inquire(params) {
  return request(`${path}/channel/setting/page`, {
    method: 'get',
    params,
  });
}

// 启用停用
export async function enable(params) {
  return request(`${path}/channel/setting/enable`, {
    method: 'put',
    body: JSON.stringify(params),
  });
}

// 编辑
export async function update(params) {
  return request(`${path}/channel/setting`, {
    method: 'put',
    body: JSON.stringify(params),
  });
}

// 获取聚合服务商列表
export async function inquireAggregators(params) {
  return request(`${path}/channel/${params.code}/aggregators`, {
    method: 'get',
  });
}

// 获取ISV列表
export async function inquireIsv() {
  return request(`${path}/isv`, {
    method: 'get',
  });
}

