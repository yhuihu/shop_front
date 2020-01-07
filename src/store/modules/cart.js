import { getCookie, setCookie } from '@/utils/auth'

const state = {
  showCart: false,
  cartList: [],
  cartPositionT: 0, // 购物车位置
  cartPositionL: 0,
  elLeft: 0,
  elTop: 0,
  moveImgUrl: null,
  receiveInCart: false
}
const mutations = {
  SET_SHOW_CART: (state, showCart) => {
    state.showCart = showCart
  },
  SET_CART_LIST: (state, name) => {
    state.cartList = name
  },
  SET_POSITION_TOP: (state, avatar) => {
    state.cartPositionT = avatar
  },
  SET_POSITION_LEFT: (state, nickName) => {
    state.cartPositionL = nickName
  },
  SET_EL_LEFT: (state, elLeft) => {
    state.elLeft = elLeft
  },
  SET_EL_TOP: (state, elTop) => {
    state.elTop = elTop
  },
  SET_RECEIVE_IN_CART: (state, receiveInCart) => {
    state.receiveInCart = receiveInCart
  },
  SET_MOVE_IMG_URL: (state, url) => {
    state.moveImgUrl = url
  }
}

const actions = {
  // 初始化购物车
  initCart ({ commit }) {
    let initCart = getCookie('buyCart')
    if (initCart) {
      commit('SET_CART_LIST', JSON.parse(initCart))
    }
  },
  addCart ({ commit }, { productId, salePrice, productName, productImg, productNum = 1 }) {
    let cart = state.cartList
    let flag = true
    let goods = {
      productId,
      salePrice,
      productName,
      productImg
    }
    if (cart.length) { // 有内容
      cart.forEach(item => {
        if (item.productId === productId) {
          if (item.productNum >= 0) {
            flag = false
            item.productNum += productNum
          }
        }
      })
    }
    if (!cart.length || flag) {
      goods.productNum = productNum
      goods.checked = '1'
      cart.push(goods)
    }
    commit('SET_CART_LIST', cart)
    // 存入localStorage
    setCookie('buyCart', cart)
  },
  addAnimation ({ commit }, { moveShow, elLeft, elTop, img, cartPositionT, cartPositionL, receiveInCart }) {
    state.showMoveImg = moveShow
    if (elLeft) {
      commit('SET_EL_LEFT', elLeft)
      commit('SET_EL_TOP', elTop)
    }
    commit('SET_MOVE_IMG_URL', img)
    commit('SET_RECEIVE_IN_CART', receiveInCart)
    if (cartPositionT) {
      commit('SET_POSITION_TOP', cartPositionT)
      commit('SET_POSITION_LEFT', cartPositionL)
    }
  },
  showCart ({ commit }, { showCart }) {
    commit('SET_SHOW_CART', showCart)
  },
  reduceCart ({ commit }, { productId }) {
    let cart = state.cartList
    cart.forEach((item, i) => {
      if (item.productId === productId) {
        if (item.productNum > 1) {
          item.productNum--
        } else {
          cart.splice(i, 1)
        }
      }
    })
    commit('SET_CART_LIST', cart)
    // 存入localStorage
    setCookie('buyCart', state.cartList)
  },
  editCart ({ commit }, { productId, productNum, checked }) {
    let cart = state.cartList
    if (productNum) {
      cart.forEach((item, i) => {
        if (item.productId === productId) {
          item.productNum = productNum
          item.checked = checked
        }
      })
    } else if (productId) {
      cart.forEach((item, i) => {
        if (item.productId === productId) {
          cart.splice(i, 1)
        }
      })
    } else {
      cart.forEach((item) => {
        item.checked = checked ? '1' : '0'
      })
    }
    commit('SET_CART_LIST', cart)
    // 存入localStorage
    setCookie('buyCart', state.cartList)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
