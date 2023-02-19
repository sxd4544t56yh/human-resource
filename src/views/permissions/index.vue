<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 搜索区域 -->
      <!-- 操作区域 -->
      <page-tools>
        <template #after>
          <el-button type="primary" size="small" @click="addPerm(1,'0')">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格区域 -->
      <el-table row-key="id" :data="list" border stripe>
        <el-table-column
          v-for="(col,index) in columns"
          :key="index"
          :prop="col.prop"
          :label="col.label"
        >
          <template slot-scope="{row}">
            <el-tag v-if="col.prop === 'code'">{{ row[col.prop] }}</el-tag>
            <span v-else>{{ row[col.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button v-if="row.type === 1" type="text" @click="addPerm(2,row.id)">添加</el-button>
            <el-button type="text" @click="editPerm(row.id)">编辑</el-button>
            <el-button type="text" @click="delPerm(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <!-- 弹框 -->
      <addFrom ref="addForm" @updateList="initData" />
    </div>
  </div>
</template>

<script>
import { getPermissionList, getPermissionDetail, delPermissionList } from '@/api/permission'
import { deepcopy } from '@/utils'
import addFrom from './components/add-From.vue'
export default {
  name: 'Permission',
  components: {
    addFrom
  },
  data() {
    return {
      // 表格数据
      list: [],
      // 列数
      columns: [
        { label: '名称', prop: 'name' },
        { label: '标识', prop: 'code' },
        { label: '描述', prop: 'description' }
      ]
    }
  },
  created() {
    this.initData()
  },
  methods: {
    // 获取表格数据
    async initData() {
      const res = await getPermissionList()
      this.list = deepcopy(res, '0')
    },
    // 添加权限
    addPerm(type, pid) {
      this.$refs.addForm.formDate.type = type
      this.$refs.addForm.formDate.pid = pid
      this.$refs.addForm.dialogShow = true
    },
    // 编辑权限
    async editPerm(id) {
      const res = await getPermissionDetail(id)
      this.$refs.addForm.formDate = res
      this.$refs.addForm.dialogShow = true
    },
    // 删除
    async delPerm(id) {
      await confirm('确定删除吗')
      await delPermissionList(id)
      this.$message.success('删除成功')
      this.initData()
    }
  }
}
</script>

<style>

</style>
