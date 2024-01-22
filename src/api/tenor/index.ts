import request from '@/utils/request'
import { PageParamsModel } from '@/api/tenor/model/tenorModel'

const TENOR_BASE_API = 'https://tenor.googleapis.com/v2/'

export function getFeatured(params: PageParamsModel) {
  return request({
    url: TENOR_BASE_API + 'featured',
    method: 'get',
    params,
  })
}

export function getPosts(params: PageParamsModel) {
  return request({
    url: TENOR_BASE_API + 'posts',
    method: 'get',
    params,
  })
}

export function autocomplete(params: PageParamsModel) {
  return request({
    url: TENOR_BASE_API + 'autocomplete',
    method: 'get',
    params,
  })
}

export function search(params: PageParamsModel) {
  return request({
    url: TENOR_BASE_API + 'search',
    method: 'get',
    params,
  })
}
