<!--评论模块-->
<template>
  <div class="container">
    <div style="margin-top: 20px;text-align: center">
      <el-input class="gray-bg-input"
                v-model="newComment"
                type="textarea"
                :rows="3"
                autofocus
                placeholder="写下你的评论">
      </el-input>
      <el-button style="margin-top: 10px;" @click="commitNewComment" type="primary">提交评论</el-button>
    </div>
    <div class="comment" :key="item.id" v-for="item in comments">
      <div class="info">
        <img class="avatar" :src="item.icon" width="36" height="36"/>
        <div class="right">
          <div class="name">{{item.nickName}}</div>
          <div class="date">{{item.createTime}}</div>
        </div>
      </div>
      <div class="content">{{item.content}}</div>
      <div class="control">
        <span class="comment-reply" @click="showCommentInput(item)">
          <i class="iconfont icon-comment"></i>
          <span>回复</span>
        </span>
        <span class="comment-reply" @click="deleteComment(item.id)" v-if="item.isMine===1">
          <i class="iconfont icon-comment"></i>
          <span>删除</span>
        </span>
      </div>
      <div class="reply">
        <div class="item" :key="reply.id" v-for="reply in item.children">
          <img class="avatar" :src="reply.icon" width="36" height="36"/>
          <div class="reply-content">
            <span class="from-name">{{reply.nickName}}</span><span>: </span>
            <span>{{reply.content}}</span>
          </div>
          <div class="reply-bottom">
            <span>{{reply.createTime}}</span>
            <span class="reply-text" @click="showCommentInput(item, reply)">
              <i class="iconfont icon-comment"></i>
              <span>回复</span>
            </span>
            <span class="reply-text" style="margin-left: 5px" @click="deleteComment(reply.id)" v-if="reply.isMine===1">
              <i class="iconfont icon-comment"></i>
              <span>删除</span>
            </span>
          </div>
        </div>
        <transition name="fade">
          <div class="input-wrapper" v-if="showItemId === item.id">
            <el-input class="gray-bg-input"
                      v-model="inputComment"
                      type="textarea"
                      :rows="3"
                      autofocus
                      :placeholder="placeholderText"
                      >
            </el-input>
            <div class="btn-control">
              <span class="cancel" @click="cancel">取消</span>
              <el-button class="btn" type="success" round @click="commitComment">确定</el-button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { addComment, delComment } from '@/api/comment'

export default {
  props: {
    comments: {
      type: Array,
      required: true
    },
    productId: {
      type: Number,
      required: true
    }
  },
  components: {},
  data () {
    return {
      inputComment: '',
      newComment: '',
      placeholderText: '写下你的评论',
      showItemId: '',
      replyUserName: '',
      replyUser: ''
    }
  },
  computed: {},
  methods: {

    /**
       * 点击取消按钮
       */
    cancel () {
      this.showItemId = ''
    },

    /**
       * 提交评论
       */
    commitComment () {
      if (this.inputComment.length === 0) {
        this.$root.$message.error('请先输入内容！')
        return false
      }
      let params = {
        replyId: this.showItemId,
        content: this.replyUser + this.inputComment,
        goodsId: this.productId,
        replyUserName: this.replyUserName
      }
      addComment(params).then(res => {
        if (res.code === 20000) {
          this.$root.$message.success('添加评论成功！')
          this.$emit('reloadComment')
          this.replyUser = ''
          this.placeholderText = '写下你的评论'
          this.inputComment = ''
          this.replyUserName = ''
          this.cancel()
        } else {
          this.$root.$message.error('添加评论失败，请刷新页面后重试')
        }
      })
    },
    commitNewComment () {
      if (this.newComment.length === 0) {
        this.$root.$message.error('请先输入内容！')
        return false
      }
      let params = {
        replyId: '0',
        content: this.newComment,
        goodsId: this.productId,
        replyUser: ''
      }
      addComment(params).then(res => {
        if (res.code === 20000) {
          this.$root.$message.success('添加评论成功！')
          this.$emit('reloadComment')
          this.replyUser = ''
          this.newComment = ''
          this.placeholderText = '写下你的评论'
          this.inputComment = ''
          this.replyUserName = ''
          this.cancel()
        } else {
          this.$root.$message.error('添加评论失败，请刷新页面后重试')
        }
      })
    },
    deleteComment (data) {
      delComment(data).then(res => {
        if (res.code === 20000) {
          this.$root.$message.success('删除评论成功！')
          this.$emit('reloadComment')
        } else {
          this.$root.$message.error('删除评论失败，请刷新页面后重试！')
        }
      })
    },
    /**
       * 点击评论按钮显示输入框
       * item: 当前大评论
       * reply: 当前回复的评论
       */
    showCommentInput (item, reply) {
      if (reply) {
        this.replyUser = '@' + reply.nickName + ' '
        this.replyUserName = reply.nickName
        this.placeholderText = '@' + reply.nickName + ' '
        // this.inputComment = '@' + reply.nickName + ' '
      } else {
        this.replyUser = ''
        this.placeholderText = '写下你的评论'
        this.inputComment = ''
        this.replyUserName = ''
      }
      this.showItemId = item.id
    }
  },
  created () {}
}
</script>

<style scoped lang="scss">

  @import "../assets/style/comment";

  .container {
    padding: 0 10px;
    box-sizing: border-box;

    .comment {
      display: flex;
      flex-direction: column;
      padding: 10px;
      border-bottom: 1px solid $border-fourth;

      .info {
        display: flex;
        align-items: center;

        .avatar {
          border-radius: 50%;
        }

        .right {
          display: flex;
          flex-direction: column;
          margin-left: 10px;

          .name {
            font-size: 16px;
            color: $text-main;
            margin-bottom: 5px;
            font-weight: 500;
          }

          .date {
            font-size: 12px;
            color: $text-minor;
          }
        }
      }

      .content {
        font-size: 16px;
        color: $text-main;
        line-height: 20px;
        padding: 10px 0;
      }

      .control {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: $text-minor;

        .like {
          display: flex;
          align-items: center;
          margin-right: 20px;
          cursor: pointer;

          &.active, &:hover {
            color: $color-main;
          }

          .iconfont {
            font-size: 14px;
            margin-right: 5px;
          }
        }

        .comment-reply {
          display: flex;
          align-items: center;
          cursor: pointer;

          &:hover {
            color: $text-333;
          }

          .iconfont {
            font-size: 16px;
            margin-right: 5px;
          }
        }

      }

      .reply {
        margin: 10px 0;
        border-left: 2px solid $border-first;

        .item {
          margin: 0 10px;
          padding: 10px 0;
          border-bottom: 1px dashed $border-third;

          .reply-content {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: $text-main;

            .from-name {
              color: $color-main;
            }

            .to-name {
              color: $color-main;
              margin-left: 5px;
              margin-right: 5px;
            }
          }

          .reply-bottom {
            display: flex;
            align-items: center;
            margin-top: 6px;
            font-size: 12px;
            color: $text-minor;

            .reply-text {
              display: flex;
              align-items: center;
              margin-left: 10px;
              cursor: pointer;

              &:hover {
                color: $text-333;
              }

              .icon-comment {
                margin-right: 5px;
              }
            }
          }
        }

        .write-reply {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: $text-minor;
          padding: 10px;
          cursor: pointer;

          &:hover {
            color: $text-main;
          }

          .el-icon-edit {
            margin-right: 5px;
          }
        }

        .fade-enter-active, fade-leave-active {
          transition: opacity 0.5s;
        }

        .fade-enter, .fade-leave-to {
          opacity: 0;
        }

        .input-wrapper {
          padding: 10px;

          .gray-bg-input, .el-input__inner {
            /*background-color: #67C23A;*/
          }

          .btn-control {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-top: 10px;

            .cancel {
              font-size: 16px;
              color: $text-normal;
              margin-right: 20px;
              cursor: pointer;

              &:hover {
                color: $text-333;
              }
            }

            .confirm {
              font-size: 16px;
            }
          }
        }
      }
    }
  }
</style>
