import Layout from '@/layout'

export default {
  path: '/employees',
  component: Layout,
  name: 'employees', // 用于做权限
  children: [
    { path: '', component: () => import('@/views/employees'),
    // 路由元信息
      meta: {
        title: '员工', // 用于左侧导航的读取
        icon: 'people'
      }
    },
    {
      path: 'detail/:id', // query传参 动态路由传参
      component: () => import('@/views/employees/detail'),
      hidden: true, // 不在左侧菜单显示
      meta: {
        title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      }
    },
    {
      path: 'print/:id', // 二级默认路由
      component: () => import('@/views/employees/print'), // 按需加载
      hidden: true,
      meta: {
        title: '打印', // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
        icon: 'people'
      }
    }
  ]
}
