import request from '@/utils/request'

export function register(data: object) {
  return request({
    url: 'eth/register',
    method: 'post',
    data,
  })
}

export function orderRecord(data: object) {
  return request({
    url: 'eth/orderRecord',
    method: 'post',
    data,
  })
}
