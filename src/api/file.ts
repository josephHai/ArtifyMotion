import createAxios from '@/utils/request'

const request = createAxios()

export function uploadFile(data: object) {
  return request({
    url: '/uploadFile',
    method: 'post',
    data,
  })
}

export function getFilesList(params: object) {
  return request({
    url: '/getFiles',
    method: 'get',
    params,
  })
}

export function getFileDetails(params: object) {
  return request({
    url: '/getFile',
    method: 'get',
    params,
  })
}

export function getStickerTags() {
  return request({
    url: '/getStickersTags',
    method: 'get',
  })
}

export function deleteFiles(data: object) {
  return request({
    url: '/deleteFiles',
    method: 'post',
    data,
  })
}
