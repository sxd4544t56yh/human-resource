import request from '@/utils/request'
// 获取员工列表
export const getEmployeeList = params => request({
  url: '/sys/user',
  params
})
// 删除员工列表
export const delEmployeeList = id => request({
  url: `/sys/user/${id}`,
  method: 'delete'
})
// 添加员工列表
export const addEmployeeList = data => request({
  url: '/sys/user',
  method: 'post',
  data
})
