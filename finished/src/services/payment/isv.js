/**
 * Create by liukang on 2018/03/06
 * */
import request from '../../utils/request';
import { api } from '../../utils/config';

const path = api.payment.isv;

// 获取列表
export async function inquire(params) {
  return request(`${path}/isv/page`, {
    method: 'get',
    params,
  });
}

// 编辑
export async function update(params) {
  return request(`${path}/isv`, {
    method: 'put',
    body: JSON.stringify(params),
  });
}

// 新增
export async function create(params) {
  return request(`${path}/isv`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 删除
export async function remove(params) {
  return request(`${path}/isv/batch`, {
    method: 'delete',
    body: JSON.stringify(params),
  });
}
