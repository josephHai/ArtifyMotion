<template>
  <div>
    <div class="flex">
      <div class="mr-5">
        <el-avatar class="user-avatar" :size="50" :src="curAvatar" />
      </div>
      <div>
        <el-upload
          ref="uploadInstance"
          :auto-upload="false"
          :show-file-list="false"
          :limit="1"
          :on-exceed="handleExceed"
          :on-change="handleUpload"
        >
          <template #trigger>
            <div
              class="w-36 h-9 flex justify-center items-center font-bold rounded-3xl file-btn"
            >
              <icon-edit class="w-4 h-4 mr-1" />
              <span>select file</span>
            </div>
          </template>

          <template #tip>
            <div class="text-[#E6FF21] text-xs text-opacity-50 mt-5">
              jpg/png files with a size less than 500kb
            </div>
          </template>
        </el-upload>
      </div>
    </div>
    <div
      class="w-full h-10 mt-10 flex justify-center items-center rounded-3xl opacity-60 font-bold upload-btn"
      :class="uploadLoading ? 'cursor-not-allowed' : 'cursor-pointer'"
      @click="!uploadLoading && upload()"
    >
      <span v-show="!uploadLoading">Upload now</span>
      <div v-show="uploadLoading" class="flex justify-center items-center">
        <tiny-loading />Uploading
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, UploadFile, genFileId } from 'element-plus'
import { uploadFile } from '@/api/file'
import { IconEdit, TinyLoading } from '@/assets/icon'
import { useUserStore } from '@/stores'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

const uploadLoading = ref<boolean>(false)
const userStore = useUserStore()
const fileInstnce = ref<Blob>()
const uploadInstance = ref<UploadInstance>()

const curAvatar = ref<string>(userStore.info.avatar!)

const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadInstance.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadInstance.value!.handleStart(file)
}

const handleUpload = (uploadFile: UploadFile) => {
  const reader = new FileReader()

  reader.readAsDataURL(uploadFile.raw as Blob)

  reader.onload = (e) => {
    fileInstnce.value = uploadFile.raw as Blob
    curAvatar.value = e.target!.result as string
  }
}

const upload = async () => {
  const formData = new FormData()

  if (!fileInstnce.value) {
    ElMessage.error('Please select a file')
    return
  }

  formData.append('file', fileInstnce.value!)
  formData.append('accessPermission', 'private')
  formData.append('tags', '')
  formData.append('group', 'avatar')

  uploadLoading.value = true
  await uploadFile(formData)
  userStore.info.avatar = curAvatar.value
  uploadLoading.value = false
  ElMessage.success('Upload success')
}
</script>

<style scoped lang="less">
.user-avatar {
  box-shadow: inset 0px 0px 18px 0px #e6ff21;
  border: 1px solid #e6ff21;
}
.file-btn {
  background: linear-gradient(90deg, #faffab 0%, #e7ff24 100%);
}
.upload-btn {
  background: linear-gradient(90deg, #faffab 0%, #e7ff24 100%);
}
</style>
