import request from '../utils/request';

/**
 * Create by xiaochenghua on 2018/02/01
 * */

// 获取应用列表
export async function inquire(params) {
  return request('/api/application/getAppList', {
    method: 'post',
    body: params,
  });
}

// 新增/编辑应用
export async function create(params) {
  return request('/api/application/operateApp', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 应用删除
export async function remove(params) {
  return request('/api/application/deleteApps', {
    method: 'post',
    body: params,
  });
}


// 启用停用
export async function enable(params) {
  return request('/api/application/changeAppStatus', {
    method: 'post',
    body: params,
  });
}

// 创建应用关系
export async function createAppRelation(params) {
  return request('/api/application/connectApps', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 获取应用关系
export async function inquireAppRelation(params) {
  return request('/api/application/getConnectApps', {
    method: 'post',
    body: params,
  });
}
