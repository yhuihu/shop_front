<!--商品详情-->
<template>
  <div>
    <div class="w store-content">
      <div class="gray-box">
        <div class="gallery-wrapper">
          <div class="gallery">
            <div class="thumbnail">
              <ul>
                <li v-for="(item,i) in small" :key="i" :class="{on:big===item}" @click="big=item">
                  <img v-lazy="item" :alt="product.productName">
                </li>
              </ul>
            </div>
            <div class="thumb">
              <div class="big">
                <img :src="big" :alt="product.productName">
              </div>
            </div>
          </div>
        </div>
        <!--右边-->
        <div class="banner">
          <div class="sku-custom-title">
            <h4>{{product.title}}</h4>
            <h6>
              <span>{{product.sellPoint}}</span>
              <span class="price">
              <em>¥</em><i>{{Number(product.price).toFixed(2)}}</i></span>
            </h6>
          </div>
          <div class="num">
            <div style="float: left">
              <a @click="toFollowDetail(product.userId)"><el-avatar :size="60" :src=product.icon></el-avatar></a>
            </div>
            <div style="float:right;margin-left: 20px"><p>卖家：{{product.nickName}}</p>
              <br>
              <p>发货地址：{{product.address}}</p></div>
          </div>
          <div class="buy" v-if="product.status===1">
            <y-button text="加入购物车"
                      @btnClick="addCart(product.id,product.price,product.title,product.image.split(',')[0])"
                      classStyle="main-btn"
                      style="width: 145px;height: 50px;line-height: 48px"/>
            <y-button text="现在购买"
                      @btnClick="checkout(product.productId)"
                      style="width: 145px;height: 50px;line-height: 48px;margin-left: 10px"/>
          </div>
          <div class="buy" v-else>
            <y-button text="商品已被拍下"
                      classStyle="disabled-btn"
                      style="width: 145px;height: 50px;line-height: 48px;" disabled="true"/>
          </div>
        </div>
      </div>
      <!--产品信息-->
      <div class="item-info">
        <y-shelf :good-id=product.id>
          <div slot="content">
            <div class="img-item" v-if="productMsg">
              <div v-html="productMsg">{{ productMsg }}</div>
            </div>
            <div class="no-info" v-else>
              <img src="../../assets/images/no-data.png" alt="#">
              <br>
              该商品暂无内容数据
            </div>
          </div>
          <div slot="comment">
            <comment @reloadComment="reloadComment" :comments="commentData" :productId="product.id"></comment>
          </div>
        </y-shelf>
      </div>
    </div>
  </div>
</template>
<script>
import { productDet, addCart } from '@/api/goods'
import { mapGetters } from 'vuex'
import YShelf from '@/components/goodsButton'
import YButton from '@/components/myButton'
import comment from '@/components/comment'
import { getComment } from '@/api/comment'

export default {
  data () {
    return {
      productMsg: {},
      small: [],
      big: '',
      product: {
        salePrice: 0
      },
      commentData: [],
      productNum: 1
    }
  },
  components: {
    YShelf, YButton, comment
  },
  computed: {
    ...mapGetters([
      'token', 'showMoveImg', 'showCart'
    ])
  },
  methods: {
    _productDet (productId) {
      productDet(productId).then(res => {
        if (res.code === 50000 || res.data == null) {
          this.$root.$message({
            type: 'error',
            message: '参数错误'
          })
        } else {
          let result = res.data
          this.product = result
          this.productMsg = result.itemDesc || ''
          this.small = result.image.split(',')
          this.big = this.small[0]
        }
      })
    },
    addCart (id, price, name, img) {
      if (!this.showMoveImg) { // 动画是否在运动
        if (this.token) { // 登录了 直接存在用户名下
          addCart({ list: [{
            productId: id
          }] }).then(() => {
            this.$store.dispatch('cart/addCart', {
              productId: id,
              salePrice: price,
              productName: name,
              productImg: img
            })
          })
        }
        if (!this.showCart) {
          this.$store.dispatch('cart/showCart', { showCart: true })
        }
      }
    },
    checkout (productId) {
      this.$router.push({ path: '/checkout', query: { productId } })
    },
    reloadComment () {
      getComment(this.$route.query.productId).then(res => {
        this.commentData = res.data
      })
    },
    editNum (num) {
      this.productNum = num
    },
    toFollowDetail (data) {
      window.open(window.location.origin + '#/follow/detail/' + data)
    }
  },
  created () {
    let id = this.$route.query.productId
    this._productDet(id)
    this.reloadComment()
  }
}
</script>
<style lang="scss" scoped>
  @import "../../assets/style/mixin";

  .store-content {
    clear: both;
    width: 1220px;
    min-height: 600px;
    padding: 0 0 25px;
    margin: 0 auto;
  }

  .gray-box {
    display: flex;
    padding: 60px;
    margin: 20px 0;

    .gallery-wrapper {
      .gallery {
        display: flex;
        width: 540px;

        .thumbnail {
          li:first-child {
            margin-top: 0px;
          }

          li {
            @include wh(80px);
            margin-top: 10px;
            padding: 12px;
            border: 1px solid #f0f0f0;
            border: 1px solid rgba(0, 0, 0, .06);
            border-radius: 5px;
            cursor: pointer;

            &.on {
              padding: 10px;
              border: 3px solid #ccc;
              border: 3px solid rgba(0, 0, 0, .2);
            }

            img {
              display: block;
              @include wh(100%);
            }
          }
        }

        .thumb {
          .big {
            margin-left: 20px;
          }

          img {
            display: block;
            @include wh(440px)
          }
        }
      }
    }

    // 右边
    .banner {
      width: 450px;
      margin-left: 10px;

      h4 {
        font-size: 24px;
        line-height: 1.25;
        color: #000;
        margin-bottom: 13px;
      }

      h6 {
        font-size: 14px;
        line-height: 1.5;
        color: #bdbdbd;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .sku-custom-title {
        overflow: hidden;
        padding: 8px 8px 18px 10px;
        position: relative;
      }

      .params-name {
        padding-right: 20px;
        font-size: 14px;
        color: #8d8d8d;
        line-height: 36px;
      }

      .num {
        padding: 29px 0 8px 10px;
        border-top: 1px solid #ebebeb;
        display: flex;
        align-items: center;
      }

      .buy {
        position: relative;
        border-top: 1px solid #ebebeb;
        padding: 30px 0 0 10px;
      }
    }
  }

  .item-info {

    .gray-box {
      padding: 0;
      display: block;
    }

    .img-item {
      width: 1220px;
      // padding: 1vw;
      text-align: center;

      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }
  }

  .no-info {
    padding: 200px 0;
    text-align: center;
    font-size: 30px;
  }

  .price {
    display: block;
    color: #d44d44;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: right;

    i {
      padding-left: 2px;
      font-size: 24px;
    }
  }
</style>
