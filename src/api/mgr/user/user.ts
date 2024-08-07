import createAxios from '@/utils/request'

const request = createAxios('https://mgr.memefun.xyz/f/user/')

export function fetchUserInfo() {
  console.log('fetchUserInfo')
  return request({
    url: 'fetchUserInfo',
    method: 'get',
  })
}
