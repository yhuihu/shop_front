<template>
  <div></div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  beforeCreate () {
    this.$router.push({
      path: '/search',
      query: {
        key: this.$route.query.key
      }
    })
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
