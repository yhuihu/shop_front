<template>
  <div>
    <y-shelf title="账户资料">
      <div slot="content">
        <el-form
          ref="form"
          v-loading="formLoading"
          :data="form"
          element-loading-text="加载中..."
          :model="form"
          label-width="120px"
        >
          <el-input v-model="form.id" type="hidden"/>
          <el-form-item label="头像">
            <!--        <img :src="form.icon" width="60" height="60" alt="#">-->
            <pan-thumb :image="form.icon"/>
            <el-button type="primary" icon="upload" style="position: absolute;bottom: 15px;margin-left: 40px;"
                       @click="toggleShow">
              上传头像
            </el-button>
            <image-cropper
              v-model="show"
              field="multipartFile"
              :width="300"
              :height="300"
              :url="url"
              :headers="headers"
              img-format="png"
              @crop-success="cropSuccess"
              @crop-upload-success="cropUploadSuccess"
              @crop-upload-fail="cropUploadFail"
            />
          </el-form-item>
          <el-form-item label="账号">
            <el-input v-model="form.username" :disabled="true"/>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email"/>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="form.nickName"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.note"/>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" :disabled="true"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" >保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </y-shelf>
  </div>
</template>
<script>
import YShelf from '@/components/shelf'
import PanThumb from '@/components/PanThumb'
import ImageCropper from 'vue-image-crop-upload'
import { getUserDetail } from '@/api/user'
import { getCookie } from '@/utils/auth'

export default {
  data () {
    return {
      show: false,
      formLoading: true,
      url: process.env.VUE_APP_BASE_SERVER + '/upload',
      headers: {
        Authorization: 'Bearer ' + getCookie('SECOND_HAND_USER_TOKEN')
      },
      form: {
        id: '',
        icon: '',
        username: '',
        email: '',
        nickName: '',
        note: '',
        createTime: '',
        status: ''
      }
    }
  },
  methods: {
    messageSuccess (m) {
      this.$message({
        message: m,
        type: 'success'
      })
    },
    messageFail (m) {
      this.$message.error({
        message: m
      })
    },
    toggleShow () {
      this.show = !this.show
    },
    /**
     *
     * @param image
     * @param field
     */
    cropSuccess (image, field) {
      console.log('-------- crop success --------')
      // this.image = image
    },

    /**
     * 上传成功
     * @param jsonData 服务器返回数据，已进行 JSON 转码
     * @param field
     */
    cropUploadSuccess (jsonData, field) {
      console.log('-------- upload success --------')
      console.log(jsonData)
      console.log('path: ', jsonData.data.path)
      console.log('field: ' + field)
      this.form.icon = jsonData.data.path
      // 更新头像
      // modifyIcon({
      //   username: this.$store.getters.name,
      //   path: jsonData.data.path
      // }).then(response => {
      //   this.$message({
      //     message: response.message,
      //     type: 'success'
      //   })
      //
      //   // 更新 vuex 中的头像
      //   this.$store.dispatch('user/setAvatar', jsonData.data.path)
      // }).catch(() => {
      // })
    },

    /**
     * 上传失败
     * @param status 服务器返回的失败状态码
     * @param field
     */
    cropUploadFail (status, field) {
      console.log('-------- upload fail --------')
      console.log(status)
      console.log('field: ' + field)
      if (status === 401) {
        this.messageFail('请重新登录~')
      }
    },
    fetchData () {
      getUserDetail().then(res => {
        this.form = res.data
        this.formLoading = false
      })
    },
    uploadImg (e) {
      var file = e.target.files[0]
      if (file.size > 10485760) {
        this.messageFail('图片大小不得超过10Mb')
        return false
      }
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.messageFail('图片类型仅支持.gif,jpeg,jpg,png,bmp')
        return false
      }
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        this.option.img = e.target.result
      }
    }
  },
  created () {
    this.fetchData()
  },
  components: {
    YShelf,
    ImageCropper,
    PanThumb
  }
}
</script>
<style lang="scss" scoped>
</style>