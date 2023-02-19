import request from '@/utils/request'

// 获取权限列表
export const getPermissionList = () => request({
  url: '/sys/permission'
})

// 新增权限
export const addPermission = data => request({
  url: '/sys/permission',
  method: 'POST',
  data
})

// 修改权限
export const updatePermission = data => request({
  url: `/sys/permission/${data.id}`,
  method: 'PUT',
  data
})

// 删除权限
export const delPermissionList = id => request({
  url: `/sys/permission/${id}`,
  method: 'DELETE'
})

// 获取权限详情
export const getPermissionDetail = id => request({
  url: `/sys/permission/${id}`
})
