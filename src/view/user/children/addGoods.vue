<template>
  <div>
    <y-shelf title="出售闲置物品">
      <div slot="content">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" style="margin-right: 20px;margin-top:20px">
          <el-form-item label="商品标题" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="商品卖点" prop="sellPoint">
            <el-input v-model="form.sellPoint"></el-input>
          </el-form-item>
          <el-form-item label="预览图片" prop="previewImage">
            <el-upload :action=this.uploadUrl
                       list-type="picture-card"
                       :limit="5"
                       :file-list="imageList"
                       :on-exceed="overUpload"
                       :before-upload="beforeUpload"
                       :on-success="imagesUploadSuccess"
                       :on-preview="handlePictureCardPreview"
                       :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item label="商品分类" prop="classification">
            <el-cascader size="medium"
                         v-model="value"
                         :show-all-levels="false"
                         :options="options"
                         @change="handleChange"
                         clearable
                         placeholder="选择分类"/>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="form.price" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </el-form-item>
          <el-form-item label="上架/下架">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">上架</el-radio>
              <el-radio :label="0">下架</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商品详情" prop="goodDetail">
            <tinymce-editor v-model="form.desc" @onClick="onClick" ref="editor"></tinymce-editor>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!this.goodsId" type="primary" @click="addGood">立即创建</el-button>
            <el-button v-else type="primary" @click="updateGood">更新数据</el-button>
          </el-form-item>
        </el-form>
      </div>
    </y-shelf>
  </div>
</template>

<script>
import TinymceEditor from '@/components/tinymceEditor'
import YShelf from '@/components/shelf'
import { getAllClassification } from '@/api/classification'
import { addGoods, getMyGoodsDetail, updateMyGoods } from '@/api/goods'
export default {
  components: {
    TinymceEditor,
    YShelf
  },
  data () {
    const validateClassification = (rule, value, callback) => {
      let isDefined = this.form.classificationId !== undefined
      let isChange = this.form.classificationId !== ''
      if (isDefined && isChange) {
        callback()
      } else {
        callback(new Error('请选择商品分类'))
      }
    }
    const validatePreviewImage = (rule, value, callback) => {
      if (this.form.fileList.length > 0) {
        callback()
      } else {
        this.$root.$message.error('预览图片不能为空')
        callback(new Error(' '))
      }
    }
    const validateDetail = (rule, value, callback) => {
      if (this.form.desc !== undefined && this.form.desc !== '') {
        callback()
      } else {
        callback(new Error('商品描述不能为空'))
      }
    }
    return {
      uploadUrl: process.env.VUE_APP_BASE_SERVER + '/upload',
      goodsId: '',
      classificationName: [],
      dialogImageUrl: '',
      dialogVisible: false,
      value: [],
      // imageList: [{ url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      imageList: [],
      flag: false,
      form: {
        title: '',
        sellPoint: '',
        price: '',
        classificationId: '',
        desc: '请输入商品内容',
        fileList: [],
        status: 1
      },
      options: [],
      rules: {
        title: [
          { required: true, message: '商品标题不能为空', trigger: ['blur', 'change'] }
        ],
        sellPoint: [
          { required: true, message: '商品卖点不能为空', trigger: ['blur', 'change'] }
        ],
        previewImage: [
          { required: true, validator: validatePreviewImage, trigger: ['blur', 'change'] }
        ],
        classification: [
          { required: true, validator: validateClassification, trigger: ['blur', 'change'] }
        ],
        price: [
          { required: true, message: '商品价格不能为空', trigger: ['blur', 'change'] }
        ],
        goodDetail: [
          { required: true, validator: validateDetail, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    handleRemove (file, fileList) {
      if (file.url) {
        for (let i = 0; i < this.form.fileList.length; i++) {
          if (file.response) {
            if (this.form.fileList[i] === file.response.data.path) {
              this.form.fileList.splice(i, 1)
            }
          } else {
            if (this.form.fileList[i] === file.url) {
              this.form.fileList.splice(i, 1)
            }
          }
        }
      }
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    overUpload (file, fileList) {
      this.$root.$message.error('最多只能上传5张预览图！')
    },
    async getClassification () {
      try {
        let result = await getAllClassification()
        if (result.code === 20000) {
          const newData = result.data
          this.handleData(newData)
          this.options.push(newData[0])
        }
      } catch (e) {
        this.$root.$message.error('数据初始化失败~请稍后重试')
      }
    },
    beforeUpload (file) {
      let arr = ['jpg', 'jpeg', 'png', 'bmp', 'JPG', 'JPEG', 'PNG', 'BMP']
      const target = file.name.substring(file.name.lastIndexOf('.') + 1)
      const isImg = arr.includes(target)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImg) {
        this.$message.error('上传图片格式错误!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isImg && isLt2M
    },
    imagesUploadSuccess (res, file) {
      if (file.response) {
        this.form.fileList.push(res.data.path)
      }
      console.log(this.imageList)
    },
    handleData (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children.length === 0) {
          delete data[i].children
        } else {
          this.handleData(data[i].children)
        }
      }
    },
    handleChange (value) {
      console.log(value)
      this.form.classificationId = value[value.length - 1]
    },
    // 鼠标单击的事件
    onClick (e, editor) {
      // console.log('Element clicked')
      // console.log(e)
      // console.log(editor)
    },
    // 清空内容
    clear () {
      this.$refs.editor.clear()
    },
    addGood () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          addGoods(this.form).then(res => {
            if (res.code === 20000) {
              this.$root.$message.success('添加闲置物品成功~')
              setInterval(function () {
                this.$router.push({ path: '/user/myGoods' })
              }, 2000)
            }
          }).catch(() => {
            this.$root.$message.error('出现未知错误，请稍后重试')
          })
        } else {
          return false
        }
      })
    },
    updateGood () {
      const that = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.goodsId = this.goodsId
          updateMyGoods(this.form).then(res => {
            if (res.code === 20000) {
              this.$root.$message.success('更新闲置物品成功~')
              setTimeout(function () {
                that.$router.push({ path: '/user/myGoods' })
              }, 2000)
            } else {
              this.$root.$message.error('出现错误~')
            }
          }).catch(() => {
          })
        } else {
          return false
        }
      })
    },
    async initUpdateData (target) {
      try {
        let result = await getMyGoodsDetail(target)
        if (result.code === 20000) {
          this.form = result.data
          let targetImage = result.data.fileList
          for (let i = 0; i < targetImage.length; i++) {
            let params = {
              url: targetImage[i]
            }
            this.imageList.push(params)
          }
        }
      } catch (e) {
        this.$root.$message.error('数据初始化失败~请稍后重试')
      }
    },
    checkOptions (target) {
      for (let i = 0; i < target.length; i++) {
        if (target[i].children) {
          this.classificationName.push(target[i].value)
          this.checkOptions(target[i].children)
        } else if (target[i].value === this.form.classificationId) {
          this.classificationName.push(target[i].value)
          this.flag = true
          break
        }
      }
    }
  },
  mounted () {
  },
  async created () {
    await this.getClassification()
    const target = this.$route.params.goodsId
    if (target) {
      this.goodsId = target
      await this.initUpdateData(this.goodsId)
      for (let i = 0; i < this.options.length; i++) {
        this.classificationName.push(this.options[i].value)
        if (this.options[i].children) {
          await this.checkOptions(this.options[i].children)
          if (this.flag) {
            break
          }
        }
      }
      this.value = this.classificationName
    }
  }
}
</script>

<style>
  .el-row {
    margin-bottom: 20px;
  }

  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
