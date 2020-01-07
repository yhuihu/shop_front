import axios from 'axios'
import store from '@/store'
import { getCookie } from '@/utils/auth'
import { Message, MessageBox } from 'element-ui'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_SERVER,
  timeout: 10000// request timeout
})
service.defaults.headers.post['Content-Type'] = 'application/x-www=form-urlencoded'
// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['authorization'] = 'Bearer ' + getCookie('SECOND_HAND_USER_TOKEN')
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// response interceptor
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      const res = response.data
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      // to re-login
        MessageBox.confirm('登录过期', '退出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return response.data
    } else {
      return Promise.reject(new Error(response.data.message || 'Error'))
    }
  },
  error => {
    Message({
      message: '网络请求错误，请稍后重试',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
