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

interface FileModel {
  fid: number
  name: string
  media: {
    src: {
      url: string
      dims: number[]
      size: number
    }
    preview: {
      url: string
      dims: number[]
      size: number
    }
  }
  tags: string[]
  uploadUserId: number
  uploadUserName: string
  downloadCount: number
  favoritesCount: number
}

export interface UserFilesResponse extends BaseResponse {
  result: FileModel[]
}
