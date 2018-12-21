import request from '../utils/request';

// 获取商户列表
export async function inquire(params) {
  return request('/api/tenant/queryTenants', {
    method: 'post',
    body: params,
  });
}

// 获取商户详细信息
export async function inquireDetail(params) {
  return request('/api/tenant/getInformation', {
    method: 'post',
    body: params,
  });
}

// 更新
export async function update(params) {
  return request('/api/tenant/saveTenant', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 删除
export async function remove(params) {
  return request('/api/tenant/deleteTenant', {
    method: 'post',
    body: params,
  });
}

// 启用停用
export async function enable(params) {
  return request('/api/tenant/changeStatus', {
    method: 'post',
    body: params,
  });
}
// 更新Jar包
export async function updateJar(params) {
  return request('/api/tenant/resetjar', {
    method: 'post',
    body: params,
  });
}

