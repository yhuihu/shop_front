import request from '@/utils/request'
export function getComment (data) {
  return request({
    url: '/comment/' + data,
    method: 'get'
  })
}
export function addComment (data) {
  return request({
    url: '/comment',
    method: 'post',
    data
  })
}
export function delComment (data) {
  return request({
    url: '/comment/' + data,
    method: 'delete'
  })
}
