// 混入 提供一个抽离相同功能的语法
import store from '@/store'
export default {
  methods: {
    // 校验按钮权限的方法
    checkPermission(btnMark) {
      const { token, userInfo } = store.state.user
      if (!token) return false // 返回false表示没有按钮权限
      const points = userInfo.roles.points // 用户的按钮权限
      return points.includes(btnMark)
    }
  }
}
