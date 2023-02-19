<template>
  <el-dialog
    title="关联角色"
    :visible.sync="dialogShow"
  >
    <el-checkbox-group v-model="checkList">
      <el-checkbox
        v-for="item in allRoleList"
        :key="item.id"
        :label="item.id"
      >{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <br><br>
    <el-row type="flex" justify="center">
      <el-button type="primary" size="small" @click="onsubmit">确定</el-button>
      <el-button size="small" @click="dialogShow=false">取消</el-button>

    </el-row>
  </el-dialog>

</template>

<script>
import { getUserList } from '@/api/settings'
import { userInfoById } from '@/api/user'
import { setUserRoleApi } from '@/api/employees'
export default {
  components: {

  },
  data() {
    return {
      dialogShow: false, // 弹框控制
      allRoleList: [], // 所有角色
      checkList: [], // 选择角色
      userId: '' // 员工id
    }
  },
  computed: {

  },
  methods: {
    // 获取所有角色
    async getAllRoleList() {
      const res = await getUserList({
        page: 1,
        pagesize: 1000
      })
      // 获取所有员工
      this.allRoleList = res.rows
    },
    // 获取当前员工的角色信息
    async getUserRoleInfo(id) {
      this.userId = id
      const res = await userInfoById(id)
      this.checkList = res.roleIds || []
    },
    // 提交行为
    async onsubmit() {
      await setUserRoleApi({
        id: this.userId,
        roleIds: this.checkList
      })
      this.$message.success('操作成功')
      this.dialogShow = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
