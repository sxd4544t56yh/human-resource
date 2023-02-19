import Layout from '@/layout'

export default {
  path: '/attendances',
  component: Layout,
  name: 'attendances', // 用于做权限
  children: [
    { path: '', component: () => import('@/views/attendances'),
    // 路由元信息
      meta: {
        title: '考勤', // 用于左侧导航的读取
        icon: 'skill'
      }
    }
  ]
}
