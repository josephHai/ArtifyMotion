export interface UserInfoModel {
  username: string
  profile: string
  phoneNumber?: string
  email: string
  address?: string
  userType?: string
}

export interface AuthModel {
  email: string
  password: string
}
