import { defineStore } from 'pinia'

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
        resolve('Login successful!')
      })
    },
    logout(): Promise<string> {
      return new Promise((resolve) => {
        this.uid = Number(null)
        this.token = ''
        this.userInfo = {}
        resolve('Logout successful!')
      })
    },
  },
})

export { useUserInfoStore }
