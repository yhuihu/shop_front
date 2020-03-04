<template>
  <div class="tinymce-editor" v-loading="this.isLoad">
    <editor v-model="myValue"
            :init="init"
            :disabled="disabled"
            @onClick="onClick">
    </editor>
    <Upload1
      multiple
      ref="imageUpload"
      :action=this.uploadUrl
      :on-success="insertImage"
      :before-upload="beforeUpload"
      :on-error="showError"
      :data="{
        token: this.uploadToken,
        key: this.uploadKey
      }"
      style="display:none">
    </Upload1>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/fullscreen'
import { Upload } from 'iview'
import { uploadToken } from '@/api/user'
export default {
  components: {
    Editor,
    Upload1: Upload
  },
  props: {
    // 传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'advlist table lists paste preview fullscreen preview'
    },
    toolbar: {
      type: [String, Array],
      default: 'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists imageUpload media table | removeformat preview'
    }
  },
  data () {
    return {
      uploadUrl: 'http://upload-z2.qiniu.com/',
      // uploadUrl: process.env.VUE_APP_BASE_SERVER + '/upload',
      isLoad: false,
      uploadToken: '',
      uploadKey: '',
      // 初始化配置
      init: {
        browser_spellcheck: true, // 拼写检查
        paste_data_images: true, // 允许粘贴图像
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/tinymce/skins/ui/oxide',
        height: 800,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        images_upload_url: 'upload',
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        /**
         * 下面方法是为tinymce添加自定义插入图片按钮
         * 借助iview的Upload组件,将图片先上传到存储云上，再将图片的存储地址放入编辑器内容
         */
        setup: (editor) => {
          editor.ui.registry.addButton('imageUpload', {
            // text: '插入图片',
            tooltip: '插入图片',
            icon: 'image',
            onAction: () => {
              const upload = this.$refs.imageUpload
              upload.handleClick()
            }
          })
        }
      },
      myValue: this.value
    }
  },
  mounted () {
    tinymce.init({})
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick (e) {
      this.$emit('onClick', e, tinymce)
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear () {
      this.myValue = ''
    },
    insertImage (res, file) {
      // const src = res.data.path // 图片存储地址
      console.log(res)
      tinymce.execCommand('mceInsertContent', false, `<img src=${'http://cloud.yhhu.xyz/' + res.key}>`)
      this.$root.$message.success('图片上传完成')
      this.isLoad = false
    },
    async beforeUpload () {
      this.$root.$message.success('图片上传中...')
      if (!this.uploadToken) {
        await uploadToken().then(res => {
          if (res.code === 20000) {
            this.uploadToken = res.message
            let date = new Date()
            this.uploadKey = this.getuuid() + date.getDate()
          }
        })
      }
      this.isLoad = true
    },
    showError () {
      this.$root.$message.error('图片上传出现错误!')
      this.isLoad = false
    },
    getuuid () {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'

      var uuid = s.join('')
      return uuid
    }
  },
  watch: {
    value (newValue) {
      this.myValue = newValue
    },
    myValue (newValue) {
      this.$emit('input', newValue)
    }
  }
}

</script>
<style scoped>
</style>
