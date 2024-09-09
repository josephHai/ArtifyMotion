import { defineStore } from 'pinia'
import { setToken, removeToken } from '@/utils/auth'
import { UserInfoModel } from '@/api/mgr/model/userModel'
import { login, fetchUserInfo } from '@/api/mgr/user'
import { FetchUserInfoResponse, LoginResponse } from '@/api/mgr/model/result'
import router from '@/router'

const useUserStore = defineStore('userInfo', {
  persist: true,
  state: () => ({
    uid: Number(null),
    token: '',
    info: {} as UserInfoModel,
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
        this.info = fetchUserInfoRes.result
      } catch (error: any) {
        throw new Error(error.message)
      }
    },
    logout(): void {
      this.uid = Number(null)
      this.token = ''
      this.info = {} as UserInfoModel
      removeToken()
      router.push('/')
    },
    updateInfo(userInfo: UserInfoModel): void {
      this.info = { ...this.info, ...userInfo }
    },
  },
})

export { useUserStore }
