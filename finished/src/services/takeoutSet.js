
/**
 * Create by xiaochenghua on 2018/03/10
 * */
import request from '../utils/request';

export async function inquire() {
  return request('/apiTakeout/platformConfig/query', {
    method: 'post',
  });
}

export async function inquireCondition(params) {
  return request('/apiTakeout/platformConfig/conditionQuery', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function update(params) {
  return request('/apiTakeout/platformConfig/update', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function create(params) {
  return request('/apiTakeout/platformConfig/add', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function remove(params) {
  return request('/apiTakeout/platformConfig/delete', {
    method: 'post',
    body: params,
  });
}

export async function inquireGroup(params) {
  return request('/api/tenant/queryTenants', {
    method: 'post',
    body: params,
  });
}
