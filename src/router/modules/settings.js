import Layout from '@/layout'

export default {
  path: '/settings',
  component: Layout,
  name: 'settings', // 用于做权限
  children: [
    { path: '', component: () => import('@/views/settings'),
    // 路由元信息
      meta: {
        title: '公司设置', // 用于左侧导航的读取
        icon: 'setting'
      }
    }
  ]
}
