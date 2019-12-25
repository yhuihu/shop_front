import { login, logout, getInfo } from '@/api/user'
import { getCookie, setCookie, removeCookie } from '@/utils/auth'

const state = {
  token: getCookie('SECOND_HAND_USER_TOKEN'),
  name: '',
  avatar: '',
  nickName: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_NICK_NAME: (state, nickName) => {
    state.nickName = nickName
  }
}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setCookie('SECOND_HAND_USER_TOKEN', data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject(new Error('获取个人信息失败，请重试.'))
        }
        const { name, avatar, nickName } = data
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_NICK_NAME', nickName)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        removeCookie('SECOND_HAND_USER_TOKEN')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeCookie('SECOND_HAND_USER_TOKEN')
      resolve()
    })
  },

  setAvatar ({ commit }, avatarUrl) {
    return new Promise(resolve => {
      commit('SET_AVATAR', avatarUrl)
      removeCookie('SECOND_HAND_USER_TOKEN')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
