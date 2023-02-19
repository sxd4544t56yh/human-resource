<template>
  <el-dialog
    title="分配权限"
    :visible.sync="dialogShow"
  >
    <!-- 填入树形控件 check-strictly为true表示父子不关联 -->
    <el-tree
      ref="tree"
      :check-strictly="true"
      :data="allAuth"
      :props="{label:'name'}"
      node-key="id"
      :default-checked-keys="defaultCheck"
      show-checkbox
    />

    <span />
    <el-row type="flex" justify="center">
      <el-button @click="dialogShow = false">取消</el-button>
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </el-row>
  </el-dialog>

</template>

<script>
// 获取权限
import { getPermissionList } from '@/api/permission'
import { getRoleDetail, setRoleAuth } from '@/api/settings'
import { deepcopy } from '@/utils'
export default {
  name: 'SetAuth',
  components: {

  },
  data() {
    return {
      dialogShow: false,
      allAuth: [], // 权限
      defaultCheck: [], // 选中的节点
      roleId: '' // 角色id
    }
  },
  computed: {

  },
  methods: {
    // 获取所有的权限
    async getAllAuth() {
      const res = await getPermissionList()
      this.allAuth = deepcopy(res, '0')
    },
    // 读取器当时角色的信息
    async getRoleInfo(id) {
      this.roleId = id
      const res = await getRoleDetail(id)
      this.defaultCheck = res.permIds
    },
    // 修改提交
    async onSubmit() {
      // 角色id选中权限的id
      const permIds = this.$refs.tree.getCheckedKeys()
      // 发送请求
      await setRoleAuth({
        id: this.roleId,
        permIds
      })
      // 提示成功
      this.$message.success('关联成功')
      // 关闭
      this.dialogShow = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
