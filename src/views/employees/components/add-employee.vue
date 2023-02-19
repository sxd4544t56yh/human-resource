<template>
  <el-dialog
    title="新增员工"
    :visible="showDialog"
    :before-close="handleClose"
  >
    <!-- 表单 -->
    <el-form ref="addEmployee" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="item in employeeEnmu.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="selectDept" />
        <el-tree v-if="treeShow" :data="treeData" :props="{label:'name'}" @node-click="handleNodeClick" />
      </el-form-item>
      <el-form-item v-model="formData.correctionTime" label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="handleClose">取消</el-button>
          <el-button type="primary" size="small" @click="submit">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartmentList } from '@/api/department'
import { addEmployeeList } from '@/api/employee'
import employeeEnmu from '@/api/constant/employees'
import { deepcopy } from '@/utils'
export default {
  data() {
    return {
      // 枚举属性
      employeeEnmu,
      // data里面定义
      showDialog: false, // 弹出层显示控制变量
      // 用来收集表单的添加数据
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      // 表单验证
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      treeData: [], // 树形控件数据
      treeShow: false // 控制树形的显示
    }
  },
  methods: {
    // 添加数据
    async submit() {
      await this.$refs.addEmployee.validate()
      await addEmployeeList(this.formData)
      this.$message.success('添加成功')
      this.handleClose()
      this.$parent.getEmployee()
    },
    // 点击节点
    handleNodeClick(node) {
      // 控制回显
      this.formData.departmentName = node.name
      // 关闭树形
      this.treeShow = false
    },
    // 让树形控件回显
    async selectDept() {
      const { depts } = await getDepartmentList()
      this.treeShow = true
      this.treeData = deepcopy(depts, '')
    },
    // 清空表单
    handleClose() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.showDialog = false
    }
  }
}
</script>

<style>

</style>
