<template>
  <div class="upload-excel">
    <div class="btn-upload">
      <el-button :loading="loading" size="mini" type="primary" @click="handleUpload">
        点击上传
      </el-button>
    </div>

    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <i class="el-icon-upload" />
      <span>将文件拖到此处</span>
    </div>
  </div>
</template>
<script>
import * as XLSX from 'xlsx'
export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      // 判断该组件在被使用的时候 是否传递了onSuccess属性 如果传了onSuccess
      // 会在读取成功hou 自动调用该方法 将读取1的结果返回出去
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      // 模拟点击文件选择
      this.$refs['excel-upload-input'].click()
    },
    // 当选择excel文件的时候
    handleClick(e) {
      // 获取文件对象
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      // 如果存在走解析逻辑
      this.upload(rawFile)
    },
    // 解析excel
    upload(rawFile) {
      // 清空文件选择框的value值 避免选择相同的文件不触发change事件
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel

      if (!this.beforeUpload) {
        // 如果使用改组件的时候 没有传beforeUpload方法进来 直接读取文件
        this.readerData(rawFile)
        return
      }
      // 如果传递了beforeUpload属性，会调用这个方法 将文件对象抛出去
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    // 读取excel文件  利用xlsx插件来截取来读取
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        // 实例化一个读取文件的对象
        const reader = new FileReader()
        reader.onload = e => {
          // 读取处理excel数据
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          // 将读取的数据返回
          this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>
 <style scoped lang="scss">
 .upload-excel {
   display: flex;
   justify-content: center;
    margin-top: 100px;
    .excel-upload-input{
        display: none;
         z-index: -9999;
      }
    .btn-upload , .drop{
       border: 1px dashed #bbb;
       width: 350px;
       height: 160px;
       text-align: center;
       line-height: 160px;
    }
    .drop{
        line-height: 80px;
        color: #bbb;
       i {
         font-size: 60px;
         display: block;
       }
    }
 }
 </style>

