<template>
  <div>
    <div class="home" v-loading="loading" element-loading-text="加载中...">
      <section class="w mt30 clearfix">
        <y-shelf :title="title1">
          <div slot="content" class="floors" >
            <mall-goods :msg="iitem" v-for="(iitem,j) in logsGoods" :key="j+'key'"></mall-goods>
          </div>
        </y-shelf>
        <el-pagination
          v-if="!noResult"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[8,16,24,32]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </section>
      <div class="no-info" v-if="noResult">
        <div class="no-data">
          <img src="../../assets/images/no-search.png" alt="#">
          <br> 抱歉！登录了才会保存日志哦
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mallGoods from '@/components/mallGoods'
import { getGoodsLogs } from '@/api/goods'
import YShelf from '@/components/shelf'
export default {
  components: {
    mallGoods,
    YShelf
  },
  data () {
    return {
      noResult: false,
      title1: '浏览日志',
      moreUrl: 'http://yhhu.xyz/aYgEbD00UMVGQIwo4hP0QMH3',
      logsGoods: [],
      loading: true,
      pageSize: 8,
      currentPage: 1,
      total: 0
    }
  },
  methods: {
    getGoodsLogs () {
      this.loading = true
      let params = {
        page: this.currentPage,
        size: this.pageSize
      }
      getGoodsLogs(params).then(res => {
        this.logsGoods = res.data.logs
        if (this.logsGoods.length === 0) {
          this.noResult = true
        }
        this.total = res.data.totalCount
      })
      this.loading = false
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getGoodsLogs()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getGoodsLogs()
    }
  },
  created () {
    this.getGoodsLogs()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  .home {
    display: flex;
    flex-direction: column;
  }

  .no-info {
    padding: 100px 0;
    text-align: center;
    font-size: 30px;
    display: flex;
    flex-direction: column;
    .no-data{
      align-self: center;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .page {
    position: absolute;
    width: 100%;
    top: 470px;
    z-index: 30;
    .dots {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .dot-active {
        display: inline-block;
        width: 15px;
        height: 15px;
        background-color: whitesmoke;
        border-radius: 8px;
        margin-right: 10px;
        cursor: pointer;
      }
      .dot {
        opacity: 0.2;
      }
    }
  }

  .activity-panel {
    width: 1220px;
    margin: 0 auto;
    .box {
      overflow: hidden;
      position: relative;
      z-index: 0;
      margin-top: 25px;
      box-sizing: border-box;
      border: 1px solid rgba(0,0,0,.14);
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
    }
    .content {
      float: left;
      position: relative;
      box-sizing: border-box;
      width: 25%;
      height: 200px;
      text-align: center;
    }
    .content ::before{
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      box-sizing: border-box;
      border-left: 1px solid #f2f2f2;
      border-left: 1px solid rgba(0,0,0,.1);
      width: 100%;
      height: 100%;
      content: "";
      pointer-events: none;
    }
    .i {
      width: 305px;
      height: 200px;
    }
    .cover-link {
      cursor: pointer;
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 4;
      background: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEHAAEALAAAAAABAAEAAAICTAEAOw==) repeat;
    }
    a {
      color: #5079d9;
      cursor: pointer;
      transition: all .15s ease-out;
      text-decoration: none;
    }
    a:hover {
      box-shadow: inset 0 0 38px rgba(0,0,0,.08);
      transition: all .15s ease;
    }
  }

  .banner, .banner span, .banner div {
    font-family: "Microsoft YaHei";
    transition: all .3s;
    transition-timing-function: linear;
  }

  .banner {
    cursor: pointer;
    perspective: 3000px;
    position: relative;
    z-index: 19;
    margin: 0 auto;
    width: 1220px;
  }

  .bg {
    position: relative;
    width: 1220px;
    height: 500px;
    margin: 20px auto;
    background-size: 100% 100%;
    border-radius: 10px;
    transform-style: preserve-3d;
    transform-origin: 50% 50%;
    transform: rotateY(0deg) rotateX(0deg);
    & div{
      position: relative;
      height: 100%;
      width: 100%;
    }
  }

  .img1 {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    border-radius: 10px;
  }

  .img2 {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 5px;
    left: 0;
    background-size: 95% 100%;
    border-radius: 10px;
  }

  .img3 {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    border-radius: 10px;
  }

  .a {
    z-index: 20;
    transform: translateZ(40px);
  }

  .b {
    z-index: 20;
    transform: translateZ(30px);
  }

  .c {
    transform: translateZ(0px);
  }

  .sk_item {
    width: 170px;
    height: 225px;
    padding: 0 14px 0 15px;
    > div {
      width: 100%;
    }
    a {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: all .3s;
      &:hover {
        transform: translateY(-5px);
      }
    }
    img {
      width: 130px;
      height: 130px;
      margin: 17px 0;
    }
    .sk_item_name {
      color: #999;
      display: block;
      max-width: 100%;
      _width: 100%;
      overflow: hidden;
      font-size: 12px;
      text-align: left;
      height: 32px;
      line-height: 16px;
      word-wrap: break-word;
      word-break: break-all;
    }
    .sk_item_price {
      padding: 3px 0;
      height: 25px;
    }
    .price_new {
      font-size: 18px;
      font-weight: 700;
      margin-right: 8px;
      color: #f10214;
    }
    .price_origin {
      color: #999;
      font-size: 12px;
    }
  }

  .box {
    overflow: hidden;
    position: relative;
    z-index: 0;
    margin-top: 29px;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, .14);
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 3px 8px -6px rgba(0, 0, 0, .1);

  }

  ul.box {
    display: flex;
    li {
      flex: 1;
      img {
        display: block;
        width: 305px;
        height: 200px;
      }
    }
  }

  .mt30 {
    margin-top: 30px;
  }

  .hot {
    display: flex;
    > div {
      flex: 1;
      width: 25%;
    }
  }

  .floors {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .imgbanner {
      width: 25%;
      height: 400px;
      .cover-link {
        cursor: pointer;
        display: block;
        position: absolute;
        top: 60px;
        left: 0;
        width: 25%;
        height: 430px;
        z-index: 4;
        background: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEHAAEALAAAAAABAAEAAAICTAEAOw==) repeat;
      }
      .cover-link:hover {
        box-shadow: inset 0 0 38px rgba(0,0,0,.08);
        transition: all .15s ease;
      }
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

</style>
