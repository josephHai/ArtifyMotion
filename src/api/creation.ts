import request from '@/utils/request'
import ws from '@/utils/ws'

export function faceDetect(data: object) {
  return request({
    url: 'detect',
    method: 'post',
    data,
  })
}

export function faceExtract(data: object) {
  return request({
    url: 'extract',
    method: 'post',
    data,
  })
}

export function picFusion(data?: string) {
  return ws('/ws/fusion', data)
}
