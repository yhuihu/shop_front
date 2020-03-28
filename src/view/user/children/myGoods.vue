<template>
  <y-shelf title="我的闲置物品">
    <div slot="content" v-loading="getGoods">
      <el-form style="margin-left: 20px;margin-top: 20px;margin-bottom: -20px" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="关键字">
          <el-input v-model="formInline.keyword" placeholder="关键字"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.status">
            <el-option label="全部" value="-1" selected></el-option>
            <el-option label="上架中" value="1"></el-option>
            <el-option label="待付款" value="3"></el-option>
            <el-option label="已售出" value="2"></el-option>
            <el-option label="待发货" value="5"></el-option>
            <el-option label="待确认" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border
        style="margin-top: 20px;margin-bottom: 20px">
        <el-table-column
          prop="title"
          label="商品标题"
          width="200">
        </el-table-column>
        <el-table-column
          prop="sellPoint"
          label="商品卖点"
          width="200">
        </el-table-column>
        <el-table-column
          prop="image"
          label="预览图片"
          width="150">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.image.split(',')[0]" lazy></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="120">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===1">已上架</el-tag>
            <el-tag v-else-if="scope.row.status===2" type="success">已售出</el-tag>
            <el-tag v-else-if="scope.row.status===3" type="warning">待付款</el-tag>
            <el-tag v-else-if="scope.row.status===5" type="danger">待发货</el-tag>
            <el-tag v-else-if="scope.row.status===6" type="info">待收货</el-tag>
            <el-tag v-else type="error">已下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created"
          label="创建时间"
          width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.created }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="209">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleSearch(scope.row.id)">
              查看
            </el-button>
            <el-button v-if="scope.row.status===1"
              size="mini" @click="handleEdit(scope.row.id)">编辑
            </el-button>
<!--            <el-button v-else size="mini" type="warning">-->
<!--              已售-->
<!--            </el-button>-->
            <el-popconfirm style="margin-left: 10px"
              confirmButtonText='确认' cancelButtonText='取消' icon="el-icon-info"
              iconColor="red" @onConfirm="handleDelete(scope.row.id)" title="是否确认删除该闲置物品？" v-if="scope.row.status===1">
              <el-button size="mini" type="danger" slot="reference">删除</el-button>
            </el-popconfirm>
            <el-button size="mini" type="warning" v-if="scope.row.status===5" @click="openShipping(scope.row.id)">发货</el-button>
            <el-button size="mini" type="info" v-if="scope.row.status!==1" @click="chatToUser(scope.row.nickName,scope.row.buyerId,scope.row.icon)">联系</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="this.total>0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 40, 80]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <y-popup :open="popupOpen" @close='popupOpen=false' :title="popupTitle" v-loading="shippingLoading">
        <div slot="content" class="md">
          <div>
            <input type="text" placeholder="快递公司" v-model="shipping.shippingName">
          </div>
          <div>
            <input type="text" placeholder="订单号" v-model="shipping.shippingCode">
          </div>
          <my-button text='提交'
                     class="btn"
                     :classStyle="'main-btn'"
                     @btnClick="submitShipping()">
          </my-button>
        </div>
      </y-popup>
    </div>
  </y-shelf>
</template>

<script>
import YShelf from '@/components/shelf'
import YPopup from '@/components/popup'
import { getMyGoods, deleteMyGoods } from '@/api/goods'
import MyButton from '@/components/myButton'
import { postShipping } from '@/api/shipping'
export default {
  components: {
    YShelf,
    MyButton,
    YPopup
  },
  data () {
    return {
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      popupTitle: '发货',
      popupOpen: false,
      getGoods: false,
      shippingLoading: false,
      formInline: {
        keyword: '',
        status: '-1'
      },
      shipping: {
        goodsId: '',
        shippingName: '',
        shippingCode: ''
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.initGoodsData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.initGoodsData()
    },
    handleSearch (data) {
      // this.$router.push({name:"detail",params:{personId:33}})
      window.open('//' + window.location.host + '/#/goodsDetails?productId=' + data)
    },
    handleEdit (data) {
      this.$router.push({
        name: '处理闲置物品',
        params: { goodsId: data }
      })
    },
    handleDelete (data) {
      this.getGoods = true
      deleteMyGoods({
        goodsId: data
      }).then(res => {
        if (res.code === 20000) {
          this.$root.$message.success('删除成功~')
          this.initGoodsData()
          // 将在init方法中取消loading
        }
      }).catch(() => {
        this.$root.$message.error('删除出现错误，请稍后重试~')
        this.getGoods = false
      })
    },
    openShipping (data) {
      this.shipping.goodsId = data
      this.popupOpen = true
    },
    submitShipping () {
      this.shippingLoading = true
      let params = {
        goodsId: this.shipping.goodsId,
        shippingName: this.shipping.shippingName,
        shippingCode: this.shipping.shippingCode
      }
      postShipping(params).then(res => {
        if (res.code === 20000) {
          this.$root.$message.success('发货成功')
          this.initGoodsData()
          this.popupOpen = false
        } else {
          this.$root.$message.error('出现错误，请稍后重试')
        }
        this.shippingLoading = false
      })
    },
    chatToUser (nickName, targetId, icon) {
      let date = new Date()
      let seperator1 = '-'
      let seperator2 = ':'
      let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        ' ' + date.getHours() + seperator2 + date.getMinutes() +
        seperator2 + date.getSeconds()
      let chatUserData = {
        nickName: nickName,
        userId: targetId,
        icon: icon,
        createTime: currentdate,
        isRead: 1
      }
      this.$store.dispatch('chat/addChatUser', chatUserData).then(() => {
        this.$router.push({
          name: 'message',
          params: {
            'targetId': targetId,
            'nickName': nickName,
            'icon': icon
          }
        })
      })
    },
    onSubmit () {
      this.initGoodsData()
    },
    initGoodsData () {
      this.getGoods = true
      getMyGoods({
        page: this.currentPage,
        size: this.pageSize,
        keyword: this.formInline.keyword,
        status: this.formInline.status
      }).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
      }).catch(() => {
        this.$root.$message.error('出现未知错误哟~')
      }).finally(() => {
        this.getGoods = false
      })
    }
  },
  mounted () {
    this.initGoodsData()
  }
}
</script>
<style scoped lang="scss">
  .md {
  > div {
    text-align: left;
    margin-bottom: 15px;

  > input {
    width: 100%;
    height: 50px;
    font-size: 18px;
    padding: 10px 20px;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-shadow: 0 3px 5px -4px rgba(0, 0, 0, .4) inset, -1px 0 3px -2px rgba(0, 0, 0, .1) inset;
    line-height: 46px;
  }
  }
  }
</style>
