import request from '@/utils/request'
// 登录
export function login(data) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/sys/login', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'post',
    data
  })
}
// 获取用户的基本信息
export const userInfo = () => {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
// 获取员工列表
export const userInfoById = id => {
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}
/** *
 *  封装一个导入员工的接口
 *
 * ***/

export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}
