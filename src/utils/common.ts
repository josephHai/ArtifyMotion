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