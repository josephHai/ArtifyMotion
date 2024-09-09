import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, removeToken } from './auth'
import { navigateTo } from './common'

const createAxios = (baseUrl?: string) => {
  const service = axios.create({
    baseURL: baseUrl || import.meta.env.VITE_API_BASE_URL, // url = base url + request url
    timeout: 30000, // request timeout
  })

  // request interceptor
  service.interceptors.request.use(
    (config) => {
      const token = getToken()
      if (token && !config.baseURL!.includes('tenor'))
        config.headers['token'] = token
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // response interceptor
  service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     */
    (response) => {
      const res = response.data

      if (response.config.baseURL!.includes('tenor')) {
        return Promise.resolve(res)
      }

      // if the custom code is not 200, it is judged as an error.
      if (res.code === 401) {
        removeToken()
        navigateTo('/login')
        ElMessage({
          message: res['message'] || 'Error',
          type: 'error',
          duration: 3 * 1000,
        })
        return Promise.reject(res['message'])
      } else if (res.code !== 200) {
        ElMessage({
          message: res['message'] || 'Error',
          type: 'error',
          duration: 3 * 1000,
        })
        return Promise.reject(res['message'])
      } else {
        return Promise.resolve(res)
      }
    },
    (error) => {
      ElMessage({
        message: error.message,
        type: 'error',
        duration: 3 * 1000,
      })
      return Promise.reject(error)
    }
  )

  return service
}

export default createAxios
