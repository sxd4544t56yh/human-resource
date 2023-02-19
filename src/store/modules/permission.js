import { constantRoutes, asyncRoutes } from '@/router'
export default {
  // 开启命名空间
  namespaced: true,
  state() {
    return {
      // 静态路由+用户的动态路由
      routes: [...constantRoutes]
    }
  },
  getters: {

  },
  mutations: {
    // 设置菜单信息
    setRouters(state, data) {
      // data式用户的动态路由
      state.routes = [...constantRoutes, ...data]
    }
  },
  actions: {
    // 筛选用户动态路由的方法
    filterRoutes(context, menus) {
      // menus是服务器端返回的用户的页面权限标识
      // 1.筛选出用户动态路由
      const userAsyncRouters = []
      asyncRoutes.forEach(item => {
        // 如果路由的name在menus里面 说明有权限
        if (menus.includes(item.name)) userAsyncRouters.push(item)
      })
      // 添加通配符404
      userAsyncRouters.push({ path: '*', redirect: '/404', hidden: true })
      // 2,设置侧边栏
      context.commit('setRouters', userAsyncRouters)
      // 3.返回动态路由
      return userAsyncRouters
    }
  }
}
