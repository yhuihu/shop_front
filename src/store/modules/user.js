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
      login({ username: username.trim(), password: password }).then(res => {
        if (res.code !== 20000) {
          reject(res.message)
        } else {
          commit('SET_TOKEN', res.data.token)
          setCookie('SECOND_HAND_USER_TOKEN', res.data.token)
        }
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        if (response.code !== 20000) {
          reject(response.message)
        } else {
          commit('SET_NAME', response.data.name)
          commit('SET_AVATAR', response.data.avatar)
          commit('SET_NICK_NAME', response.data.nickName)
          resolve(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout ({ commit }) {
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
