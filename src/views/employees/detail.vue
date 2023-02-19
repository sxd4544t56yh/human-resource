<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">

            <!-- 放置表单 -->
            <el-form ref="userForm" :model="userInfo" label-width="120px" :rules="rules" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:">
                <el-input v-model="userInfo.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 放置个人详情组件 -->
            <!-- <user-info /> -->
            <UserInfo />
          </el-tab-pane>

          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 放置岗位详情 -->
            <JobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
// 加载用户信息的接口
import { userInfoById } from '@/api/user'
// 保存用户信息
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info' // 导入
import JobInfo from './components/job-info' // 导入
export default {
  components: {
    UserInfo, // 注册
    JobInfo
  },
  data() {
    return {
      userId: this.$route.params.id, // 这样可以后面直接通过 this.userId进行获取数据
      userInfo: {
        //   专门存放基本信息
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  computed: {

  },
  created() {
    this.userInfoById()
  },
  methods: {
    // 回显用户信息
    async userInfoById() {
      this.userInfo = await userInfoById(this.userId)
    },
    // 验证表单
    async saveUser() {
      await this.$refs.userForm.validate()
      await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
      this.$message.success('保存成功')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
