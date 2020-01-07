<template>
  <div class="gray-box">
    <div class="title">
<!--      <h2>{{goodId}}</h2>-->
      <h2><el-button-group>
        <el-button icon="el-icon-goods" v-if="this.detailShow" @click="changeShow" type="info" disabled style="color: black">商品详情</el-button>
        <el-button icon="el-icon-goods" v-else @click="changeShow" type="text">商品详情</el-button>
        <el-button icon="el-icon-help" v-if="!this.detailShow" @click="changeShow" disabled type="info" style="color: black">讨论</el-button>
        <el-button icon="el-icon-help" v-else @click="changeShow" type="text">讨论</el-button>
      </el-button-group></h2>
      <div>
        <slot name="right"/>
      </div>
    </div>
    <!--内容-->
    <div v-if="this.detailShow">
      <slot name="content"/>
    </div>
    <div v-else>
      讨论区
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'goodId'
  ],
  data () {
    return {
      detailShow: true
    }
  },
  methods: {
    changeShow () {
      this.detailShow = !this.detailShow
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .gray-box {
    position: relative;
    margin-bottom: 30px;
    overflow: hidden;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #dcdcdc;
    border-color: rgba(0, 0, 0, .14);
    box-shadow: 0 3px 8px -6px rgba(0, 0, 0, .1);
    .title {
      padding-left: 30px;
      position: relative;
      z-index: 10;
      height: 60px;
      padding: 0 10px 0 24px;
      border-bottom: 1px solid #d4d4d4;
      border-radius: 8px 8px 0 0;
      box-shadow: rgba(0, 0, 0, .06) 0 1px 7px;
      background: #f3f3f3;
      background: -webkit-linear-gradient(#fbfbfb, #ececec);
      background: linear-gradient(#fbfbfb, #ececec);
      line-height: 60px;
      font-size: 18px;
      color: #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
      h2 {
        font-size: 18px;
        font-weight: 400;
        color: #626262;
        display: inline-block;
      }
    }
  }
</style>
