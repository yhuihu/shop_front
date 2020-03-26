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

export function getUserDetail () {
  return request({
    url: '/profile/info',
    method: 'get'
  })
}

export function updateInformation (data) {
  return request({
    url: '/profile/update',
    method: 'post',
    data
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

export function uploadToken () {
  return request({
    url: '/upload',
    method: 'get'
  })
}

export function sendEmail (data) {
  return request({
    url: '/email/' + data,
    method: 'post'
  })
}

export function register (data) {
  return request({
    url: '/profile/register',
    method: 'post',
    data
  })
}

export function sendForgetEmail (data) {
  return request({
    url: '/email/' + data,
    method: 'put'
  })
}

export function reset (data) {
  return request({
    url: '/profile/reset',
    method: 'post',
    data
  })
}
