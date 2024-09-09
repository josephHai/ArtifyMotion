import { defineStore } from 'pinia'
import { setToken, removeToken } from '@/utils/auth'
import { UserInfoModel } from '@/api/mgr/model/userModel'
import { login, fetchUserInfo } from '@/api/mgr/user'
import { FetchUserInfoResponse, LoginResponse } from '@/api/mgr/model/result'
import { navigateTo } from '@/utils/common'

const useUserStore = defineStore('userInfo', {
  persist: true,
  state: () => ({
    uid: Number(null),
    token: '',
    userInfo: {} as UserInfoModel,
  }),
  getters: {},
  actions: {
    async login(email: string, password: string): Promise<void> {
      try {
        const loginRes = (await login({
          email,
          password,
        })) as unknown as LoginResponse
        const { token, uid } = loginRes.result
        setToken(token)
        this.uid = uid
        this.token = token
        const fetchUserInfoRes =
          (await fetchUserInfo()) as unknown as FetchUserInfoResponse
        this.userInfo = fetchUserInfoRes.result
      } catch (error) {
        console.error('Login failed:', error)
      }
    },
    logout(): void {
      this.uid = Number(null)
      this.token = ''
      this.userInfo = {} as UserInfoModel
      removeToken()
      navigateTo('/')
    },
  },
})

export { useUserStore }
