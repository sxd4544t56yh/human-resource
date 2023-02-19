import request from '@/utils/request'
// 获取公司列表
export const getUserList = params => request({
  url: '/sys/role',
  params
})
// 获取详情
export const getInfo = companyId => request({
  url: `/company/${companyId}`
})
// 删除公司列表
export const delRoleList = (id) => request({
  url: `/sys/role/${id}`,
  method: 'delete'
})

/** *
 * 修改角色
 * ***/
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}
/**
 * 获取角色详情
 * **/
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}
// 新增角色详情
export const addRole = data => request({
  url: '/sys/role',
  method: 'POST',
  data
})
// 设置权限
export const setRoleAuth = data => request({
  url: '/sys/role/assignPrem',
  method: 'put',
  data
})
