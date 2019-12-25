import request from '@/utils/request'

export function getAllClassification () {
  return request({
    url: '/classification',
    method: 'get'
  })
}
