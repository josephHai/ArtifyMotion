import { defineStore } from 'pinia'

export const useUploadFileStore = defineStore('uploadFile', {
  state: () => ({
    url: '',
    localUrl: '',
    file: {} as File,
    group: '',
  }),
  getters: {},
  actions: {
    updateUploadFile(
      newUrl: string,
      newLocalUrl: string,
      newFile: File,
      group?: string
    ): Promise<string> {
      return new Promise((resolve) => {
        this.url = newUrl
        this.localUrl = newLocalUrl
        this.file = newFile
        this.group = group || 'gallery'
        resolve('Async Done')
      })
    },
    updateUploadFileSync(newUrl: string, newLocalUrl: string, newFile: File) {
      this.url = newUrl
      this.localUrl = newLocalUrl
      this.file = newFile
    },
  },
})
