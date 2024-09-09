import createAxios from '@/utils/request'
import { UpdateInfoModel } from '../model/userModel'

const request = createAxios('https://mgr.memefun.xyz/f/user/')

export function fetchUserInfo() {
  return request({
    url: 'fetchUserInfo',
    method: 'get',
  })
}

export function updateUserInfo(data: UpdateInfoModel) {
  return request({
    url: 'modifyUserInfo',
    method: 'post',
    data,
  })
}
