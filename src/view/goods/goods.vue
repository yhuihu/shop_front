<template>
  <div>
    <s-header>
      <div slot="nav"></div>
    </s-header>
    <div class="goods">
      <div class="nav">
        <div class="w">
          <div class="price-interval">
            <a href="javascript:" :class="{active:sortType===1}" @click="reset()">综合排序</a>
            <a href="javascript:" @click="sortByPrice(1)" :class="{active:sortType===2}">价格从低到高</a>
            <a href="javascript:" @click="sortByPrice(-1)" :class="{active:sortType===3}">价格从高到低</a>
          </div>
          <div class="price-interval">
            <label>
              <input type="number" class="input" placeholder="价格" v-model="min">
            </label>
            <span style="margin: 0 5px"> - </span>
            <label>
              <input type="number" placeholder="价格" v-model="max">
            </label>
            <el-cascader style="margin-left: 2%"
                         size="mini"
                         :show-all-levels="false"
                         :options="options"
                         @change="handleChange"
                         clearable
                         placeholder="选择分类"/>
            <my-button text="确定" classStyle="main-btn" @btnClick="reset" style="margin-left: 10px;"/>
          </div>
        </div>
      </div>
      <div v-loading="loading" element-loading-text="加载中..." style="min-height: 30vw;">
        <div class="img-item" v-if="!noResult">
          <!--商品-->
          <div class="goods-box w">
            <mall-goods v-for="(item,i) in goods" :key="i" :msg="item"/>
          </div>
          <el-pagination
            v-if="!noResult&&!error"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 40, 80]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
        <div class="no-info" v-if="noResult">
          <div class="no-data">
            <img src="../../assets/images/no-search.png" alt="#">
            <br> 抱歉！没有为您找到相关的商品
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getSearch } from '@/api/goods.js'
import { getAllClassification } from '@/api/classification'
import MallGoods from '@/components/mallGoods'
import MyButton from '@/components/myButton'
import SHeader from '@/common/header'

export default {
  data () {
    return {
      that: this,
      goods: [],
      noResult: false,
      error: false,
      min: '',
      max: '',
      loading: true,
      searching: true,
      timer: null,
      sortType: 1,
      windowHeight: null,
      windowWidth: null,
      sort: '',
      recommendPanel: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      cId: '',
      key: '',
      options: [{
        'value': '',
        'label': '所有分类'
      }]
    }
  },
  methods: {
    handleChange (value) {
      this.cId = value[value.length - 1]
    },
    handleSizeChange (val) {
      this.pageSize = val
      this._getSearch()
      this.loading = true
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this._getSearch()
      this.loading = true
    },
    _getSearch () {
      let params = {
        keyword: this.key,
        size: this.pageSize,
        page: this.currentPage,
        sort: this.sort,
        priceGt: this.min,
        priceLt: this.max,
        classificationId: this.cId
      }
      getSearch(params).then(res => {
        if (res.code === 20000) {
          const data = res.data
          this.goods = []
          // this.goods = JSON.parse(JSON.stringify(data.list))
          for (let i = 0; i < data.list.length; i++) {
            this.goods.push(data.list[i])
          }
          // this.goods.push(data.list)
          // console.log(JSON.parse(JSON.stringify(data.list)))
          this.total = data.total
          this.noResult = this.total === 0
          this.error = false
        } else {
          this.error = true
        }
        this.loading = false
        this.searching = false
      })
    },
    // 默认排序
    reset () {
      this.sortType = 1
      this.sort = ''
      this.currentPage = 1
      this.loading = true
      this._getSearch()
    },
    // 价格排序
    sortByPrice (v) {
      v === 1 ? this.sortType = 2 : this.sortType = 3
      this.sort = v
      this.currentPage = 1
      this.loading = true
      this._getSearch()
    },
    getClassification () {
      getAllClassification().then(res => {
        const newData = res.data
        this.handleData(newData)
        this.options.push(newData[0])
      }).catch(() => {
      })
    },
    handleData (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children.length === 0) {
          delete data[i].children
        } else {
          this.handleData(data[i].children)
        }
      }
    }
  },
  created () {
  },
  mounted () {
    this.windowHeight = window.innerHeight
    this.windowWidth = window.innerWidth
    this.key = this.$route.query.key
    this._getSearch()
    this.getClassification()
  },
  components: {
    MallGoods,
    MyButton,
    SHeader
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/style/mixin";
  @import "../../assets/style/theme";

  .nav {
    height: 60px;
    line-height: 60px;

    > div {
      display: flex;
      align-items: center;

      a {
        padding: 0 15px;
        height: 100%;
        @extend %block-center;
        font-size: 12px;
        color: #999;

        &.active {
          color: #5683EA;
        }

        &:hover {
          color: #5683EA;
        }
      }

      input {
        @include wh(80px, 30px);
        border: 1px solid #ccc;
      }

      input + input {
        margin-left: 10px;
      }
    }

    .price-interval {
      padding: 0 15px;
      @extend %block-center;

      input[type=number] {
        border: 1px solid #ccc;
        text-align: center;
        background: none;
        border-radius: 5px;
      }
    }
  }

  .goods-box {
    > div {
      float: left;
      border: 1px solid #efefef;
    }
  }

  .no-info {
    padding: 100px 0;
    text-align: center;
    font-size: 30px;
    display: flex;
    flex-direction: column;

    .no-data {
      align-self: center;
    }
  }

  .img-item {
    display: flex;
    flex-direction: column;
  }

  .el-pagination {
    align-self: flex-end;
    margin: 3vw 10vw 2vw;
  }

  .section {
    padding-top: 8vw;
    margin-bottom: -5vw;
    width: 1218px;
    align-self: center;
  }

  .recommend {
    display: flex;

    > div {
      flex: 1;
      width: 25%;
    }
  }
</style>
