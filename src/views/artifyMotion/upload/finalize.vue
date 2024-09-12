<template>
  <div class="w-75 m-auto mt-5">
    <el-row justify="space-between">
      <el-col :span="8">
        <div class="pt-5 px-4 card">
          <el-row
            class="items-center pointer text-white font-bold"
            @click="router.back()"
          >
            <el-icon :size="24">
              <i-ep-arrow-left />
            </el-icon>
            <div class="mx-1">Back</div>
          </el-row>
          <el-row class="mt-3 items-center text-white" justify="space-between">
            <el-col :span="3">
              <el-image class="rounded-lg" fit="fill" :src="sourceUrl" />
            </el-col>
            <el-col :span="18">
              <div
                class="text-white overflow-hidden text-ellipsis whitespace-nowrap"
                style="font-size: 14px; line-height: 36px"
              >
                {{ imageName }}
              </div>
            </el-col>
            <el-col :span="2">
              <el-icon :size="24">
                <i-ep-picture-filled class="opacity-40" />
              </el-icon>
            </el-col>
          </el-row>
          <el-row class="mt-3">
            <el-image class="w-full rounded-md" :src="sourceUrl" />
          </el-row>
        </div>
      </el-col>
      <el-col :span="15">
        <div class="pt-5 px-4 card">
          <el-row>
            <div class="font-bold text-white text-xl">Add Info</div>
          </el-row>
          <el-row class="mt-4 align-items-center">
            <el-icon class="text-white opacity-40 text-xl"
              ><i-ep-lock
            /></el-icon>
            <div class="text-white opacity-40 font-bold ml-2 text-sm">
              Visibility
            </div>
          </el-row>
          <el-row class="mt-3">
            <el-col :span="10">
              <btn-switch :on="visibility" @click="visibility = !visibility" />
            </el-col>
          </el-row>
          <el-row class="mt-4" :gutter="20">
            <el-col :span="1"
              ><el-icon class="text-white opacity-40 text-xl"
                ><i-ep-collection-tag /></el-icon
            ></el-col>
            <el-col :span="10">
              <div class="text-white opacity-40 font-bold ml-2 text-sm">
                Add Tags
              </div>
            </el-col>
          </el-row>
          <el-row class="mt-3">
            <el-input v-model="tag" class="tags-box" placeholder="Add tags">
              <template #suffix>
                <div
                  @click="addTag"
                  class="relative left-2 cursor-pointer tag-suffix"
                >
                  <div class="text-black font-bold">+</div>
                </div>
              </template>
            </el-input>
            <el-row>
              <el-tag
                v-for="tag in tags"
                :key="tag"
                class="my-3 tag-box px-3"
                style="background-color: #2d2d2d"
                closable
                @close="handleClose"
                size="large"
                round
              >
                {{ tag }}
              </el-tag>
            </el-row>
            <el-row>
              <div
                class="mt-2 text-white opacity-40 text-xs"
                style="font-size: 0.8rem; word-break: keep-all"
                v-show="!tags.length"
              >
                Tags help find your content later. Separate with commas to add
                multiple tags.
              </div>
            </el-row>
          </el-row>
          <el-row class="mt-4" :gutter="20">
            <el-col :span="1">
              <el-icon class="text-white opacity-40 font-bold text-xl">
                <i-ep-football />
              </el-icon>
            </el-col>
            <el-col :span="10">
              <div class="text-white opacity-40 font-bold ml-2 text-sm">
                Source URL
              </div>
            </el-col>
          </el-row>
          <el-input
            v-model="imageName"
            class="mt-3 tags-box"
            maxlength="30"
            disabled
          >
            <template #prefix>
              <el-icon>
                <i-ep-picture-filled />
              </el-icon>
            </template>
          </el-input>
          <el-row class="mt-8">
            <div
              class="w-full rounded-3xl py-2 text-center cursor-pointer btn-bg"
              @click="handleUpload"
            >
              <div class="text-black font-bold">Upload</div>
            </div>
          </el-row>
          <!-- <el-row class="mt-1">
            <el-button
              class="w-100 text-white border-0 mt-2 fw-bold"
              style="background: rgba(33, 33, 33, 1)"
              @click="handleMint"
              >Upload & Mint</el-button
            >
          </el-row> -->
        </div>
      </el-col>
    </el-row>
    <c-modal
      v-model="mintModalShow"
      :show-close="!mintLoading && !getAccountLoading"
      :width="mintLoading || getAccountLoading ? '30%' : '60%'"
      :before-close="handleModalClose"
      lock
    >
      <template #title v-if="mintLoading || getAccountLoading">
        <div class="text-center">
          <icon-loading />
        </div>
      </template>
      <template #title v-else>
        <div class="text-center text-white">Mint Successfully!</div>
      </template>
      <template #body v-if="mintLoading || getAccountLoading">
        <div class="text-white text-center mt-3">
          <span v-if="getAccountLoading">Connecting to your wallet...</span>
          <span v-else>Transition...</span>
        </div>
      </template>
      <template #body v-else>
        <div class="text-white text-center mt-3 border border-1 border-white">
          <el-row>
            <el-col :span="8" class="border-end border-white"
              >transactionHash</el-col
            >
            <el-col :span="16">
              <span class="text-break">{{
                transactionResult['transactionHash']
              }}</span>
            </el-col>
          </el-row>
        </div>
      </template>
    </c-modal>
  </div>
</template>

<script setup lang="ts">
import BtnSwitch from '@/components/btn-switch.vue'
import router from '@/router'
import { useUploadFileStore } from '@/stores'
import { uploadFile } from '@/api/file'
import { ElMessage } from 'element-plus'
import CModal from '@/components/c-modal.vue'
import { IconLoading } from '@/assets/icon'

// 文件上传
const tag = ref<string>('')
const tags = ref<string[]>([])
const sourceUrl = ref()
const imageName = ref()
const visibility = ref(true)
const uploadFileStore = useUploadFileStore()

const addTag = () => {
  if (tag.value !== '') {
    tag.value = tag.value.replace('#', '')
    if (tags.value.indexOf('#' + tag.value) == -1)
      tags.value?.push('#' + tag.value)
  }
  tag.value = ''
}

const handleClose = (tag: string) => {
  tags.value.splice(tags.value.indexOf(tag), 1)
}

const handleUpload = () => {
  upload().then(() => {
    ElMessage({
      type: 'success',
      message: 'success',
      duration: 3 * 1000,
    })
    router.back()
  })
}

const upload = async () => {
  const formData = new FormData()

  formData.append(
    'file',
    uploadFileStore.url ? uploadFileStore.file : uploadFileStore.file['raw']
  )
  formData.append('accessPermission', visibility ? 'public' : 'private')
  formData.append('tags', tags.value.join(''))
  formData.append('group', uploadFileStore.group)

  return await uploadFile(formData)
}

// 文件url铸造
const getAccountLoading = ref(false)
const mintLoading = ref(false)
const mintModalShow = ref(false)
const transactionResult = ref()

const handleModalClose = (done) => {
  done()
  router.back()
}

onMounted(() => {
  imageName.value =
    uploadFileStore.url === '' ? uploadFileStore.file.name : uploadFileStore.url
  sourceUrl.value =
    uploadFileStore.url === '' ? uploadFileStore.localUrl : uploadFileStore.url
})
</script>

<style scoped lang="less">
@card-min-height: 600px;

.card {
  background: rgba(35, 35, 35, 0.8);
  border-radius: 10px;
  backdrop-filter: blur(2px);
  min-height: @card-min-height;
}

.tags-box {
  height: 38px;
  :deep(.el-input__wrapper) {
    background-color: white;
  }
  :deep(input) {
    color: black;
  }
}

.tag-suffix {
  width: 36px;
  height: 36px;
  font-size: 36px;
  border-radius: 50%;
  background: linear-gradient(180deg, #f5ffa7 0%, #e6ff21 100%);
}

.tag-box {
  color: white;
  margin-left: 2px;
  background: #0c0a0a;
  border: 0;
  :deep(.el-tag__close) {
    color: white;
  }
}

.btn-bg {
  background: linear-gradient(90deg, #faffab 0%, #e7ff24 100%);
}
</style>
