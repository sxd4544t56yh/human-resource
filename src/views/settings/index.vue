<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addRole"
              >新增角色</el-button>
            </el-row>
            <el-table :data="list" border="">
              <el-table-column label="序号" type="index" width="120" />
              <el-table-column label="角色名称" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template #default="{row}">
                  <el-button size="small" type="success" @click="setAuthOpen(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <el-pagination :total="page.total" :page-size="page.pagesize" layout="prev, pager, next" @current-change="currentChange" />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="second">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 弹出层 -->
      <el-dialog :title="roleForm.id ? '编辑角色' :'新增角色'" :visible="showDialog" @close="btnCancel">
        <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click="submit">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
      <!-- 关联权限 -->
      <set-auth ref="setAuth" />
    </div>
  </div>
</template>

<script>
import { getUserList, getInfo, delRoleList, getRoleDetail, addRole, updateRole } from '@/api/settings'
import { mapGetters } from 'vuex'
import setAuth from './components/set-auth.vue'

export default {
  components: { setAuth },
  data() {
    return {
      activeName: 'first', // tab显示的那个
      list: [], // 页面显示的数据
      page: {
        page: 1, // 页数
        pagesize: 5, // 每页显示的数据
        total: 0 // 总数
      },
      formData: {}, // 获取公司的信息
      // 弹框显示变量
      showDialog: false,
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getUserList()
    this.getInfo()
  },
  methods: {
    // 获取渲染的数据
    async getUserList() {
      const { total, rows } = await getUserList(this.page)
      this.list = rows
      this.page.total = total
    },
    // 分页切换渲染数据
    currentChange(page) {
      this.page.page = page
      this.getUserList()
    },
    // 渲染公司信息
    async getInfo() {
      this.formData = await getInfo(this.companyId)
    },
    // 删除
    async  delRole(id) {
      await this.$confirm('确认删除吗')
      await delRoleList(id)
      this.$message.success('删除成功')
      this.getUserList()
    },
    // 关闭弹出
    btnCancel() {
      this.roleForm = {
        name: '',
        delRoleList: ''
      }
      this.showDialog = false
    },
    // 打开添加弹窗
    async addRole() {
      this.showDialog = true
    },
    // 打开编辑弹窗
    async editRole(id) {
      this.showDialog = true
      this.roleForm = await getRoleDetail(id)
    },
    // 调用编辑和添加的接口
    async submit() {
      await this.$refs.roleForm.validate()
      if (this.roleForm.id) {
        // 编辑
        await updateRole(this.roleForm)
      } else {
        // 添加
        await addRole(this.roleForm)
      }
      this.$message.success('操作成功')
      this.getUserList()
      this.showDialog = false
    },
    // 打开授权弹框
    async setAuthOpen(roleId) {
      // 获取所有权限
      await this.$refs.setAuth.getAllAuth()
      // 获取当前角色信息
      await this.$refs.setAuth.getRoleInfo(roleId)
      // 打开权限弹框
      this.$refs.setAuth.dialogShow = true
    }
  }
}
</script>

<style>

</style>
