import request from '@/utils/request'

export function getMyChat () {
  return request({
    url: '/communication',
    method: 'get'
  })
}

export function addCommunication (data) {
  return request({
    url: '/communication',
    method: 'post',
    data
  })
}
