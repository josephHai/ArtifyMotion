import { BaseResponse } from '@/api/baseModel'
import { UserInfoModel } from './userModel'

export interface LoginResponse extends BaseResponse {
  result: {
    uid: number
    token: string
  }
}

export interface FetchUserInfoResponse extends BaseResponse {
  result: UserInfoModel
}
