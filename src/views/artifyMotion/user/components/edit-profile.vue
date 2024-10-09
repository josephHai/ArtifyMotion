<template>
  <div>
    <div class="flex">
      <div class="mr-5">
        <el-avatar
          class="user-avatar"
          :size="50"
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        />
      </div>
      <div>
        <el-upload :auto-upload="false" :limit="1" :on-change="handleUpload">
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
      class="w-full h-10 mt-10 flex justify-center items-center rounded-3xl opacity-60 cursor-pointer font-bold upload-btn"
      @click="upload"
    >
      Upload now
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UploadFile } from 'element-plus'
import { uploadFile } from '@/api/file'
import { IconEdit } from '@/assets/icon'

const fileInstnce = ref<Blob>()

const handleUpload = (uploadFile: UploadFile) => {
  const reader = new FileReader()

  reader.readAsDataURL(uploadFile.raw as Blob)

  reader.onload = () => {
    fileInstnce.value = uploadFile.raw as Blob
  }
}

const upload = async () => {
  const formData = new FormData()

  formData.append('file', fileInstnce.value!)
  formData.append('accessPermission', 'private')
  formData.append('tags', '')
  formData.append('group', 'avatar')

  return await uploadFile(formData)
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
