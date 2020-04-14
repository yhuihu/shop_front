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
            <pan-thumb :image="form.icon"/>
            <el-button type="primary" icon="upload" style="position: absolute;bottom: 15px;margin-left: 40px;"
                       @click="toggleShow">
              上传头像
            </el-button>
            <el-button type="primary" icon="upload" style="position: absolute;bottom: 15px;margin-left: 150px;"
                       @click="passwordToggleShow">
              修改密码
            </el-button>
            <el-dialog
              title="修改密码"
              :visible.sync="passwordDialogShow"
              width="30%"
              center>
              <el-form label-width="100px" :model="passwordForm">
                <el-form-item label="原密码">
                  <el-input v-model="passwordForm.beforePassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" style="margin-top: 20px;">
                  <el-input v-model="passwordForm.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" style="margin-top: 20px;">
                  <el-input v-model="passwordForm.newPassword1"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button v-loading="changePasswordLoading" type="primary" @click="changePassword">确 定</el-button>
             </span>
            </el-dialog>
            <el-dialog
              title="修改头像"
              :visible.sync="show"
              width="700px">
              <icon-upload ref="child" :Options="cropperOption" :Name="cropperName"
                           @uploadImgSuccess="handleUploadSuccess"></icon-upload>
            </el-dialog>
          </el-form-item>
          <el-form-item label="账号">
            <el-input v-model="form.username" :disabled="true"/>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email" :disable="true"/>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="form.nickName"/>
          </el-form-item>
          <el-form-item label="地区">
            <el-cascader
              size="large"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.note"/>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" :disabled="true"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </y-shelf>
  </div>
</template>
<script>
import YShelf from '@/components/shelf'
import PanThumb from '@/components/PanThumb'
import { getUserDetail, updateInformation, modifyPassword, logout } from '@/api/user'
import { getCookie } from '@/utils/auth'
import iconUpload from '@/components/icon-upload'
import { provinceAndCityData, CodeToText, TextToCode } from 'element-china-area-data'
import { removeStore } from '@/utils/storage'

export default {
  data () {
    return {
      options: provinceAndCityData,
      selectedOptions: ['110000', '110100'],
      show: false,
      formLoading: true,
      passwordDialogShow: false,
      changePasswordLoading: false,
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
        address: '',
        status: ''
      },
      cropperName: 'icon',
      passwordForm: {
        beforePassword: '',
        newPassword: '',
        newPassword1: ''
      },
      cropperOption: {
        img: '',
        size: 1,
        full: false, // 新增输出原图比例截图 props名full
        outputType: 'png',
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 300,
        autoCropHeight: 300,
        fixedBox: false,
        centerBox: false,
        high: true
      }
    }
  },
  methods: {
    handleChange () {
      let loc = ''
      for (let i = 0; i < this.selectedOptions.length; i++) {
        loc += CodeToText[this.selectedOptions[i]]
      }
      this.form.address = loc
    },
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
      this.cropperOption.img = this.form.icon
    },
    passwordToggleShow () {
      this.passwordDialogShow = !this.passwordDialogShow
    },
    changePassword () {
      this.changePasswordLoading = true
      if (this.newPassword !== this.newPassword1) {
        this.$root.$message.error('两次密码不相等！')
        this.changePasswordLoading = false
        return
      }
      let params = {
        oldPassword: this.beforePassword,
        newPassword: this.newPassword
      }
      modifyPassword(params).then(res => {
        if (res.code === 20000) {
          logout().then(res => {
            this.$store.dispatch('user/logout').then(() => {
              removeStore('buyCart')
              window.location.href = '/'
            }).catch(err => {
              this.$message.error(err)
            })
          })
        }
        this.changePasswordLoading = false
      })
    },
    handleUploadSuccess (data) {
      this.show = false
      this.form.icon = data
    },
    async fetchData () {
      await getUserDetail().then(res => {
        this.form = res.data
        this.selectedOptions = []
        let target = this.form.address.split('-')
        this.selectedOptions.push(TextToCode[target[0]].code)
        this.selectedOptions.push(TextToCode[target[0]][target[1]].code)
        this.formLoading = false
      })
    },
    submitForm () {
      this.formLoading = true
      const params = {
        icon: this.form.icon,
        username: this.form.username,
        email: this.form.email,
        nickName: this.form.nickName,
        note: this.form.note,
        address: this.form.address
      }
      updateInformation(params).then(resp => {
        this.messageSuccess(resp.message)
        if (resp === 20000) {
          setTimeout(function () {
            window.location.reload()
          }, 2000)
        }
      }).catch().finally(() => {
        this.formLoading = false
      })
    }
  },
  created () {
    this.fetchData()
  },
  components: {
    YShelf,
    PanThumb,
    iconUpload
  }
}
</script>
<style lang="scss" scoped>
</style>
