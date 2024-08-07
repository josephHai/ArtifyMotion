import createAxios from '@/utils/request'
import { LoginModel, RegisterModel } from '@/api/mgr/model/userModel'

const request = createAxios('https://mgr.memefun.xyz/f/auth/')

export function login(data: LoginModel) {
  return request({
    url: 'login',
    method: 'post',
    data,
  })
}

export function register(data: RegisterModel) {
  return request({
    url: 'register',
    method: 'post',
    data,
  })
}
