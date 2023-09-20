<template>
  <div class="w-75 m-auto">
    <el-card class="c-card-bg text-white border-0">
      <div>
        <el-row>
          <div class="card-title m-auto">{{ $t('message.upload') }}</div>
        </el-row>
        <el-row class="mt-1">
          <el-col :span="12" :offset="6" class="text-center">
            <el-text size="small" class="card-description text-white">
              You can upload File from local or website.
            </el-text>
          </el-col>
        </el-row>
      </div>
      <div class="card-body">
        <el-row class="text-center c-card-bg-light pt-3">
          <el-col>
            <el-icon :size="40" color="white">
              <i-ep-picture-filled />
            </el-icon>
          </el-col>
          <el-col class="mt-2">
            <span class="fw-bold">GIF</span>
          </el-col>
          <el-col class="mt-2">
            <el-text class="text-white" size="small"
              >Upload a GIF, MP4, JPEG or PNG.</el-text
            >
          </el-col>
          <el-col class="mt-3" style="height: 36px">
            <el-upload
              class="uploader"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleUpload"
            >
              <el-button
                class="w-100 c-btn-bg-warm text-white fw-bold border-0"
                style="height: 40px"
                >Select File</el-button
              >
            </el-upload>
          </el-col>
        </el-row>
        <el-row class="mt-5 c-card-bg-light px-3 py-3">
          <el-col>
            <el-text class="text-white fw-bold">Any URL</el-text>
          </el-col>
          <el-col>
            <el-text class="text-white" size="small">
              We support media URLs from GIPHY, YouTube, Vimeo, & many others!
            </el-text>
          </el-col>
          <el-col>
            <el-input
              v-model="parseUrl"
              :placeholder="$t('tips.input')"
              class="searchBox"
              size="large"
              @input="parseUrlChange"
            >
            </el-input>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import router from '@/router'
import { useUploadFileStore } from '@/stores'

const parseUrl = ref<string>('')
const uploadFileStore = useUploadFileStore()

const parseUrlChange = () => {
  if (parseUrl.value.indexOf('.gif') != -1) {
    isImageUrl(parseUrl.value).then((res) => {
      if (res) {
        fetch(parseUrl.value).then((res) => {
          res.blob().then((blob) => {
            uploadFileStore.url = parseUrl.value
            uploadFileStore.file = new File([blob], '', { type: blob.type })
            router.push({
              name: 'finalize',
            })
          })
        })
      } else {
        console.log('not url')
      }
    })
  }
}

const handleUpload = (uploadFile) => {
  const reader = new FileReader()

  reader.readAsDataURL(uploadFile.raw)

  reader.onload = (e) => {
    uploadFileStore.updateUploadFile(
      '',
      e.target?.result.toString(),
      uploadFile
    )
    router.push({
      name: 'finalize',
    })
  }
}

const isImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'GET' })

    if (response.ok) {
      const contentType = response.headers.get('content-type')
      return (
        contentType?.startsWith('image/') ||
        contentType?.startsWith('video/') ||
        false
      )
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}
</script>

<style scoped lang="less">
.card-header {
  margin-top: 3%;
}
.card-title {
  font-size: 2rem;
  text-align: center;
  font-weight: bold;
}
.card-description {
  word-break: keep-all;
}
.searchBox {
  margin-top: 20px;
}
.card-body {
  width: 90%;
  margin: 3% auto auto;
  padding-bottom: 2%;
}
.uploader {
  :deep(.el-upload) {
    width: 100%;
  }
}
</style>
