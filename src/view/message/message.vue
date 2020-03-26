<template>
  <div>
    <div style="margin-top:20px;width: 60%;min-width:600px;margin-left: auto;margin-right: auto">
      <y-shelf title="消息中心">
        <div slot="content">
          <el-container style="height:700px">
            <el-aside width="200px" style="overflow:hidden;">
              <div class="radius el-icon-bell" style="text-align: center;color: dodgerblue"
                   @click="changeTarget('SECOND_HAND_MESSAGE',-1)" v-bind:class="{ bgColors:current===-1}">系统消息
              </div>
              <div class="radius" @click="changeTarget(item,index)" :key="item.nickName"
                   v-for="(item,index) in userList" v-bind:class="{ bgColors:index===current}">
                <el-avatar :size="50" style="float: left;margin-top: 12px;margin-left: 5px"
                           :src="item.icon"></el-avatar>
                <span style="margin-left: 10px;">{{item.nickName}}</span>
              </div>
            </el-aside>
            <el-container>
              <el-aside style="width:10px"></el-aside>
              <el-container>
                <el-header style="text-align: center;font-size: 16px">
                  <span v-if="current!==-1">和 {{targetName}} 的对话</span>
                  <span v-else>系统消息</span>
                </el-header>
                <el-main v-if="current!==-1" id="chatDiv">
                  <el-row :key="item1.id+item1.content+item1.createTime" v-for="item1 in chatData">
                    <el-col v-if="item1.isMine===0" :span="24" style="margin-top:10px">
                      <el-avatar :size="50" style="float: left"
                                 :src="item1.icon"></el-avatar>
                      <div class="tooltip fade right in">
                        <div class="tooltip-inner msg-chat clearfix">
                          <div class="chat-content nc-post-content js-nc-pop-image"
                               style="text-align: left;word-break: break-all;">
                            <div v-if="item1.contentType===1">
                              <el-image style="width: 100px; height: 100px" :src="item1.content"
                                        :preview-src-list="[item1.content]"></el-image>
                            </div>
                            <div v-else>
                              {{item1.content}}
                            </div>
                          </div>
                        </div>
                        <div class="msg-info">
                          <span>{{item1.createTime}}</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col v-else :span="24" style="margin-top:10px">
                      <el-avatar :size="50" style="float: right"
                                 :src="item1.icon"></el-avatar>
                      <div class="tooltip fade right in" style="float: right;margin-right: 10px">
                        <div class="tooltip-inner msg-chat clearfix">
                          <div class="chat-content nc-post-content js-nc-pop-image"
                               style="text-align: left;word-break: break-all;">
                            <div v-if="item1.contentType===1">
                              <el-image style="width: 100px; height: 100px" :src="item1.content"
                                        :preview-src-list="[item1.content]"></el-image>
                            </div>
                            <div v-else>
                              {{item1.content}}
                            </div>
                          </div>
                        </div>
                        <div class="msg-info">
                          <span>{{item1.createTime}}</span>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </el-main>
                <el-main v-if="current===-1">
                  <el-row :key="item1.id" v-for="item1 in chatData">
                    <el-col :span="24" style="margin-top:10px">
                      <div class="msg-item clearfix msg-sys-item">
                        <div class="msg-content">
                          <div class="cont nc-post-content">{{item1.content}}
                            <a href="https://www.nowcoder.com/profile/975009667/badges?type=3&amp;badgeId=23">点击查看</a>
                          </div>
                          <p><span class="time">{{item1.createTime}}</span></p></div>
                      </div>
                    </el-col>
                  </el-row>
                </el-main>
                <el-footer style="height: 200px;" v-if="current!==-1">
                  <el-upload
                    :action=this.uploadUrl
                    :show-file-list="false"
                    :data="{
                          token: this.uploadToken,
                          key: this.uploadKey
                        }"
                    style="margin-top:5px"
                    :on-success="imagesUploadSuccess"
                    :before-upload="beforeUpload">
                    <el-button style="margin-left: 10px" size="small" type="primary" class="el-icon-picture"/>
                  </el-upload>
                  <el-input
                    v-model="content"
                    type="textarea"
                    autofocus
                    clearable
                    style="margin-top: 10px"
                    maxlength="200"
                    show-word-limit
                    :autosize="{minRows:4,maxRows:4}"
                    resize="none"
                    placeholder="在这里输入..."
                  />
                  <div style="width: 100%;text-align: center;margin-top:10px">
                    <el-button type="primary" @click="submitMessage()">发送</el-button>
                  </div>
                </el-footer>
              </el-container>
            </el-container>
          </el-container>
        </div>
      </y-shelf>
    </div>
  </div>
</template>

<script>
import YShelf from '@/components/shelf'
import { mapGetters } from 'vuex'
import { addCommunication } from '@/api/chat'
import { uploadToken } from '@/api/user'

export default {
  data () {
    return {
      uploadUrl: 'http://upload-z2.qiniu.com/',
      myId: this.id,
      current: -1,
      targetName: '',
      targetId: '',
      targetIcon: '',
      content: '',
      uploadToken: '',
      uploadKey: '',
      chatData: {}
    }
  },
  components: {
    YShelf
  },
  methods: {
    changeTarget (target, index) {
      this.current = index
      if (target === 'SECOND_HAND_MESSAGE') {
        this.targetName = ''
        this.targetId = ''
        this.targetIcon = ''
        this.chatData = this.chatList['SECOND_HAND_MESSAGE']
      } else {
        this.targetName = target.nickName
        this.targetId = target.userId
        this.targetIcon = target.icon
        this.chatData = this.chatList[target.userId]
        this.scrollToBottom()
      }
    },
    submitMessage () {
      let params = {
        fromId: this.id,
        fromNickName: this.nickName,
        fromIcon: this.avatar,
        content: this.content,
        contentType: 0,
        toId: this.targetId,
        toNickName: this.targetName,
        toIcon: this.targetIcon
      }
      addCommunication(params).then(res => {
        if (res.code === 20000) {
          this.$root.$message.success('发送成功')
        } else {
          this.$root.$message.error('发送失败，请检查网络')
        }
      })
    },
    async beforeUpload (file) {
      let arr = ['jpg', 'jpeg', 'png', 'bmp', 'JPG', 'JPEG', 'PNG', 'BMP']
      const target = file.name.substring(file.name.lastIndexOf('.') + 1)
      const isImg = arr.includes(target)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImg) {
        this.$message.error('上传图片格式错误!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      if (isImg && isLt2M) {
        if (!this.uploadToken) {
          await uploadToken().then(res => {
            if (res.code === 20000) {
              this.uploadToken = res.message
              let date = new Date()
              this.uploadKey = this.getuuid() + date.getDate()
            }
          })
        }
      } else {
        return false
      }
    },
    imagesUploadSuccess (res, file) {
      if (file.response) {
        let params = {
          fromId: this.id,
          fromNickName: this.nickName,
          fromIcon: this.avatar,
          content: 'http://cloud.yhhu.xyz/' + res.key,
          contentType: 1,
          toId: this.targetId
        }
        addCommunication(params).then(res => {
          if (res.code === 20000) {
            this.$root.$message.success('发送成功')
          } else {
            this.$root.$message.error('发送失败，请检查网络')
          }
        })
      }
    },
    getuuid () {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'

      var uuid = s.join('')
      return uuid
    },
    scrollToBottom () {
      this.$nextTick(() => {
        let msg = document.getElementById('chatDiv') // 获取对象
        msg.scrollTop = msg.scrollHeight // 滚动高度
      })
    },
    initPage () {
      let flag = this.$route.params.targetId && this.$route.params.nickName && this.$route.params.icon
      console.log(flag)
      if (flag) {
        console.log('in')
        this.targetName = this.$route.params.nickName
        this.targetId = this.$route.params.targetId
        this.targetIcon = this.$route.params.icon
        this.chatData = this.chatList[this.targetId]
        let userListData = this.userList
        let that = this
        for (let i = 0; i < userListData.length; i++) {
          if (userListData[i].userId === this.targetId) {
            that.current = i
            break
          }
        }
      } else {
        this.chatData = this.chatList['SECOND_HAND_MESSAGE']
      }
    }
  },
  update: function () {
    this.scrollToBottom()
  },
  created () {
    this.initPage()
  },
  computed: {
    ...mapGetters([
      'userList', 'chatList', 'id', 'nickName', 'avatar'
    ])
  }
}
</script>

<style scoped>
  .main {
    background: white;;
  }

  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

  .el-footer {
    background-color: #B3C0D1;
  }

  .radius {
    height: 80px;
    width: 100%;
    font-size: 16px;
    line-height: 80px;
  }

  .radius:hover {
    cursor: pointer;
    background-color: #B3C0D1;
  }

  .bgColors {
    background-color: #B3C0D1
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .msg-chatlist .tooltip.tooltip.right {
    padding: 0;
    margin: 0;
  }

  .msg-chatlist .tooltip {
    position: relative;
    float: left;
  }

  .tooltip {
    float: left;
    margin-left: 10px;
    display: block;
    line-height: 1.4;
    visibility: visible;
    font-size: 14px;
    z-index: 99;
  }

  .msg-chatlist .tooltip.tooltip.right .tooltip-arrow {
    border-right-color: #ebf8f5;
    left: -10px;
    margin-top: -35px;
    border-width: 5px 10px;
    top: 50px;
  }

  .tooltip.right .tooltip-arrow {
    content: "";
    height: 0;
    width: 0;
    border-right: 9px solid #34495e;
    border-top: 9px dashed transparent;
    border-bottom: 9px dashed transparent;
    margin-top: -9px;
    left: -4px;
    top: 50%;
  }

  .tooltip-arrow, .tooltip-arrow i {
    position: absolute;
  }

  .msg-chat {
    background: #ebf8f5;
    max-width: 537px;
    padding: 10px;
    text-align: left;
    color: #666;
  }

  .tooltip-inner {
    color: #fff;
    text-align: center;
    background-color: #34495e;
    line-height: 18px;
    padding: 10px;
    text-align: center;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    font-size: 12px;
    box-shadow: 0 0 5px #f0f0f0;
  }

  .clearfix {
    display: block;
    zoom: 1;
  }

  .msg-info {
    margin-top: 10px;
    color: #999;
    font-size: 12px;
  }

  .msg-item {
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
  }

  .msg-sys-item .msg-content {
    margin-left: 0;
  }

  .msg-content {
    margin-left: 70px;
    font-size: 14px;
  }

  .msg-content .cont {
    margin-bottom: 10px;
  }

  .nc-post-content {
    font-size: 14px;
  }

  .msg-content .time {
    float: right;
    color: #aaa;
    font-weight: 400;
  }
</style>
