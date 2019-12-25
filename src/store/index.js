import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import cart from '@/store/modules/cart'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    cart
  },
  getters
})

export default store
