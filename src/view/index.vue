<template>
  <div>
    <s-header>
      <div slot="nav"></div>
    </s-header>
    <div class="home" v-loading="loading" element-loading-text="加载中...">
      <div style="min-height: 35vw;" v-if="!error">
        <div v-for="(item,i) in home" :key="i">
          <div class="activity-panel" v-if="item.type === 1">
            <ul class="box">
              <li class="content" v-for="(iitem,j) in item.panelContents" :key="j" @click="linkTo(iitem)">
                <img class="i" :src="iitem.picUrl" alt="#">
                <a class="cover-link"/>
              </li>
            </ul>
          </div>

          <section class="w mt30 clearfix" v-if="item.type === 2">
            <shelf :title="item.name">
              <div slot="content" class="hot">
                <mall-goods :msg="iitem" v-for="(iitem,j) in item.panelContents" :key="j"/>
              </div>
            </shelf>
          </section>

          <section class="w mt30 clearfix" v-if="item.type === 3">
            <shelf :title="item.name">
              <div slot="content" class="floors">
                <div v-for="(iitem,j) in item.panelContents" :key="j">
                  <div class="imgbanner" v-if="iitem.type === 2 || iitem.type === 3" @click="linkTo(iitem)">
                    <img v-lazy="iitem.picUrl">
                    <a class="cover-link"/>
                  </div>
                </div>
                <div v-for="(iitem,j) in item.panelContents" :key="j+'key'">
                  <mall-goods :msg="iitem" v-if="iitem.type !== 2 && iitem.type !== 3"/>
                </div>
              </div>
            </shelf>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mallGoods from '@/components/mallGoods'
import shelf from '@/components/shelf'
import SHeader from '@/common/header'
export default {
  components: {
    mallGoods,
    SHeader,
    shelf
  },
  data () {
    return {
      error: false,
      banner: [],
      mark: 0,
      bgOpt: {
        px: 0,
        py: 0,
        w: 0,
        h: 0
      },
      home: [],
      loading: true,
      notify: '1',
      timer: ''
    }
  },
  created () {
    this.loading = false
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  .home {
    display: flex;
    flex-direction: column;
  }
</style>
