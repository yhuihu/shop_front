import request from '@/utils/request'

export function recommend (data) {
  return request({
    url: '/goods/recommend/' + data,
    method: 'get'
  })
}

export function getSearch (data) {
  return request({
    url: '/goods',
    method: 'get',
    params: data
  })
}

export function productDet (data) {
  return request({
    url: '/goods/' + data,
    method: 'get'
  })
}

export function addCart (data) {
  return request({
    url: '/cart',
    method: 'post',
    data
  })
}
