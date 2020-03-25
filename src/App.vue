<template>
  <div>
    <s-header>
      <div slot="nav"></div>
    </s-header>
    <router-view class="main"></router-view>
  </div>
</template>
<script>
import SHeader from '@/common/header'
export default {
  components: {
    SHeader
  },
  name: 'app'
}
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "assets/style/index.scss";

  .main {
    background: #ededed;;
  }
</style>
