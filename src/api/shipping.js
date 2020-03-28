import request from '@/utils/request'
export function postShipping (data) {
  return request({
    url: '/shipping',
    method: 'post',
    data
  })
}
