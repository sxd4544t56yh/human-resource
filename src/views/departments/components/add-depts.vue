<template>
  <!-- 新增部门的弹层 -->
  <el-dialog title="新增部门" :before-close="handleClose" :visible.sync="visible">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getUsers">
          <el-option
            v-for="item in people"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { addDepartment, getDepartmentList, getDepartmentDetail, updateDepartment } from '@/api/department'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      required: true
    }
  },
  data() {
    var validateName = async(rule, values, callback) => {
      // 获取所有部门的信息
      const { depts } = await getDepartmentList()
      // 这边我们需要判断同部门的不能有叫张三的
      let arr = false
      if (this.formData.id) {
        arr = depts.filter(item => item.id !== this.formData.id && item.pid === this.formData.pid).some(item => item.name === values)
      } else {
        // 获取到当前父部门的子部门不允许重复
        arr = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === values)
      }
      arr ? callback(new Error(`已经有个${values}部门`)) : callback()
    }
    var validateCode = async(rule, values, callback) => {
      const { depts } = await getDepartmentList()
      let arr = false
      if (this.formData.id) {
        arr = depts.some(item => item.id !== this.formData.id && item.code === values)
      } else {
        arr = depts.some(item => item.code === values)
      }
      arr ? callback(new Error(`组织架构中已经有部门使用${values}编码`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' }

        ],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }
        ]
      },
      people: []// 获取员工的简单列表
    }
  },
  methods: {
    handleClose() {
      // 关闭弹窗
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    },
    async getUsers() {
      this.people = await getEmployeeSimple()
    },
    async submit() {
      await this.$refs.form.validate()
      if (this.formData.id) {
        await updateDepartment(this.formData)
        this.$message.success('编辑部门成功')
      } else {
        await addDepartment({ ...this.formData, pid: this.treeNode.id })
        this.$message.success('新增部门成功')
      }
      this.$emit('add')
      this.handleClose()
    },
    async  getDepartDetail(id) {
      // 请求来的数据回显给表单
      this.formData = await getDepartmentDetail(id)
    }
  }
}
</script>
