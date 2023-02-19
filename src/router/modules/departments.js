import Layout from '@/layout'

export default {
  path: '/departments',
  component: Layout,
  name: 'departments', // 用于做权限
  children: [
    { path: '', component: () => import('@/views/departments'),
    // 路由元信息
      meta: {
        title: '组织架构', // 用于左侧导航的读取
        icon: 'tree'
      }
    }
  ]
}
