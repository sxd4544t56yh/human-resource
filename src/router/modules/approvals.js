import Layout from '@/layout'

export default {
  path: '/approvals',
  component: Layout,
  name: 'approvals', // 用于做权限
  children: [
    { path: '', component: () => import('@/views/approvals'),
    // 路由元信息
      meta: {
        title: '审批', // 用于左侧导航的读取
        icon: 'tree-table'
      }
    }
  ]
}
