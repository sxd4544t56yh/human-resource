import Vue from 'vue'

/*
注意:文件以相对路径或使用@符合的方式引用 说明是src目录下
如果使用模块名来引入 属于第三方的模块
*/
console.log(process.env.VUE_APP_BASE_API)
import 'normalize.css/normalize.css' // 对css做统一的重置

import ElementUI from 'element-ui' // 导入ElementUI
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // 权限控制
// 引入全局插件
import plugins from '@/plugins'
Vue.use(plugins)
// 全局混入
import Index from '@/mixin'
Vue.mixin(Index)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// 模拟开发请求 可以在开发期间 接口没有好的情况下 可以使用mock方式模拟接口测试
/* if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
} */

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
