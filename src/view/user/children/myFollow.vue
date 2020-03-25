<template>
<div>
  <y-shelf title="我的关注">
    <div slot="content">
      <el-table
        :data="tableData"
        style="width: 80%;margin-left:auto;margin-right:auto;">
        <el-table-column
          align="center"
          label="头像"
          width="100">
          <template slot-scope="scope">
            <el-avatar :size="60" :src="scope.row.icon"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          label="名称"
          align="center"
          width="180">
          <template slot-scope="scope">
            <el-tag size="normal">{{ scope.row.nickName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="关注时间"
          align="center"
          width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="toFollowDetail(scope.row.userId)">查看详情</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="unFollowUser(scope.row.userId)">取消关注</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </y-shelf>
</div>
</template>
<script>
import YShelf from '@/components/shelf'
import { getMyFollow, unFollow } from '@/api/follow'

export default {
  data () {
    return {
      tableData: []
    }
  },
  components: {
    YShelf
  },
  methods: {
    async initMyFollow () {
      await getMyFollow().then(res => {
        if (res.code === 20000) {
          this.tableData = res.data
        }
      })
    },
    toFollowDetail (data) {
      window.open(window.location.origin + '#/follow/detail/' + data)
    },
    unFollowUser (data) {
      unFollow(data).then(res => {
        if (res.code === 20000) {
          this.$root.$message.success('取消关注成功')
          this.initMyFollow()
        } else {
          this.$root.$message.error(res.message)
        }
      })
    }
  },
  created () {
    this.initMyFollow()
  }
}
</script>

<style scoped>

</style>
