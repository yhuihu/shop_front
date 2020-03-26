import request from '@/utils/request'

export function addCart (data) {
  return request({
    url: '/cart',
    method: 'post',
    data
  })
}

export function getCart () {
  return request({
    url: '/cart',
    method: 'get'
  })
}

export function delCartChecked () {
  return request({
    url: '/cart',
    method: 'delete'
  })
}

export function cartEdit (productId, checked) {
  return request({
    url: '/cart/' + checked + '/' + productId,
    method: 'put'
  })
}

export function editCheckAll (data) {
  return request({
    url: '/cart/' + data,
    method: 'post'
  })
}

export function delCart (data) {
  return request({
    url: '/cart/' + data,
    method: 'delete'
  })
}

export function getGoodsLogs (data) {
  return request({
    url: '/goods/logs',
    method: 'get',
    params: data
  })
}

export function recommend (data) {
  return request({
    url: '/goods/recommend/' + data,
    method: 'get'
  })
}

export function getSearch (data) {
  return request({
    url: '/goods/search',
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

export function getMyGoods (data) {
  return request({
    url: '/goods',
    method: 'get',
    params: data
  })
}

export function getMyGoodsDetail (data) {
  return request({
    url: '/goods/detail/' + data,
    method: 'get'
  })
}

export function addGoods (data) {
  return request({
    url: '/goods',
    method: 'post',
    data
  })
}

export function deleteMyGoods (data) {
  return request({
    url: '/goods',
    method: 'delete',
    params: data
  })
}

export function updateMyGoods (data) {
  return request({
    url: '/goods',
    method: 'put',
    data
  })
}

export function orderList (data) {
  return request({
    url: '/order',
    method: 'get',
    params: data
  })
}

export function delOrder (data) {
  return request({
    url: '/order/' + data,
    method: 'delete'
  })
}
