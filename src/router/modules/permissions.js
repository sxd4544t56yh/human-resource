import Layout from '@/layout'

export default {
  path: '/permissions',
  component: Layout,
  name: 'permissions', // 用于做权限
  children: [
    { path: '', component: () => import('@/views/permissions'),
    // 路由元信息
      meta: {
        title: '权限管理', // 用于左侧导航的读取
        icon: 'lock'
      }
    }
  ]
}
