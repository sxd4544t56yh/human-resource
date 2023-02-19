<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ total }}条记录</span>
        <template #after>
          <el-button :disabled="!checkPermission('employees-export')" size="small" type="danger">简单表头导出</el-button>
          <el-button :disabled="!checkPermission('employees-export')" size="small" type="info">复杂表头导出</el-button>
          <el-button :disabled="!checkPermission('employees-import')" size="small" type="success" @click="$router.push('/import?type=user')">导入Excel</el-button>
          <el-button :disabled="!checkPermission('employees-add')" size="small" type="primary" @click="addUser">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" sortable="">
            <template #default="{row}">
              <img v-imgerror="require('@/assets/common/bigUserHeader.png')" :src="row.staffPhoto" alt="" @click="showQrCode(row.staffPhoto)">
            </template>
          </el-table-column>
          <el-table-column label="手机号" sortable="" prop="mobile" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" :formatter="formatter" sortable="" prop="formOfEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="correctionTime" />
          <el-table-column label="账户状态" sortable="">
            <!-- 开关的使用 -->
            <template #default="{row}">
              <el-switch :value="row.enableState === '1'" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template #default="{row}">
              <el-button :disabled="!checkPermission('employees-see')" type="text" size="small" @click="$router.push(`/employees/detail/${ row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="openSetRole(row.id)">角色</el-button>
              <el-button :disabled="!checkPermission('employees-del')" type="text" size="small" @click="delemployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            :page-size="page.size"
            :current-page="page.page"
            :total="total"
            layout="prev, pager, next"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
      <!-- 弹出框 -->
      <AddEmployee ref="addUsers" />
      <!-- 二维码 -->
      <el-dialog title="二维码" :visible.sync="showCodeDialog" @close="imgUrl=''">
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>
      <!-- 关联角色 -->
      <set-role ref="setRole" />
    </div>
  </div>
</template>

<script>
/*
员工关联弹框
1.绑定点击 出现弹框
2 弹框里面显示所有角色
3.当前员工的角色回显
4 提交员工修改的角色
*/
import { delEmployeeList, getEmployeeList } from '@/api/employee'
import employeeEnmu from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import setRole from './components/set-role.vue'
// 引入弹框
import QRCode from 'qrcode'

export default {
  components: {
    AddEmployee, setRole
  },
  data() {
    return {
      page: {
        page: 1, // 当前页码
        size: 5
      },
      total: 0, // 总共数
      list: [], // 存储数据
      showCodeDialog: false, // 二维码查看弹框显示控制变量
      imgUrl: '' // 预览头像地址
    }
  },
  created() {
    this.getEmployee()
  },
  methods: {
    addUser() {
      this.$refs.addUsers.showDialog = true
    },
    // 获取用户的信息
    async getEmployee() {
      const res = await getEmployeeList(this.page)
      this.list = res.rows
      this.total = res.total
    },
    // 获取多页的数据
    changePage(page) {
      this.page.page = page
      this.getEmployee()
    },
    // 格式化聘用信息
    formatter(row, column, cellValue, index) {
      const { hireType } = employeeEnmu
      const obj = hireType.find(item => item.id === Number(cellValue))
      return obj ? obj.value : '未知'
    },
    // 删除
    async  delemployee(id) {
      await delEmployeeList(id)
      if (this.list.length === 1 && this.page.page > 1) {
        this.page.page--
      }
      this.$message.success('删除成功')
      this.getEmployee()
    },
    // 二维码
    showQrCode(url) {
      // url存在的情况下 才弹出层
      if (url) {
        this.showCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QRCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    // 打开角色弹框
    async openSetRole(userId) {
      // 打开弹框的时候渲染
      await this.$refs.setRole.getAllRoleList()
      // 获取员工的角色信息
      await this.$refs.setRole.getUserRoleInfo(userId)
      // 弹框打开
      this.$refs.setRole.dialogShow = true
    }
  }
}
</script>

<style>
  img {
    width: 100px;
    height: 100px;
  }
</style>
