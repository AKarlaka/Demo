import request from '../utils/request';

// 请求机构信息
export async function queryOrg(params) {
  return request('/api/org/getAll', {
    method: 'post',
    body: params,
  });
}

export async function inquireProvince() {
  return request('/api/areas/getProvinceList', {
    method: 'post',
  });
}
export async function inquireAreaById(params) {
  return request('/api/areas/getAreaListByParentId', {
    method: 'post',
    body: params,
  });
}
export async function findBasSysAreaById(params) {
  return request('/api/areas/findBasSysAreaById', {
    method: 'post',
    body: params,
  });
}
