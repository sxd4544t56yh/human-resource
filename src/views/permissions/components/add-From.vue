<template>
  <el-dialog :title="formDate.id ? '修改权限' :'添加权限'" :visible.sync="dialogShow" @close="handelClose">
    <el-form ref="form" :model="formDate" :rules="rules" label-width="80px" :inline="false" size="normal">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formDate.name" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formDate.code" />
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="formDate.description" />
      </el-form-item>
      <el-form-item label="开启">
        <el-switch v-model="formDate.enVisible" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="onSubmit">提交</el-button>
        <el-button size="small" @click="dialogShow = false">取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>
import { addPermission, updatePermission } from '@/api/permission'
export default {
  name: 'AddFrom',
  components: {

  },
  data() {
    return {
      // 弹框控制
      dialogShow: false,
      // 表单
      formDate: {
        name: '',
        code: '',
        description: '',
        type: '', // 按照权限 1 菜单 2按钮
        pid: '', // 上级的id 顶级是0
        enVisible: ''
      },
      // 表单验证
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        code: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  computed: {

  },
  methods: {
    async onSubmit() {
      // 表单校验
      await this.$refs.form.validate()
      // 请求的发送
      if (this.formDate.id) {
        // 编辑
        await updatePermission(this.formDate)
        this.$message.success('编辑成功')
      } else {
        // 数据的发送
        await addPermission(this.formDate)
        // 提示成功
        this.$message.success('添加成功')
      }
      // 列表更新
      this.$emit('updateList')
      // 关闭
      this.dialogShow = false
    },
    handelClose() {
      this.formDate = {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: ''
      }
      // 移除校验
      this.$refs.form.clearValidate()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
