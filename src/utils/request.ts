import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // url = base url + request url
  timeout: 30000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
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

    if (response.config.url!.includes('tenor')) {
      return Promise.resolve(res)
    }

    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 200) {
      ElMessage({
        message: res['message'] || 'Error',
        type: 'error',
        duration: 5 * 1000,
      })
      return Promise.reject(res['message'])
    } else {
      return res
    }
  },
  (error) => {
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 10 * 1000,
    })
    return Promise.reject(error)
  }
)

export default service
