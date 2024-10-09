<template>
  <div v-if="!loadLoading">
    <el-row justify="between" :gutter="8">
      <el-col
        class="cursor-pointer"
        v-for="file in userLikes"
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
  <div v-else class="flex justify-center mt-32">
    <icon-loading />
  </div>
</template>

<script setup lang="ts">
import { fetchLikeFiles } from '@/api/mgr/user'
import { UserFilesResponse } from '@/api/mgr/model/result'
import { IconLoading } from '@/assets/icon'

const loadLoading = ref<boolean>(false)
const userLikes = ref(<UserFilesResponse['result']>[])
const params = {
  page: 1,
  limit: 10,
  keywords: '',
  tags: '',
  group: 'creation, gallery',
  orderBy: '',
}

const getUserLikes = async () => {
  loadLoading.value = true
  const res = (await fetchLikeFiles(params)) as unknown as UserFilesResponse
  loadLoading.value = false
  userLikes.value = res.result
}

onMounted(() => {
  getUserLikes()
})
</script>

<style scoped lang="less"></style>
