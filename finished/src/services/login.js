import request from '../utils/request';

export async function enter(params) {
  return request('/api/user/login ', {
    method: 'post',
    body: params,
  });
}

export async function logout(params) {
  return request('/api/user/logout', {
    method: 'post',
    body: params,
  });
}

