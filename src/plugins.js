import * as directives from '@/directive'
import PageTools from '@/components/PageTools'
import ImageUpload from '@/components/ImageUpload'
import Print from 'vue-print-nb'
import { parseTime } from '@/utils'
import UploadExcel from '@/components/UploadExcel'
export default {
  install(Vue) {
    // 全局注册的组件
    Vue.component('PageTools', PageTools)
    Vue.component('ImageUpload', ImageUpload)
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Object.keys(directives).forEach(key => {
      Vue.directive(key, directives[key])
    })
    // 定义一个全局的过滤器
    Vue.filter('formatDate', function(time) {
      return parseTime(time)
    })
    Vue.use(Print)
  }
}
