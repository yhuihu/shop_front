import request from '@/utils/request'
export function addFollow (data) {
  return request({
    url: '/follow/' + data,
    method: 'post'
  })
}

export function checkFollow (data) {
  return request({
    url: '/follow/' + data,
    method: 'get'
  })
}

export function getMyFollow () {
  return request({
    url: '/follow',
    method: 'get'
  })
}

export function unFollow (data) {
  return request({
    url: '/follow/' + data,
    method: 'delete'
  })
}

export function getOtherInfo (data) {
  return request({
    url: '/goods/other/' + data,
    method: 'get'
  })
}
