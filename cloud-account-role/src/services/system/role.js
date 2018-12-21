import request from '../../utils/request';

// 请求员工信息
export async function queryRole(params) {
  return request('/api/role/queryPosts', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
// 启用停用员工信息
export async function updateStatus(params) {
  return request('/api/role/changeStatus', {
    method: 'post',
    body: params,
  });
}
// 删除员工信息
export async function removeRole(params) {
  return request('/api/role/deletePost', {
    method: 'post',
    body: params,
  });
}

// 新增编辑
export async function createRole(params) {
  return request('/api/role/savePost', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
// 查看员工信息
export async function updateRole(params) {
  return request('/api/user/queryUserById', {
    method: 'post',
    body: params,
  });
}
// 查看岗位
export async function queryPostList() {
  return request('/api/role/queryLowPost', {
    method: 'post',
  });
}
