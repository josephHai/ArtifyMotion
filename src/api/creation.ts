import createAxios from '@/utils/request'

const request = createAxios()

export function headTrack(data: object) {
  return request({
    url: 'headTrack',
    method: 'post',
    data,
  })
}
