import { defineStore } from 'pinia'
import { MetaMaskSDK, SDKProvider } from '@metamask/sdk'
import { ElMessage } from 'element-plus'

class Metamask {
  private static instance: Metamask
  private sdk: MetaMaskSDK
  private ethereum: SDKProvider | undefined

  private constructor() {
    this.sdk = new MetaMaskSDK({
      dappMetadata: {
        name: 'memefun',
        url: window.location.host,
      },
      logging: {
        developerMode: true,
      },
      injectProvider: true,
    })
    this.sdk.init().then(() => {
      this.ethereum = this.sdk.getProvider()
    })
  }
  public static getInstance = (): Metamask => {
    if (!this.instance) {
      this.instance = new Metamask()
    }
    return this.instance
  }

  public getEthereum = async () => {
    return this.ethereum
  }
}

export const useMetamaskStore = defineStore('metamask', {
  state: () => ({
    accounts: <string[]>[],
    ethereum: SDKProvider,
  }),
  getters: {
    account: (state) => {
      return state.accounts[0]
    },
  },
  actions: {
    async getAccount() {
      if (!this.accounts.length) await this.updateAccount()
      return this.accounts[0]
    },
    async updateAccount() {
      const ethereum = window.ethereum
      const accounts = await ethereum!
        .request({
          method: 'eth_requestAccounts',
        })
        .catch((err) => {
          if (err.code === 4001) {
            ElMessage({
              type: 'info',
              message: 'Please connect to MetaMask',
              duration: 3 * 1000,
            })
          }
          return []
        })
      this.accounts = accounts as string[]
    },
    async getEthereum() {
      const metamask = Metamask.getInstance()
      return await metamask.getEthereum()
    },
  },
})
