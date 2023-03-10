// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面
// 路由的前置守卫
router.beforeEach(async function(to, from, next) {
  NProgress.start() // 开启进度条
  const { token, userId } = store.getters
  //  首先判断有无token
  if (token) {
    // 用户登录后 页面跳转之前 判断用户信息
    // 如果没有用户信息需要等用户信息获取到在跳转到内页
    if (!userId) {
      const { roles } = await store.dispatch('user/getUserInfo')
      const userRoutes = await store.dispatch('permission/filterRoutes', roles.menus)
      // 添加用户动态路由去实例中去
      router.addRoutes(userRoutes)
      // router.addRoutes 执行完毕后在执行一次next(to.path)
      // 再走一次路由 保证动态路由实例已经配置好了
      next(to.path)
    }
    //   如果有token 继续判断是不是去登录页
    if (to.path === '/login') {
      //  表示去的是登录页
      next('/') // 跳到主页
    } else {
      next() // 直接放行
    }
  } else {
    // 如果没有token
    if (whiteList.includes(to.path)) {
      // 如果找到了 表示在在名单里面
      next()
    } else {
      next('/login') // 跳到登录页
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置守卫
router.afterEach(function() {
  NProgress.done() // 关闭进度条
})

