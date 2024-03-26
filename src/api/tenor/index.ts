import createAxios from '@/utils/request'
import { PageParamsModel } from '@/api/tenor/model/tenorModel'

const request = createAxios('https://tenor.googleapis.com/v2/')

export function getFeatured(params: PageParamsModel) {
  return request({
    url: 'featured',
    method: 'get',
    params,
  })
}

export function getPosts(params: PageParamsModel) {
  return request({
    url: 'posts',
    method: 'get',
    params,
  })
}

export function autocomplete(params: PageParamsModel) {
  return request({
    url: 'autocomplete',
    method: 'get',
    params,
  })
}

export function search(params: PageParamsModel) {
  return request({
    url: 'search',
    method: 'get',
    params,
  })
}
