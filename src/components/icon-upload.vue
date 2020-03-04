<template>
  <div class="cropper-content" v-loading="loaded">
    <div class="cropper-box">
      <div class="cropper">
<!--        <vue-cropper-->
<!--          ref="cropper"-->
<!--          :img="option.img"-->
<!--          :outputSize="option.size"-->
<!--          :outputType="option.outputType"-->
<!--          :info="true"-->
<!--          :full="option.full"-->
<!--          :canMove="option.canMove"-->
<!--          :canMoveBox="option.canMoveBox"-->
<!--          :original="option.original"-->
<!--          :autoCrop="option.autoCrop"-->
<!--          :autoCropWidth="option.autoCropWidth"-->
<!--          :autoCropHeight="option.autoCropHeight"-->
<!--          :fixedBox="option.fixedBox"-->
<!--          :fixed="true"-->
<!--          :fixed-number="[1, 1]"-->
<!--          @realTime="realTime"-->
<!--          @imgLoad="imgLoad"-->
<!--        />-->
        <vue-cropper ref="cropper" :img="option.img" :output-size="option.size" :output-type="option.outputType" :info="true" :full="option.full" :fixed="true" :fixed-number="[1,1]"
                     :can-move="option.canMove" :can-move-box="option.canMoveBox" :fixed-box="option.fixedBox" :original="option.original"
                     :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight" :center-box="option.centerBox"
                     @real-time="realTime" :high="option.high"
                     @img-load="imgLoad" mode="cover"></vue-cropper>
      </div>
      <div class="footer-btn">
        <div class="scope-btn">
          <label class="btn" for="uploads">更换图片</label>
          <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="selectImg($event, 1)">

          <el-button size="mini" type="primary" plain icon="el-icon-plus" @click="changeScale(1)"></el-button>
          <el-button size="mini" type="primary" plain icon="el-icon-minus" @click="changeScale(-1)"></el-button>
          <el-button size="mini" type="primary" plain @click="rotateLeft">↺</el-button>
          <el-button size="mini" type="primary" plain @click="rotateRight">↻</el-button>
        </div>
        <div class="upload-btn">
          <el-button size="mini" type="error" @click="uploadImg('blob')">上传<i type="el-icon-upload"></i></el-button>
        </div>
      </div>
    </div>
    <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
      <div :style="previews.div">
        <img :src="previews.url" :style="previews.img">
      </div>
    </div>
  </div>
</template>
<script>
import { VueCropper } from 'vue-cropper'
import { uploadToken } from '@/api/user'
import * as qiniu from 'qiniu-js'
export default {
  props: ['Options', 'Name'],
  data () {
    return {
      name: this.Name,
      previews: {},
      option: this.Options,
      n: 1,
      loaded: false
    }
  },
  watch: {
    Options (val, oldval) {
      console.log(val, oldval)
    }
  },
  methods: {
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
    },
    imgLoad (msg) {
      // 加载图片
    },
    // 调整裁切图片大小
    changeCropBox (w, h) {
      this.$refs.cropper.changeCrop(w, h)
    },
    // 图片缩放
    changeScale (num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 向左旋转
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },
    // 向右旋转
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    // 实时预览函数
    realTime (data) {
      this.previews = data
    },
    // 选择图片
    selectImg (e, num) {
      // 上传图片
      // this.option.img
      var file = e.target.files[0]
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
        return false
      }
      var reader = new FileReader()
      reader.onload = (e) => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        if (num === 1) {
          this.option.img = data
        } else if (num === 2) {
          this.example2.img = data
        }
      }
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file)
    },
    // 上传图片
    uploadImg (type) {
      // 输出
      if (type === 'blob') {
        const that = this
        that.loaded = true
        uploadToken().then(res => {
          if (res.code === 20000) {
            this.$refs.cropper.getCropBlob((data) => {
              let targetFile = data
              let config = {
                useCdnDomain: true, // 表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
                region: qiniu.region.z2, // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
                concurrentRequestLimit: 3 // 分片上传的并发请求量，number，默认为3
              }
              let putExtra = {
                fname: '', // 文件原文件名
                params: {}, // 用来放置自定义变量
                // eslint-disable-next-line no-useless-escape
                mimeType: ['image/png', 'image/jpeg', 'image/bmp'] // 用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
              }
              let date = new Date()
              let token = res.message
              const key = this.getuuid() + date.getDate() + '.png'
              let observable = qiniu.upload(targetFile, key, token, putExtra, config)
              observable.subscribe({
                next: (result) => {},
                error: (errResult) => {
                  that.loaded = false
                  that.$root.$message.error('出现异常')
                },
                complete: (result) => {
                  that.loaded = false
                  that.$emit('uploadImgSuccess', 'http://cloud.yhhu.xyz/' + result.key)
                  // that.$refs.cropper.mounted()
                }
              })
            })
          } else {
            that.loaded = false
            that.$root.$message.error('请稍后重试！')
          }
        })
      } else {
        this.$root.$message.warning('目前只支持blog格式！')
        // this.$refs.cropper.getCropData((data) => {
        //   // 调用axios上传
        //   this.$ajax.post('/verfile/verupload.do', data).then(res => {
        //     console.info('res:' + JSON.stringify(res))
        //     let data = res.data.replace('[', '').replace(']', '').split(',')
        //     let imgInfo = {
        //       name: _this.name,
        //       url: data[1]
        //     }
        //     _this.$emit('uploadImgSuccess', imgInfo)
        //     //              this.$refs.cropper.mounted()
        //   }).catch(function (error) {
        //     console.log(error)
        //   })
        // })
      }
    }
  },
  components: {
    VueCropper
  }
}
</script>
<style scoped lang="scss">
  .cropper-content{
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    .cropper-box{
      flex: 1;
      width: 100%;
      .cropper{
        width: auto;
        height: 300px;
      }
    }
    .show-preview{
      flex: 1;
      -webkit-flex: 1;
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      .preview{
        overflow: hidden;
        border:1px solid #cccccc;
        background: #cccccc;
        margin-left: 40px;
      }
    }
  }
  .footer-btn{
    margin-top: 30px;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    .scope-btn{
      width: 310px;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      padding-right: 20px;
    }
    .upload-btn{
      flex: 1;
      -webkit-flex: 1;
      display: flex;
      display: -webkit-flex;
      justify-content: center;
    }
    .btn {
      outline: none;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      -webkit-appearance: none;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      -webkit-transition: .1s;
      transition: .1s;
      font-weight: 500;
      padding: 8px 15px;
      font-size: 12px;
      border-radius: 3px;
      color: #fff;
      background-color: #67c23a;
      border-color: #67c23a;
    }
  }
</style>
