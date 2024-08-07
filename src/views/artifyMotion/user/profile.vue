<template>
  <div class="mt-10">
    <div class="mt-5 flex justify-between">
      <div class="basis-1/6">
        <div
          class="w-36 h-9 mb-5 flex justify-center items-center text-white text-sm font-bold cursor-pointer rounded-3xl hover:text-[#E6FF21]"
          :class="{ 'tab-btn-active': activeName === 'general' }"
          @click="activeName = 'general'"
        >
          General
        </div>
        <div
          class="w-36 h-9 mb-5 flex justify-center items-center text-white text-sm font-bold cursor-pointer rounded-3xl hover:text-[#E6FF21]"
          :class="{ 'tab-btn-active': activeName === 'editProfile' }"
          @click="activeName = 'editProfile'"
        >
          Edit Profile
        </div>
        <div
          class="w-36 h-9 flex justify-center items-center text-white text-sm font-bold cursor-pointer rounded-3xl hover:text-[#E6FF21]"
          :class="{ 'tab-btn-active': activeName === 'changePassword' }"
          @click="activeName = 'changePassword'"
        >
          Password
        </div>
      </div>
      <div class="basis-5/6 bg-[#232323] bg-opacity-80 px-16 pt-10 min-h-96">
        <General v-if="activeName === 'general'" />
        <EditProfile v-if="activeName === 'editProfile'" />
        <change-password v-if="activeName === 'changePassword'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { General, EditProfile, ChangePassword } from './components'

const activeName = ref<string>('general')
</script>

<style scoped lang="less">
.tab-btn-active {
  box-shadow: inset 0px 0px 7px 0px #e6ff21;
  border: 1px solid #e6ff21;
}
</style>
