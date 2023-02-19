import request from '@/utils/request'

// 获取部门列表
export const getDepartmentList = () => request({
  url: '/company/department'
})

// 新增部门
export const addDepartment = data => request({
  url: '/company/department',
  method: 'POST',
  data
})

// 修改部门
export const updateDepartment = data => request({
  url: `/company/department/${data.id}`,
  method: 'PUT',
  data
})

// 删除部门
export const delDepartmentList = id => request({
  url: `/company/department/${id}`,
  method: 'DELETE'
})

// 获取部门详情
export const getDepartmentDetail = id => request({
  url: `/company/department/${id}`
})
