<template>
  <y-shelf title="我的闲置物品">
    <div slot="content" v-loading="getGoods">
      <el-table
        :data="tableData"
        border
        style="margin-top: 20px;margin-bottom: 20px">
        <el-table-column
          prop="title"
          label="商品标题"
          width="200">
        </el-table-column>
        <el-table-column
          prop="sellPoint"
          label="商品卖点"
          width="200">
        </el-table-column>
        <el-table-column
          prop="image"
          label="预览图片"
          width="150">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.image" lazy></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="120">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===1">已上架</el-tag>
            <el-tag v-else-if="scope.row.status===2" type="success">已售出</el-tag>
            <el-tag v-else type="warning">已下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created"
          label="创建时间"
          width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.created }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="209">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleSearch(scope.row.id)">
              查看
            </el-button>
            <el-button
              size="mini" @click="handleEdit(scope.row.id)">编辑
            </el-button>
            <el-popconfirm
              style="margin-left: 10px"
              confirmButtonText='确认'
              cancelButtonText='取消'
              icon="el-icon-info"
              iconColor="red"
              @onConfirm="handleDelete(scope.row.id)"
              title="是否确认删除该闲置物品？"
            >
              <el-button
                size="mini"
                type="danger"
                slot="reference">删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="this.total>0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 40, 80]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </y-shelf>
</template>

<script>
import YShelf from '@/components/shelf'
import { getMyGoods, deleteMyGoods } from '@/api/goods'

export default {
  components: {
    YShelf
  },
  data () {
    return {
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      getGoods: false
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.initGoodsData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.initGoodsData()
    },
    handleSearch (data) {
      // this.$router.push({name:"detail",params:{personId:33}})
      window.open('//' + window.location.host + '/#/goodsDetails?productId=' + data)
    },
    handleEdit (data) {
      this.$router.push({
        name: '处理闲置物品',
        params: { goodsId: data }
      })
    },
    handleDelete (data) {
      this.getGoods = true
      deleteMyGoods({
        goodsId: data
      }).then(res => {
        if (res.code === 20000) {
          this.$root.$message.success('删除成功~')
          this.initGoodsData()
          // 将在init方法中取消loading
        }
      }).catch(() => {
        this.$root.$message.error('删除出现错误，请稍后重试~')
        this.getGoods = false
      })
    },
    initGoodsData () {
      this.getGoods = true
      getMyGoods({
        page: this.currentPage,
        size: this.pageSize
      }).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
      }).catch(() => {
        this.$root.$message.error('出现未知错误哟~')
      }).finally(() => {
        this.getGoods = false
      })
    }
  },
  mounted () {
    this.initGoodsData()
  }
}
</script>
