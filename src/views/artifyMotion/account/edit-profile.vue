<template>
  <div>
    <el-row>
      <el-col :span="2">
        <el-avatar
          :size="50"
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        />
      </el-col>
      <el-col :span="16">
        <el-upload
          ref="upload"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :auto-upload="false"
          :limit="1"
          :on-exceed="handleExceed"
        >
          <template #trigger>
            <el-button>select file</el-button>
          </template>

          <template #tip>
            <div class="el-upload__tip">
              jpg/png files with a size less than 500kb
            </div>
          </template>
        </el-upload>
        <el-button size="large" class="mt-3" round>Upload now</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}
</script>

<style scoped lang="less"></style>
