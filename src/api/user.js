import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo () {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function logout () {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getAddress () {
  return request({
    url: '/address',
    method: 'get'
  })
}

export function addAddress (data) {
  return request({
    url: '/address',
    method: 'post',
    data
  })
}

export function deleteAddress (data) {
  return request({
    url: '/address?addressId=' + data,
    method: 'delete'
  })
}
