<template>
  <div>
    <y-shelf title="我的订单">
      <div slot="content">
        <el-table :data="orderList" border style="margin-top: 20px;margin-bottom: 20px">>
          <el-table-column
            prop="id"
            label="订单号"
            width="165">
          </el-table-column>
          <el-table-column
            prop="title"
            label="商品标题"
            width="200">
          </el-table-column>
          <el-table-column
            prop="image"
            label="预览图片"
            width="120">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.image.split(',')[0]" lazy></el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="payment"
            label="价格"
            width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status===0">{{scope.row.sellPrice}}</span>
              <span v-else>{{scope.row.payment}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="下单时间"
            width="160">
          </el-table-column>
          <el-table-column
            prop="consignTime"
            label="发货时间"
            width="160">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="90">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status===0" type="danger">待付款</el-tag>
              <el-tag v-else-if="scope.row.status===2" type="warning">待发货</el-tag>
              <el-tag v-else-if="scope.row.status===3" type="info">待收货</el-tag>
              <el-tag v-else-if="scope.row.status===4" type="success">交易成功</el-tag>
              <el-tag v-else-if="scope.row.status===5" type="danger">交易关闭</el-tag>
              <el-tag v-else type="error">已下架</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="consignTime"
            label="操作"
            width="280">
            <template slot-scope="scope">
              <el-button size="mini" @click="orderDetail(scope.row.id)">详情</el-button>
              <el-button v-if="scope.row.status===0" size="mini" type="success"
                         @click="doPay(scope.row.id,scope.row.goodsId)">付款
              </el-button>
              <el-button v-if="scope.row.status===0" size="mini" type="danger"
                         @click="_delOrder(scope.row.id,scope.row.goodsId)">取消
              </el-button>
              <el-button v-if="scope.row.status===3" size="mini" type="success">收货</el-button>
              <el-button type="info" size="mini">联系</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </y-shelf>
    <div style="float:right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import YShelf from '@/components/shelf'
import { pay, orderList, deleteOrder } from '@/api/order'

export default {
  data () {
    return {
      orderList: [],
      userId: '',
      orderStatus: '',
      loading: true,
      currentPage: 1,
      pageSize: 5,
      total: 0
    }
  },
  methods: {
    message (m) {
      this.$message.error({
        message: m
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this._orderList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this._orderList()
    },
    orderPayment (orderId) {
      window.open(window.location.origin + '#/order/payment?orderId=' + orderId)
    },
    goodsDetails (id) {
      window.open(window.location.origin + '#/goodsDetails?productId=' + id)
    },
    orderDetail (orderId) {
      this.$router.push({
        path: 'orderDetail',
        query: {
          orderId: orderId
        }
      })
    },
    _orderList () {
      this.loading = true
      let params = {
        size: this.pageSize,
        page: this.currentPage
      }
      orderList(params).then(res => {
        if (res.code === 20000) {
          this.orderList = res.data.list
          this.total = res.data.total
          this.loading = false
        }
      }).catch()
    },
    _delOrder (orderId, goodsId) {
      deleteOrder(orderId, goodsId).then(res => {
        if (res.code === 20000) {
          this.currentPage = 1
          this._orderList()
        } else {
          this.message('删除失败')
        }
      })
    },
    doPay (data1, data2) {
      pay(data1, data2).then(res => {
        if (res.code === 20000) {
          this._orderList()
        }
      })
    }
  },
  created () {
    this._orderList()
  },
  components: {
    YShelf
  }
}
</script>
<style lang="scss" scoped>
</style>
