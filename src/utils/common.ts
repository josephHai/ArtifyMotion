import router from '@/router'

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

export const navigateTo = (name, params) => {
  router.push({
    name,
    params,
  })
}
