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
        <el-upload
          ref="upload"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :auto-upload="false"
          :limit="1"
          :on-exceed="handleExceed"
        >
          <template #trigger>
            <div
              class="w-36 h-9 flex justify-center items-center font-bold rounded-3xl file-btn"
            >
              <icon-edit class="w-4 h-4 bg-black mr-1" />
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
    >
      Upload now
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { IconEdit } from '@/assets/icon'

const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
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
