import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, userInfo, userInfoById } from '@/api/user'
import { resetRouter } from '@/router'
export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {}
  },
  mutations: {
    SETOKEN(state, token) {
      state.token = token
      setToken(state.token)
    },
    GETUSERINDO(state, data) {
      state.userInfo = data
    },
    // 清除token
    delToken(state) {
      state.token = null
      removeToken()
    },
    // 清除用户信息
    delUserInfo(state) {
      state.userInfo = {}
    }
  },
  actions: {
    async login({ commit }, data) {
      const res = await login(data)
      commit('SETOKEN', res)
      // 登录的时候存一个时间戳
      setTimeStamp()
    },
    async getUserInfo({ commit }) {
      const res = await userInfo()
      const res1 = await userInfoById(res.userId)
      commit('GETUSERINDO', { ...res, ...res1 })
      return res
    },
    // 退出登录方法
    logout({ commit }) {
      commit('delToken')
      commit('delUserInfo')
      // 重置侧边栏信息
      // vuex里面 A模块的action如何调用b模块的muations方法
      // 这样调用 自己user模块下的 permission子模块里面的setRoutes
      // root:true标识从根模块开始往下寻找
      commit('permission/setRouters', [], { root: true })
      // 重置路由实例
      resetRouter()
    }
  }
}
