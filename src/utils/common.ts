import router from '@/router'
import { RouteParamsRaw } from 'vue-router'

export const generateRandomString = (len?: number) => {
  if (!len) len = 8
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let randomString = ''
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomString += characters.charAt(randomIndex)
  }
  return randomString
}

export const imgEl2Base64 = (el: HTMLImageElement, type: string) => {
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = el.width
  tempCanvas.height = el.height

  const ctx = tempCanvas.getContext('2d')
  ctx?.drawImage(el, 0, 0)
  return tempCanvas.toDataURL(type)
}

export const eth2weiHex = (n: number): string => {
  return (BigInt(n) * 1000000000000000000n).toString(16)
}

export const url2filename = (url: string): string => {
  const urlObj = new URL(url)
  const pathName = urlObj.pathname

  return pathName.split('/').pop() as string
}

export const navigateTo = (name: string, params?: RouteParamsRaw) => {
  router.push({
    name,
    params,
  })
}

// eslint-disable-next-line no-unused-vars
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
  // eslint-disable-next-line no-unused-vars
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return function (this: any, ...args: Parameters<T>) {
    // 明确 this 的类型
    if (!inThrottle) {
      func.apply(this, args) // 使用 apply 函数来传递 args
      inThrottle = true // 将 inThrottle 设为 true
      setTimeout(() => {
        inThrottle = false // 在定时器结束后重置 inThrottle
      }, limit)
    }
  }
}
