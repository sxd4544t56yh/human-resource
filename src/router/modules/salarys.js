import Layout from '@/layout'

export default {
  path: '/salarys',
  component: Layout,
  name: 'salarys', // 用于做权限
  children: [
    { path: '', component: () => import('@/views/salarys'),
    // 路由元信息
      meta: {
        title: '工资', // 用于左侧导航的读取
        icon: 'money'
      }
    }
  ]
}
