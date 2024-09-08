import { defineStore } from 'pinia'
import { setToken, removeToken } from '@/utils/auth'
import { UserInfoModel } from '@/api/mgr/model/userModel'

const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    uid: Number(null),
    token: '',
    userInfo: {},
  }),
  getters: {},
  actions: {
    login(uid: number, token: string): Promise<string> {
      return new Promise((resolve) => {
        this.uid = uid
        this.token = token
        setToken(token)
        resolve('Login successful!')
      })
    },
    logout(): Promise<string> {
      return new Promise((resolve) => {
        this.uid = Number(null)
        this.token = ''
        this.userInfo = {}
        removeToken()
        resolve('Logout successful!')
      })
    },
    setUserInfo(userInfo: UserInfoModel): void {
      this.userInfo = userInfo
    },
  },
})

export { useUserInfoStore }
