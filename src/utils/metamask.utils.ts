import { MetaMaskSDK, SDKProvider } from '@metamask/sdk'
import { ElMessage } from 'element-plus'
import { register } from '@/api/eth'

export class Metamask {
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
  public getAccount = async () => {
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
    const account = (accounts as string[])[0]
    const data = new FormData()
    data.append('walletAddress', account)
    await register(data)
    return account
  }
  public getChainId = async () => {
    const ethereum = window.ethereum
    const chainId = await ethereum!.request({
      method: 'eth_chainId',
    })
    return chainId as string
  }
}
