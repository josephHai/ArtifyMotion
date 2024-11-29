<template>
  <div
    class="w-75 m-auto card mt-12 pb-16"
    v-loading="parseUrlLoading"
    element-loading-background="rgba(36, 36, 36, 0.8)"
    element-loading-spinner="el-icon-loading"
    element-loading-custom-class="c-fs-loading"
  >
    <div>
      <div class="mt-5">
        <el-row>
          <div class="m-auto">
            <curve
              :width="360"
              :text="targetRoute === 'creation' ? 'Creation' : 'Upload'"
              custom-style="color: #E7FF25;"
            />
          </div>
        </el-row>
        <el-row class="mt-1">
          <el-col :span="12" :offset="6" class="text-center">
            <div class="card-description">
              You can upload File from local or website.
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="w-5/6 mx-auto mt-5">
        <el-row class="text-center pt-3 pb-10 card-item">
          <el-col>
            <el-icon :size="40" color="black">
              <i-ep-picture-filled />
            </el-icon>
          </el-col>
          <el-col class="mt-2">
            <span class="font-bold text-black card-item-title">GIF</span>
          </el-col>
          <el-col class="mt-2">
            <div class="text-black card-item-description">
              Upload a GIF, MP4, JPEG or PNG.
            </div>
          </el-col>
          <el-col class="mt-3" style="height: 36px">
            <el-upload
              class="uploader"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleUpload"
            >
              <div class="font-bold text-black w-full rounded-3xl select-btn">
                Select File
              </div>
            </el-upload>
          </el-col>
        </el-row>
        <el-row
          class="mt-5 px-3 py-3 text-center rounded-lg"
          style="background-color: #e6ff21"
        >
          <el-col>
            <div class="font-bold text-black card-item-title">Any URL</div>
          </el-col>
          <el-col>
            <div class="mt-2 text-black card-item-description">
              We support media URLs from GIPHY, YouTube, Vimeo, & many others!
            </div>
          </el-col>
          <el-col>
            <el-input
              v-model="parseUrl"
              :placeholder="$t('tips.input')"
              class="mt-3 search-box"
              size="large"
              @input="parseUrlChange"
            >
            </el-input>
          </el-col>
        </el-row>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import router from '@/router'
import { useUploadFileStore } from '@/stores'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Curve } from '@/assets/icon'
import { computed } from 'vue'

const parseUrl = ref<string>('')
const uploadFileStore = useUploadFileStore()
const targetRoute = computed(() => {
  return useRoute().params.behavior == 'creation' ? 'creation' : 'finalize'
})
const parseUrlLoading = ref<boolean>(false)

const parseUrlChange = () => {
  if (parseUrl.value.indexOf('.gif') != -1) {
    parseUrlLoading.value = true
    isImageUrl(parseUrl.value).then((res) => {
      if (res) {
        fetch(parseUrl.value).then((res) => {
          const urlPart = parseUrl.value.split('/')
          res.blob().then((blob) => {
            uploadFileStore.url = parseUrl.value
            uploadFileStore.file = new File(
              [blob],
              urlPart[urlPart.length - 1],
              {
                type: blob.type,
              }
            )
            parseUrlLoading.value = false
            router.push({
              name: targetRoute.value,
            })
          })
        })
      } else {
        ElMessage({
          type: 'error',
          message: 'Invalid Url',
        })
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
      e.target!.result.toString(),
      uploadFile,
      'gallery'
    )
    router.push({
      name: targetRoute.value,
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
.card {
  background: rgba(18, 18, 18, 0.8);
  box-shadow: inset 0px 0px 103px 0px rgba(227, 255, 0, 0.42);
  border-radius: 10px;
  border: 1px solid #e3ff00;
  backdrop-filter: blur(2px);
}
.card-description {
  font-family: GeezaPro;
  font-size: 15px;
  color: #e6ff21;
  line-height: 20px;
  font-style: normal;
  opacity: 40%;
}
.card-item {
  background: linear-gradient(180deg, #f5ffa7 0%, #e6ff21 100%);
  border-radius: 10px;
}
.card-item-title {
  font-family: DINPro, DINPro;
  font-size: 22px;
  line-height: 28px;
  font-style: normal;
}
.card-item-description {
  font-family: Helvetica;
  font-size: 13px;
  line-height: 16px;
  font-style: normal;
}
.uploader {
  :deep(.el-upload) {
    width: 36%;
  }
}
.select-btn {
  height: 50px;
  border: 1px solid #000000;
  font-family: Helvetica, Helvetica;
  font-size: 18px;
  line-height: 50px;
  font-style: normal;
}
.search-box {
  :deep(.el-input__wrapper) {
    background-color: white;
  }
  :deep(.el-input__inner) {
    color: #000000;
  }
  :deep(.el-input__wrapper input::placeholder) {
    text-align: center;
    font-size: 16px;
    color: #999999;
    line-height: 22px;
  }
}
</style>
