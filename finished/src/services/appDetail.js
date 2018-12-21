
/**
 * Create by xiaochenghua on 2018/02/01
 * */
import request from '../utils/request';

// 根据id获取应用列表
export async function inquire(params) {
  return request('/api/application/selectAllApplicationList', {
    method: 'post',
    body: params,
  });
}

// 保存图文编辑
export async function update(params) {
  return request('/api/application/editApp', {
    method: 'post',
    body: params,
  });
}
