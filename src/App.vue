<template>
  <div id="app">
    <s-header>
      <div slot="nav"></div>
    </s-header>
    <router-view class="main"/>
  </div>
</template>
<script>
  import SHeader from '@/common/header'
  export default {
    name: 'app',
    components: {
      SHeader
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "assets/style/index.scss";
  #app {
    height: 100%;
  }
  .main {
    background: #ededed;;
  }
</style>
