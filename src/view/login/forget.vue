<template>
  <div class="login v2">
    <div class="wrapper">
      <div class="dialog dialog-shadow" style="display: block; margin-top: -362px;">
        <div class="registered">
          <h4>找回密码</h4>
          <div class="content" style="margin-top: 20px;">
            <el-form ref="forgetForm" :label-position="formPosition" :rules="rules"  label-width="80px" :model="forgetForm">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="forgetForm.email">
                  <el-button :disabled="!(emailText === '发送验证码')" slot="append" @click.prevent="getCode()">{{emailText}}</el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="code">
                <el-input v-model="forgetForm.code"/>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="forgetForm.password"/>
              </el-form-item>
              <el-form-item label="重复密码" prop="password1">
                <el-input type="password" v-model="forgetForm.password1"/>
              </el-form-item>
            </el-form>
            <div style="margin-bottom: 30px;">
              <my-button
                :classStyle="forgetForm.password&&forgetForm.password1&&
                forgetForm.email&&forgetForm.code&&forgetTxt==='重置密码'?'main-btn':'disabled-btn'"
                :text="forgetTxt"
                style="margin: 0;width: 100%;height: 48px;font-size: 18px;line-height: 48px"
                @btnClick="doReset"
              >
              </my-button>
            </div>
            <div class="border" style="margin-bottom: 10px;"></div>
            <ul class="common-form pr">
              <li style="text-align: center;line-height: 48px;margin-bottom: 0;font-size: 12px;color: #999;">
                <span>如果您已拥有账号，则可在此</span>
                <a href="javascript:;"
                   style="margin: 0 5px"
                   @click="toLogin">登陆</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MyButton from '@/components/myButton'
import { sendForgetEmail, reset } from '@/api/user'
export default {
  data () {
    return {
      formPosition: 'left',
      rules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        password1: [{ required: true, message: '请输入重复密码', trigger: 'blur' }]
      },
      forgetForm: {
        password: '',
        password1: '',
        email: '',
        code: ''
      },
      forgetTxt: '重置密码',
      emailText: '发送验证码'
    }
  },
  computed: {},
  methods: {
    open (t, m) {
      this.$notify.info({
        title: t,
        message: m
      })
    },
    messageSuccess (message) {
      this.$message({
        message: message,
        type: 'success'
      })
    },
    message (m) {
      this.$message.error({
        message: m
      })
    },
    toLogin () {
      this.$router.push({
        path: '/login'
      })
    },
    getCode () {
      // eslint-disable-next-line no-useless-escape
      let myReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if (myReg.test(this.forgetForm.email)) {
        sendForgetEmail(this.forgetForm.email).then(res => {
          if (res.code === 20000) {
            let that = this
            this.messageSuccess(res.message)
            that.emailText = 300
            let interval = setInterval(function timestampToTime () {
              if (that.emailText === 0) {
                that.emailText = '发送验证码'
                clearInterval(interval)
              } else {
                that.emailText -= 1
              }
            }, 1000)
          } else if (res.code === 20002) {
            this.message(res.message)
          } else {
            this.message('服务器出现异常，请稍后重试')
          }
        })
      } else {
        this.message('请输入正确的邮箱再获取验证码！')
      }
    },
    doReset () {
      this.forgetTxt = '重置中...'
      let password = this.forgetForm.password
      let password1 = this.forgetForm.password1
      if (!password || !password1) {
        this.message('密码不能为空!')
        this.forgetTxt = '重置密码'
        return false
      }
      if (password1 !== password) {
        this.message('两次输入的密码不相同!')
        this.forgetTxt = '重置密码'
        return false
      }
      this.$refs['forgetForm'].validate((valid) => {
        if (!valid) {
          this.message('请完善表单内容')
          return false
        }
      })
      let params = {
        password: this.forgetForm.password,
        email: this.forgetForm.email,
        code: this.forgetForm.code
      }
      reset(params).then(res => {
        if (res.code === 20000) {
          this.messageSuccess(res.message)
          this.toLogin()
        } else {
          this.message(res.message)
          return false
        }
      }).finally(this.forgetTxt = '重置密码')
    }
  },
  mounted () {
  },
  components: {
    MyButton
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  * {
    box-sizing: content-box;
  }

  .login {
    overflow-x: hidden;
    overflow-y: hidden;

    .input {
      height: 50px;
      display: flex;
      align-items: center;

      input {
        font-size: 16px;
        width: 100%;
        height: 100%;
        padding: 10px 15px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 6px;
      }
    }

    .wrapper {
      background: url(../../assets/images/bg_9b9dcb65ff.png) repeat;
      background-size: 100px;
      min-height: 800px;
      min-width: 630px;
      margin-top: 100px;
    }
  }

  .v2 .dialog {
    width: 498px;
    border: 1px solid #dadada;
    border-radius: 10px;
    top: 50%;
    left: 50%;
    margin-left: -280px;
    position: absolute;

    .title {
      background: linear-gradient(#fff, #f5f5f5);
      height: auto;
      overflow: visible;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      position: relative;
      background-image: url(../../assets/images/smartisan_4ada7fecea.png);
      background-size: 140px;
      background-position: top center;
      background-repeat: no-repeat;
      height: 92px;
      margin: 23px 0 50px;
      padding: 75px 0 0;
      box-shadow: none;

      h4 {
        padding: 0;
        text-align: center;
        color: #666;
        border-bottom: 1px solid #dcdcdc;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        font-weight: 700;
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
        margin: 0;
        padding: 0;
        border-bottom: 0;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        line-height: 1em;
        height: auto;
        color: #333;
        font-weight: 400;
      }
    }

    .content {
      padding: 0 40px 22px;
      height: auto;

      .common-form {
        li {
          clear: both;
          margin-bottom: 15px;
          position: relative;
        }
      }
    }
  }

  .dialog-shadow,
  .v2 .bbs .dialog-shadow,
  .v2 .dialog-shadow {
    -webkit-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
    -moz-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
    box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
  }

  @media screen and (min-width: 737px),
  screen and (-webkit-max-device-pixel-ratio: 1.9) and (max-width: 736px) and (min-device-width: 737px) {
    .wrapper {
      background: url(../../assets/images/con-bg_04f25dbf8e.jpg) repeat-x;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .dialog {
      background: url(../../assets/images/dialog-gray-bg.png) #fff bottom repeat-x;
      border-radius: 12px;
      display: none;
      margin: -163px 0 0 -218px;
      width: 1600px;
      position: fixed;
      left: 50%;
      top: 50%;
    }
    .dialog .title h4 {
      border-bottom: #d1d1d1 solid 1px;
      box-shadow: 0 2px 6px #d1d1d1;
      color: #666;
      font-size: 20px;
      height: 61px;
      line-height: 61px;
      padding: 0 0 0 35px;
    }
    .common-form li {
      clear: both;
      margin-bottom: 15px;
      position: relative;
    }
    .auto-login {
      position: absolute;
      top: 0px;
      left: 2px;
      color: #999;
    }
    .register {
      padding: 1px 10px 0;
      border-right: 1px solid #ccc;
    }
    .border {
      margin-top: 10px;
      border-bottom: 1px solid #ccc;
    }
    .other {
      margin: 20px 5px 0 0;
      width: auto;
      color: #bbb;
      font-size: 12px;
      cursor: default;
      color: #999;
    }
    .footer {
      display: flex;
      flex-direction: row;
    }
    .agree {
      margin-bottom: 30px;
      color: #999;
    }
  }

  .registered {
    h4 {
      padding: 0;
      text-align: center;
      color: #666;
      border-bottom: 1px solid #dcdcdc;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      font-weight: 700;
      font-size: 20px;
      height: 60px;
      line-height: 60px;
    }
  }

  #wait {
    text-align: left;
    color: #999;
    margin: 0;
  }
</style>
