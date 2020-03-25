<template>
<div>
  <s-header>
    <div slot="nav"></div>
  </s-header>
  <div style="width: 50%;margin-left: auto;margin-right: auto;margin-top:20px;">
    <el-container>
      <el-aside width="200px">
        <el-avatar shape="square" :size="200" :src="icon"></el-avatar>
      </el-aside>
      <el-main>
        <el-row style="margin-top:20px">
          <el-col :span="8"><div style="display: inline;font-size: 21px;font-weight: 700;
        vertical-align: middle;color:black">{{nickName}}</div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple-light"></div></el-col>
          <el-col :span="8">
            <el-button type="success" v-if="followText==='关注'" round @click="followUser()">{{followText}}</el-button>
            <el-button type="warning" v-else round @click="unFollowUser()">{{followText}}</el-button>
            <el-button style="border-color:green;color:green;" round>发简信</el-button>
          </el-col>
        </el-row>
        <div style="margin-top: 40px;font-size:18px;">
          <div style="float:left">商品数量：{{goodsCount}}件</div>
          <div style="float:left;margin-left:30px">已售出：{{sellCount}}件</div>
          <div style="float:left;margin-left:30px">已来到：{{comeTime}}天</div>
        </div>
      </el-main>
    </el-container>
    <el-container>
      <el-main>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="商品标题"
            width="180">
            <template slot-scope="scope">
              <a @click="openProduct(scope.row.id)">{{scope.row.title}}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="image"
            label="预览图片"
            width="180">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.image[0]"
                :preview-src-list="scope.row.image">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            label="价格">
            <template slot-scope="scope">
              {{scope.row.price.toFixed(2)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status===1" type="success" disable-transitions>上架中</el-tag>
              <el-tag v-if="scope.row.status===2" type="error" disable-transitions>已售出</el-tag>
              <el-tag v-if="scope.row.status===3" type="warning" disable-transitions>已被拍下</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="created"
            label="发布时间">
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</div>
</template>

<script>
import SHeader from '@/common/header'
import { getOtherInfo, addFollow, checkFollow, unFollow } from '@/api/follow'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      nickName: '',
      targetId: '',
      comeTime: 0,
      goodsCount: 0,
      sellCount: 0,
      followText: '关注',
      icon: '',
      tableData: []
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ]) },
  methods: {
    _checkFollow () {
      checkFollow(this.targetId).then(res => {
        if (res.code === 20000) {
          this.followText = res.message
        }
      })
    },
    followUser () {
      addFollow(this.targetId).then(res => {
        if (res.code === 20000) {
          this.$root.$message.success('关注成功')
          this.followText = '取消关注'
        } else {
          this.$root.$message.error(res.message)
        }
      })
    },
    unFollowUser () {
      unFollow(this.targetId).then(res => {
        if (res.code === 20000) {
          this.$root.$message.success('取消关注成功')
          this.followText = '关注'
        } else {
          this.$root.$message.error(res.message)
        }
      })
    },
    openProduct (id) {
      window.open('//' + window.location.host + '/#/goodsDetails?productId=' + id)
    },
    async _getOtherInfo (data) {
      await getOtherInfo(data).then(res => {
        if (res.code === 20000) {
          this.comeTime = res.data.comeTime
          this.icon = res.data.icon
          this.goodsCount = res.data.goodsCount
          this.sellCount = res.data.sellCount
          this.nickName = res.data.nickName
          let goodsList = res.data.goodsList
          console.log(res.data.goodsList)
          for (let i = 0; i < goodsList.length; i++) {
            goodsList[i].image = goodsList[i].image.split(',')
          }
          this.tableData = goodsList
          console.log(goodsList)
        } else {
          this.$root.$message.error('出现未知错误，请稍后重试')
        }
      })
    }
  },
  created () {
    let id = this.$route.params.id
    this.targetId = id
    this._checkFollow()
    this._getOtherInfo(id)
  },
  components: {
    SHeader
  }
}
</script>

<style scoped>
  .main {
    background: white;;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-light {
    background: white;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
</style>
