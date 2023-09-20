import { ElMessage } from 'element-plus'
const service = (
  url: string,
  data?: string | ArrayBufferLike | ArrayBufferView | Blob,
  protocols?: string | string[]
): Promise<WebSocket> => {
  url = 'ws://' + import.meta.env.VITE_API_WS_BASE_URL + url
  return new Promise<WebSocket>((resolve, reject) => {
    const socket = new WebSocket(url, protocols)
    socket.onopen = () => {
      console.log('Websocket is open now')
      if (data) socket.send(data)
      resolve(socket)
    }

    socket.onclose = () => {
      console.log('Websocket is closed now.')
    }

    socket.onerror = (e) => {
      ElMessage({
        message: 'failed to connect websocket.Please connect administrators.',
        type: 'error',
        duration: 5 * 1000,
      })
      console.log(e)
      reject(new Error('WebSocket connection error'))
    }
  })
}

export default service
