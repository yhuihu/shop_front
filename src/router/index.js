import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: '首页',
    component: () => import('@/view/index')
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('@/view/login/login')
  },
  {
    path: '/register',
    name: '注册',
    component: () => import('@/view/login/register')
  },
  {
    path: '/forget',
    name: '忘记密码',
    component: () => import('@/view/login/forget')
  },
  {
    path: '/search',
    name: '搜索商品',
    component: () => import('@/view/search/search')
  },
  {
    path: '/goods',
    name: '所有商品',
    component: () => import('@/view/goods/goods')
  },
  {
    path: '/refreshSearch',
    name: '刷新搜索结果',
    component: () => import('@/view/refresh/searchRefresh')
  },
  {
    path: '/goodsDetails',
    name: '商品详情',
    component: () => import('@/view/goods/goodsDetails')
  },
  {
    path: '/cart',
    name: '购物车',
    component: () => import('@/view/cart/cart')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/view/user/user'),
    redirect: '/user/information',
    children: [
      {
        path: 'information',
        name: '账户资料',
        component: () => import('@/view/user/children/information')
      },
      {
        path: 'orderList',
        name: '订单列表',
        component: () => import('@/view/user/children/orderList')
      },
      {
        path: 'orderDetail',
        name: '订单详情',
        component: () => import('@/view/user/children/orderDetail')
      },
      {
        path: 'myGoods',
        name: '我的闲置物品',
        component: () => import('@/view/user/children/myGoods')
      },
      {
        path: 'publishGoods',
        name: '处理闲置物品',
        component: () => import('@/view/user/children/addGoods')
      },
      {
        path: 'addressList',
        name: '收货地址',
        component: () => import('@/view/user/children/addressList')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
