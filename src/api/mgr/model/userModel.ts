export interface UserInfoModel {
  username: string
  avatar?: string
  phoneNumber?: string
  email: string
  address?: string
  userType?: string
}

export interface LoginModel {
  email: string
  password: string
}

export interface RegisterModel {
  username: string
  email: string
  password: string
  confirmPassword: string
  profile?: number
  address?: string
  emailCode: string
}
