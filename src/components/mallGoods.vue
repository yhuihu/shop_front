<template>
  <div class="good-item">
    <div style="">
      <div class="good-img">
        <a @click="openProduct(msg.id)">
          <img v-lazy="msg.image.split(',')[0]" :alt="msg.id" :key="msg.image.split(',')[0]" >
        </a>
      </div>
      <h6 class="good-title" v-html="msg.title">{{msg.title}}</h6>
      <h3 class="sub-title ellipsis">{{msg.sellPoint}}</h3>
      <div class="good-price pr">
        <div class="ds pa">
          <a @click="openProduct(msg.id)">
            <my-button text="查看详情" style="margin: 0 5px"/>
          </a>
          <my-button text="加入购物车"
                     style="margin: 0 5px"
                     @btnClick="addCart(msg.id,msg.price,msg.title,msg.image.split(',')[0])"
                     classStyle="main-btn"
          />
        </div>
        <p><span style="font-size:14px">￥</span>{{Number(msg.price).toFixed(2)}}</p>
      </div>
      <div class="user-info">
        <img style="width: 20px;height: 20px" v-lazy="msg.icon" :alt="msg.id" :key="msg.icon">
        <span style="font-size:16px;">{{msg.nickName}}</span>
        <span style="float: right">{{msg.address}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import myButton from '@/components/myButton'
import { mapGetters } from 'vuex'
import { addCart } from '@/api/goods'
export default {
  props: {
    msg: {
      salePrice: 0
    }
  },
  data () {
    return {}
  },
  methods: {
    openProduct (id) {
      window.open('//' + window.location.host + '/#/goodsDetails?productId=' + id)
    },
    addCart (id, price, name, img) {
      if (!this.showMoveImg) { // 动画是否在运动
        if (this.token) { // 登录了 直接存在用户名下
          addCart({ list: [{
            productId: id
          }] }).then(res => {
            if (res.code === 20000) {
              this.$store.dispatch('cart/addCart', {
                productId: id,
                salePrice: price,
                productName: name,
                productImg: img
              })
            } else {
              this.$root.$message.error('该商品已被其他用户拍下')
            }
          }).catch()
        }
        if (!this.showCart) {
          this.$store.dispatch('cart/showCart', { showCart: true })
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'token', 'showMoveImg', 'showCart'
    ])
  },
  created () {
  },
  mounted () {
  },
  components: {
    myButton
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/style/mixin";
  @import "../assets/style/theme";

  .good-item {
    background: #fff;
    width: 25%;
    transition: all .5s;
    height: 430px;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 1px 1px 20px #999;
      .good-price p {
        display: none;
      }
      .ds {
        display: flex;
      }
    }
    .ds {
      @extend %block-center;
      width: 100%;
      display: none;
    }

    .good-img {
      img {
        margin: 50px auto 10px;
        @include wh(206px);
        display: block;
      }
    }
    .good-price {
      margin: 15px 0;
      height: 30px;
      text-align: center;
      line-height: 30px;
      color: #d44d44;
      font-family: Arial;
      font-size: 18px;
      font-weight: 700;
    }
    .good-title {
      line-height: 1.2;
      font-size: 16px;
      color: #424242;
      margin: 0 auto;
      padding: 0 14px;
      text-align: center;
      overflow: hidden;
    }
    h3 {
      text-align: center;
      line-height: 1.2;
      font-size: 12px;
      color: #d0d0d0;
      padding: 10px;
    }
    .user-info {
      margin: 0 auto;
      padding: 0 14px;
    }
  }
</style>
