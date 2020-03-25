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
