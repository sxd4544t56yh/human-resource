import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from './auth'
// 设置token过期的时间
const timeout = 10000000000000000 // 设置token过期的时间
function checkTimeOut() {
  // 获取登录的时间戳
  const tokenTime = getTimeStamp()
  // 拿当前戳减去登录的时间戳
  const time = ((Date.now() - tokenTime) / 1000)
  // 如果相减的时间戳大于自己设置的时间戳 让它过期
  return time - timeout > 0
}
// create an axios instance
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
  // baseURL: '/prod-api',
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
})

// 添加请求拦截器
request.interceptors.request.use(function(config) {
  const { token } = store.getters
  if (token) {
    if (checkTimeOut()) {
      // token过期的话
      // 清除token和用户信息
      store.dispatch('user/logout')
      // 2.跳转到登录
      router.push('/login')
      // 3.提示用户
      return Promise.reject(new Error('token过期了'))
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function(error) {
  return Promise.reject(error)
})
// 添加响应拦截器
request.interceptors.response.use(function(response) {
  // 对响应进行处理
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error('请求失败'))
  }
}, function(error) {
  console.dir(error)
  // token过期处理
  if (error.response && error.response.data) {
    if (error.response.data.code === 10002) {
    // 1.调用actions中logout清除token和用户信息
      store.dispatch('user/logout')
      // 2.跳转到登录
      router.push('/login')
      // 3.提示用户
      Message.error(error.response.data.message)
    }
  }
  return Promise.reject(error)
})
export default request
