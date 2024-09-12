<template>
  <div v-if="userFiles.length > 0">
    <el-row justify="between" :gutter="8">
      <el-col
        class="cursor-pointer"
        v-for="file in userFiles"
        :key="file.fid"
        :span="6"
      >
        <el-image
          :key="file.fid"
          class="absolute w-full rounded-xl"
          :src="file.media.src.url"
        >
          <template #placeholder>
            <div class="w-full h-full image-loading-bg"></div>
          </template>
          <template #error>
            <div class="w-full h-full image-loading-bg"></div>
          </template>
        </el-image>
      </el-col>
    </el-row>
  </div>
  <div
    v-else
    id="empty"
    class="w-full h-96 flex flex-col justify-center items-center empty-container"
  >
    <div class="text-6xl font-bold text-[#E6FF21]">+</div>
    <div class="text-white text-sm">You haven't uploaded anything!</div>
    <div class="flex mt-5">
      <div
        class="w-36 h-9 mx-3 flex justify-center items-center rounded-3xl text-black font-bold text-sm cursor-pointer op-btn"
        @click="navigateTo('upload')"
      >
        Upload
      </div>
      <div
        class="w-36 h-9 mx-3 flex justify-center items-center rounded-3xl text-black font-bold text-sm cursor-pointer op-btn"
        @click="navigateTo('upload', { behavior: 'creation' })"
      >
        Creation
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '@/utils/common'
import { fetchUserFiles } from '@/api/mgr/user'
import { UserFilesResponse } from '@/api/mgr/model/result'

const userFiles = ref(<UserFilesResponse['result']>[])

const params = {
  page: 1,
  limit: 10,
  keywords: '',
  tags: '',
  group: 'creation',
  orderBy: '',
}

const getUserWrok = async () => {
  const res = (await fetchUserFiles(params)) as unknown as UserFilesResponse
  userFiles.value = res.result
}

onMounted(() => {
  getUserWrok()
})
</script>

<style scoped lang="less">
.op-btn {
  background: linear-gradient(90deg, #faffab 0%, #e7ff24 100%);
}
.empty-container {
  border: 1px dashed transparent;
  background: linear-gradient(#232323, #232323) padding-box,
    repeating-linear-gradient(
      -45deg,
      #383838 0%,
      #383838 0.45em,
      transparent 0,
      transparent 0.75em
    );
}
</style>
