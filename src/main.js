import Vue from 'vue'
import App from './App'
import router from './router'
import { Cascader, Button, Pagination, Checkbox, Icon, Autocomplete, Loading, Message, MessageBox, Notification, Steps, Step, Table, TableColumn, Input, Dialog, Select, Option } from 'element-ui'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import store from './store'
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Checkbox)
Vue.use(Icon)
Vue.use(Autocomplete)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Loading.directive)
Vue.use(infiniteScroll)
Vue.use(VueLazyLoad)
Vue.use(VueLazyLoad, {
  // preLoad: 1.3,
  // error: 'dist/error.png',
  loading: '/assets/load.gif'
  // attempt: 1
})
Vue.prototype.$loading = Loading.service
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.prototype.$messageBox = MessageBox
Vue.config.productionTip = false

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
