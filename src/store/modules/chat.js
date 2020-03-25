import { getMyChat } from '@/api/chat'
const state = {
  // 这个是聊天界面的联系人列表
  userList: [],
  // 联系人：聊天内容
  chatList: {}
}
const mutations = {
  SET_USER_LIST: (state, userList) => {
    state.userList = userList
  },
  SET_CHAT_LIST: (state, chatList) => {
    state.chatList = chatList
  },
  ADD_CHAT: (state, chatData) => {
    state.userList = chatData
  }
}
const actions = {
  initChat ({ commit }, data) {
    return new Promise((resolve, reject) => {
      getMyChat().then(res => {
        if (res.code === 20000) {
          commit('SET_USER_LIST', res.data.userList)
          commit('SET_CHAT_LIST', res.data.chatMap)
        } else {
          reject(res)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  addChatUser ({ commit }, chatUserData) {
    let chatUser = state.userList
    if (chatUser.length) {
      let flag = true
      for (let i = 0; i < chatUser.length; i++) {
        if (chatUser[i].userId === chatUserData.userId) {
          flag = false
          break
        }
      }
      if (flag) {
        chatUser.push(chatUserData)
        commit('ADD_CHAT', chatUser.sort(function (a, b) {
          let x = a.createTime
          let y = b.createTime
          return x > y ? -1 : x < y ? 1 : 0
        }))
      }
    }
  },
  addChatData ({ commit }, chatData) {
    let allData = state.chatList
    let existChatData = state.chatList[chatData.id]
    if (!existChatData) {
      allData[chatData.id] = []
    }
    allData[chatData.id].push(chatData)
    state.chatList = allData
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
