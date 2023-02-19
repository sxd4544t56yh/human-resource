import Layout from '@/layout'

export default {
  path: '/socials',
  component: Layout,
  name: 'social_securitys', // 用于做权限
  children: [
    { path: '', component: () => import('@/views/socials'),
    // 路由元信息
      meta: {
        title: '社保', // 用于左侧导航的读取
        icon: 'table'
      }
    }
  ]
}
