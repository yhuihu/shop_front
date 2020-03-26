<template>
  <div>
  <div class="w" style="padding-bottom: 100px;">
    <y-shelf title="支付订单">
      <div slot="content">
        <div class="box-inner order-info">
          <h3>生成订单成功</h3>
          <p class="payment-detail">请在 <span>24 小时内</span>完成支付，超时订单将自动取消。</p>
          <p class="payment-detail" style="color:red">注意：如果因为您的个人原因导致无法完成交易，您将负责卖家快递费用</p>
        </div>
        <div class="pay-info">
          <!--地址信息-->
          <div class="p-msg w" style="text-align: center">
            <div class="confirm-detail">
              <div class="info-title">收货信息</div>
              <p class="info-detail">姓名：{{userName}}</p>
              <p class="info-detail">联系电话：{{tel}}</p>
              <p class="info-detail">详细地址：{{streetName}}</p></div>
          </div>
          <div class="confirm-table-title">
            <span class="name">商品信息</span>
            <div>
              <span class="price">单价</span>
            </div>
          </div>
          <!--商品-->
          <div class="confirm-goods-table">
            <div class="cart-items" v-for="(item,i) in cartList" :key="i">
              <div class="name">
                <div class="name-cell ellipsis">
                  <a @click="goodsDetails(item.goodsId)" title="" target="_blank">{{item.title}}</a>
                </div>
              </div>
              <div class="n-b">
                <div class="price">¥ {{item.price}}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="box-inner">
            <div>
              <span>
                订单金额：
              </span>
              <em><span>¥</span>{{orderTotal.toFixed(2)}}</em>
              <y-button :text="payNow"
                        :classStyle="submit?'main-btn':'disabled-btn'"
                        style="width: 120px;height: 40px;font-size: 16px;line-height: 38px"
                        @btnClick="paySuc()"
              ></y-button>
            </div>
          </div>
        </div>
      </div>
    </y-shelf>
  </div>
  </div>
</template>
<script>
import YShelf from '@/components/shelf'
import YButton from '@/components/myButton'
import { getCheckOrder, checkOrder } from '@/api/order'
import { getCart } from '@/api/goods'
import { setStore } from '@/utils/storage'
export default {
  data () {
    return {
      payType: 1,
      addList: {},
      cartList: [],
      addressId: 0,
      productId: '',
      num: '',
      userId: '',
      orderTotal: 0,
      userName: '',
      tel: '',
      streetName: '',
      payNow: '确认订单',
      submit: true,
      nickName: '',
      money: '1.00',
      info: '',
      email: '',
      orderId: '',
      type: '',
      moneySelect: '1.00',
      isCustom: false,
      maxLength: 30
    }
  },
  computed: {
    // 选中的总价格
    checkPrice () {
      let totalPrice = 0
      this.cartList && this.cartList.forEach(item => {
        if (item.checked === '1') {
          totalPrice += (item.productNum * item.salePrice)
        }
      })
      return totalPrice
    }
  },
  methods: {
    messageFail (m) {
      this.$message.error({
        message: m
      })
    },
    goodsDetails (id) {
      window.open(window.location.origin + '#/goodsDetails?productId=' + id)
    },
    _getOrderDet (orderId) {
      getCheckOrder(orderId).then(res => {
        if (res.data.length === 0) {
          this.$router.push({ path: '/' })
          return
        }
        this.cartList = res.data
        this.userName = this.cartList[0].buyerName
        this.tel = this.cartList[0].buyerPhone
        this.streetName = this.cartList[0].buyerAddress
        let totalPrice = 0
        for (let i = 0; i < this.cartList.length; i++) {
          totalPrice += this.cartList[i].price
        }
        this.orderTotal = totalPrice
      })
    },
    paySuc () {
      this.payNow = '确认订单中...'
      this.submit = false
      let that = this
      checkOrder(this.orderId).then(res => {
        if (res.code === 20000) {
          this.$root.$message.success('确认订单成功！')
          getCart().then(res => {
            if (res.code === 20000) {
              setStore('buyCart', res.data)
            }
            // 重新初始化一次本地数据
          }).then(() => {
            this.$store.dispatch('cart/initCart')
            setTimeout(function () {
              that.$router.push('/home')
            }, 2000)
          })
        } else {
          this.payNow = '确认订单'
          this.submit = true
          this.messageFail(res.message)
        }
      })
    },
    isMoney (v) {
      if (v < 0.1) {
        return false
      }
      var regu = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      var re = new RegExp(regu)
      if (re.test(v)) {
        return true
      } else {
        return false
      }
    },
    isEmail (v) {
      var regu = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
      var re = new RegExp(regu)
      if (re.test(v)) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    this.orderId = this.$route.query.orderId
    if (this.orderId) {
      this._getOrderDet(this.orderId)
    } else {
      this.$router.push({ path: '/' })
    }
  },
  components: {
    YShelf,
    YButton
  }
}
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  .w {
    padding-top: 39px;
  }

  .order-info {
    padding: 60px 0 55px;
    color: #333;
    background: #fff !important;

    h3 {
      padding-bottom: 14px;
      line-height: 36px;
      text-align: center;
      font-size: 36px;
      color: #212121;
    }

    .payment-detail {
      text-align: center;
      line-height: 24px;
      font-size: 14px;
      color: #999;
    }
  }

  /*支付类型*/
  .pay-type {
    margin: 0 auto;
    width: 90%;
    padding-bottom: 30px;

    .p-title {
      font-size: 18px;
      line-height: 40px;
      padding: 0 10px;
      position: relative;

      &:before {
        content: ' ';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        border-bottom: 1px solid #ccc;
      }
    }

  }

  .pay-type {
    .pay-item {
      display: flex;
      align-items: center;

      div {
        margin-top: 20px;
        width: 175px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #E5E5E5;
        cursor: pointer;
        border-radius: 6px;
        margin-right: 10px;
        background: #FAFAFA;

        &.active {
          border-color: #6A8FE5;
          background: #fff;
        }

        img {
          display: block;
          height: 34px;
          margin: 8px auto;
        }
      }
    }
  }

  .box-inner {
    line-height: 60px;
    background: #f9f9f9;
    border-top: 1px solid #e5e5e5;
    box-sizing: border-box;

    > div {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 20px;
    }

    em {
      margin-left: 5px;
      font-size: 24px;
      color: #d44d44;
      font-weight: 700;
      margin-right: 20px;

      span {
        margin-right: 4px;
        font-size: 16px;

      }
    }
  }

  .confirm-detail {
    padding: 0 30px 25px;
    border-top: 1px solid #d5d5d5;

    .info-title {
      height: 14px;
      margin: 30px 0 17px;
      line-height: 14px;
      font-weight: bolder;
      color: #333;
    }

    .info-detail {
      line-height: 24px;
      color: #666;
    }
  }

  .confirm-table-title {
    padding: 3px 0 0 33px;
    border-top: 1px solid #D5D5D5;
    line-height: 54px;
    font-weight: bolder;
    color: #000;
    display: flex;
    justify-content: space-between;

    span {
      display: inline-block;
      width: 175px;
      text-align: left;
    }

    .price {
      padding-left: 80px;
    }

    .num {
      padding-left: 75px;
    }

    .subtotal {
      padding-left: 72px;
    }
  }

  .confirm-goods-table {
    border-top: 1px solid #D5D5D5;

    .cart-items {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      a {
        color: #333;
      }
    }

    .n-b {
      display: flex;
      align-items: center;
      justify-content: center;

      > div {
        color: #626262;
        font-weight: 700;
        width: 175px;
        text-align: center;
      }
    }
  }

  .order-discount-line {
    padding: 22px 30px 53px;
    border-top: 1px solid #D5D5D5;
    line-height: 24px;
    text-align: right;
    font-size: 12px;

    &:first-child {
      line-height: 32px;
      text-align: right;
      font-size: 14px;
      font-weight: bolder;
    }
  }

  .name {
    width: 40%;
  }

  .name-cell {
    padding-left: 33px;
  }

  .input {
    width: 30%;
    margin: 0 0 1vw 38px;
  }

  .pay-info {
    margin-top: -2vw;
    /*text-align: center;*/
  }

  .money-select {
    width: 31%;
    padding-left: 10px;
    margin-bottom: 1vw;
  }
</style>
