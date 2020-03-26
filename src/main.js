import Vue from 'vue'
import App from './App'
import router from './router'
import { getCookie } from '@/utils/auth'
import 'element-ui/lib/theme-chalk/index.css'
import {
  Avatar,
  Cascader,
  Button,
  ButtonGroup,
  Pagination,
  Checkbox,
  Container,
  Main,
  Aside,
  Header,
  Menu,
  MenuItem,
  Submenu,
  Footer,
  Icon,
  Autocomplete,
  Loading,
  Message,
  MessageBox,
  Notification,
  Steps,
  Step,
  Table,
  Tag,
  Popconfirm,
  Image,
  TableColumn,
  Input,
  Row,
  Col,
  Form,
  FormItem,
  Radio,
  RadioGroup,
  Upload,
  Dialog,
  Select,
  Option
} from 'element-ui'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import store from './store'
Vue.use(Avatar)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Pagination)
Vue.use(Checkbox)
Vue.use(Container)
Vue.use(Main)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Footer)
Vue.use(Icon)
Vue.use(Autocomplete)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tag)
Vue.use(Popconfirm)
Vue.use(Image)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Upload)
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
Vue.prototype.$websocket = null

const whiteList = ['/', '/home', '/goods', '/login', '/register', '/goodsDetails', '/search', '/refreshsearch', '/refreshgoods', '/follow/detail'] // 不需要登陆的页面
router.beforeEach(function (to, from, next) {
  if (to.path === '/login' || to.path === '/register') {
    if (getCookie('SECOND_HAND_USER_TOKEN') !== undefined) {
      next('/home')
    }
    next()
  } else if (to.path.startsWith('/follow/detail')) {
    next()
  } else if (whiteList.indexOf(to.path) !== -1) { // 白名单
    next()
  } else {
    if (getCookie('SECOND_HAND_USER_TOKEN') !== undefined) {
      next()
    } else { next('/login') }
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
  closed () {
    // 关闭 websocket
    if (Vue.prototype.$webscoket !== null) {
      Vue.prototype.$webscoket.close()
    }
  }
}).$mount('#app')
