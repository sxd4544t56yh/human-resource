<template>
  <div class="dashboard-container">
    <el-card class="tree-card">
      <!-- 头部 -->
      <treeTools :tree-node="company" :is-root="true" @add="add" />

      <el-tree :data="departs" :props="defaultProps">
        <!-- tree -->
        <treeTools slot-scope="{data}" :tree-node="data" @edit="edit" @add="add" @del="getDepartment" />
      </el-tree>
      <!-- 弹出框 -->
      <addDepts ref="addDept" :visible.sync="visible" :tree-node="node" @add="getDepartment" />
    </el-card>
  </div>
</template>

<script>
import { getDepartmentList } from '@/api/department'
import { deepcopy } from '@/utils'
import treeTools from './components/tree.tool.vue'
import addDepts from './components/add-depts.vue'
export default {
  components: {
    treeTools,
    addDepts
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      visible: false, // 控制弹出层的显示和隐藏
      node: {} // 用来存储数据
    }
  },
  created() {
    // 获取数据
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const res = await getDepartmentList()
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = deepcopy(res.depts, '')
    },
    // 打开弹框 把数据记录下来
    add(node) {
      this.visible = true
      this.node = node
    },
    edit(node) {
      this.visible = true
      this.node = node
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 30px 50px;
  font-size:14px;
}
</style>
