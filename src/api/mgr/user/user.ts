import createAxios from '@/utils/request'

const request = createAxios('https://mgr.memefun.xyz/f/user/')

export function fetchUserInfo() {
  return request({
    url: 'fetchUserInfo',
    method: 'get',
  })
}

export function updateUserInfo(data: { username: string; email: string }) {
  return request({
    url: 'modifyUserInfo',
    method: 'post',
    data,
  })
}

export function changePassword(data: { emailCode: string; password: string }) {
  return request({
    url: 'modifyPassword',
    method: 'post',
    data,
  })
}
