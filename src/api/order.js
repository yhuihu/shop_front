import request from '@/utils/request'
export function addOrder (data) {
  return request({
    url: '/order',
    method: 'post',
    data
  })
}

export function getCheckOrder (data) {
  return request({
    url: '/order/byGroup/' + data,
    method: 'get'
  })
}

export function checkOrder (data) {
  return request({
    url: '/order/' + data,
    method: 'put'
  })
}

export function orderList (data) {
  return request({
    url: '/order',
    method: 'get',
    params: data
  })
}

export function pay (data1, data2) {
  return request({
    url: '/order/pay/' + data1 + '/' + data2,
    method: 'post'
  })
}

export function deleteOrder (data1, data2) {
  return request({
    url: '/order/' + data1 + '/' + data2,
    method: 'delete'
  })
}

export function getOrderDet (data) {
  return request({
    url: '/order/' + data,
    method: 'get'
  })
}

export function checkGetOrder (data) {
  return request({
    url: '/shipping/' + data,
    method: 'put'
  })
}
