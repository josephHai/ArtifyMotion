import { BaseResponse } from '@/api/baseModel'

export interface LoginResponse extends BaseResponse {
  result: {
    uid: number
    token: string
  }
}
