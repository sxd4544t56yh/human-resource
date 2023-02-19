<template>
  <div>
    <!-- action是默认上传的地址 -->
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :http-request="handleUpload"
      :file-list="fileList"
      :limit="1"
      :class="{disabled:fileList.length>0}"
      :on-change="changeFile"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
/**
 * 图片上传组件基本需求：
 * 1.能够上传图片，得到图片的在线的地址
 * 2.能够回显图片
 * 3.上传成功后能够自动将图片地址同步出去
 */
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDznNjrkOmvpVv62i9LI2XnnY4LN9gy1pO', // 身份识别 ID
  SecretKey: 'NWQ5UeYCblgLlwwhDUVv61h8KGxPcbLq' // 身份密钥
})
export default {
  props: {
    // 接收v-model绑定进来的数据
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [], // 帮助我们回显图片
      isUpload: false // 上传状态
    }
  },
  watch: {
    // 监听v-model绑定的数据的变化
    value: {
      immediate: true,
      handler(value) {
        // 判断：如果value存在,手动回显一下图片
        // 只有在首次使用组件通过v-model同步数据的时候才需要设置回显
        if (value && !this.isUpload) {
          // 如果有值就会显
          this.fileList = [
            {
              name: '',
              url: value
            }
          ]
        }
      }
    }
  },
  methods: {
    // 上传之前对文件校验
    beforeUpload(file) {
      // console.log(file)
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      return true
    },

    // 监听图片选择变化
    changeFile(file, fileList) {
      this.fileList = [...fileList]
    },

    // 取消自动上传，手动处理上传逻辑
    handleUpload(params) {
      // 采用第三方的腾讯云:实际工作中上传到自己的服务器:
      /**
       * let fd = new FormData('文件片段',文件信息)
       * let res = await axios({
       *   url:"上传接口地址",
       *   method:"post",
       *   data:id
       * })
       * console.log(res)
       */

      cos.putObject({
        Bucket: 'hmchuige-1302099167', // 存储桶
        Region: 'ap-nanjing', // 地域
        Key: params.file.name, // 文件名
        Body: params.file, // 要上传的文件对象
        StorageClass: 'STANDARD' // 上传的模式类型 直接默认 标准模式即可
      }, (err, data) => {
        // data返回数据之后，应该如何处理
        console.log(err || data)
        if (data && data.Location) {
          this.isUpload = true
          // 将图片地址同步出去
          this.$emit('input', 'http://' + data.Location)
        }
      })
    },

    // 处理删除逻辑
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.fileList = [...fileList]
      if (fileList.length === 0) {
        this.$emit('input', '')
      }
    },
    // 处理预览逻辑
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card{
  display: none;
}

</style>
