import Cookies from 'js-cookie'

const TokenKey = 'token'

export const getToken = () => {
  return Cookies.get(TokenKey)
}

export const setToken = (token: string) => {
  return Cookies.set(TokenKey, token)
}

export const removeToken = () => {
  return Cookies.remove(TokenKey)
}
