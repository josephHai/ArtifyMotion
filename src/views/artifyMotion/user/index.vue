<template>
  <div class="mt-10">
    <div class="flex items-center">
      <div>
        <el-avatar
          class="user-avatar"
          :size="80"
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        />
      </div>
      <div class="ml-5">
        <div class="mb-4">
          <span class="text-white font-bold text-xl">ct Hai</span>
        </div>
        <div
          v-if="route.name === 'userHome'"
          class="flex items-center text-white cursor-pointer"
        >
          <icon-edit class="w-4 h-4 mr-2" />
          <span @click="navigateTo('profile')">Edit Profile</span>
        </div>
      </div>
    </div>
    <div style="min-height: 300px">
      <router-view :key="key" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { navigateTo } from '@/utils/common'
import { IconEdit } from '@/assets/icon'

const route = useRoute()
const key = computed(() => `${String(route.name || route.path)}-${new Date()}`)
</script>

<style scoped lang="less">
.user-avatar {
  box-shadow: inset 0px 0px 18px 0px #e6ff21;
  border: 1px solid #e6ff21;
}
</style>
