<template>
  <div class="mt-10">
    <div class="flex mb-5">
      <div
        class="w-32 h-9 flex justify-center items-center text-white text-sm font-bold cursor-pointer rounded-3xl hover:text-[#E6FF21]"
        :class="{ 'tab-btn-active': activeName === 'work' }"
        @click="activeName = 'work'"
      >
        Work
      </div>
      <div
        class="w-32 h-9 flex justify-center items-center text-white text-sm font-bold cursor-pointer rounded-3xl hover:text-[#E6FF21]"
        :class="{ 'tab-btn-active': activeName === 'like' }"
        @click="activeName = 'like'"
      >
        Liked
      </div>
    </div>
    <div v-if="activeName === 'work'" label="Work" name="work">
      <Work />
    </div>
    <div v-if="activeName === 'like'" label="Liked" name="liked">
      <Liked />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Work, Liked } from './components'

const activeName = ref('work')
</script>

<style scoped lang="less">
.tab-btn-active {
  box-shadow: inset 0px 0px 7px 0px #e6ff21;
  border: 1px solid #e6ff21;
}
</style>
