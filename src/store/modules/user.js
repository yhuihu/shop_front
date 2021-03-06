import { login, logout, getInfo } from '@/api/user'
import { getCookie, setCookie, removeCookie } from '@/utils/auth'

const state = {
  token: getCookie('SECOND_HAND_USER_TOKEN'),
  id: getCookie('SECOND_HAND_USER_ID'),
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
  },
  SET_ID: (state, id) => {
    state.id = id
  }
}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(res => {
        if (res.code !== 20000) {
          reject(res)
        } else {
          commit('SET_TOKEN', res.data.token)
          setCookie('SECOND_HAND_USER_TOKEN', res.data.token)
          setCookie('SECOND_HAND_USER_ROLE', res.data.role[0])
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
          commit('SET_ID', response.data.id)
          setCookie('SECOND_HAND_USER_ID', response.data.id)
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
        removeCookie('SECOND_HAND_USER_ID')
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
      removeCookie('SECOND_HAND_USER_ID')
      resolve()
    })
  },

  setAvatar ({ commit }, avatarUrl) {
    return new Promise(resolve => {
      commit('SET_AVATAR', avatarUrl)
      removeCookie('SECOND_HAND_USER_TOKEN')
      removeCookie('SECOND_HAND_USER_ID')
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
