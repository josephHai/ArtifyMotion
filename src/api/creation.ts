import request from '@/utils/request'

export function headTrack(data: object) {
  return request({
    url: 'headTrack',
    method: 'post',
    data,
  })
}
