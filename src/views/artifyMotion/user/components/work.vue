<template>
  <div v-if="false">
    <el-row justify="between" :gutter="8">
      <el-col class="cursor-pointer" v-for="i in 8" :key="i" :span="6">
        <el-image
          :key="i"
          class="absolute w-full rounded-xl"
          src="https://media.tenor.com/kH2Q1iCaWVoAAAAM/burger-king-tiny-hands.gif"
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
