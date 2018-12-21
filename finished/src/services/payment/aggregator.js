/**
 * Create by liukang on 2018/03/06
 * */
import request from '../../utils/request';
import { api } from '../../utils/config';

const path = api.payment.aggregator;

// 获取列表
export async function inquire(params) {
  return request(`${path}/aggregator/list`, {
    method: 'get',
    params,
  });
}

// 编辑
export async function update(params) {
  return request(`${path}/aggregator/openup`, {
    method: 'put',
    body: JSON.stringify(params),
  });
}

// 获取渠道
export async function inquireChannel() {
  return request(`${path}/channel/setting`, {
    method: 'get',
  });
}
