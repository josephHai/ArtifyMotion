<template>
  <el-container style="width: 70%; margin: 0 auto">
    <el-header id="header" class="layout-header">
      <div class="header-left">
        <div @click="router.push('/')">
          <el-image class="logo" fit="cover" :src="logo" />
        </div>
      </div>
      <div class="header-right">
        <el-button
          class="c-btn-bg-cold border-0 text-white"
          style="min-width: 100px"
          size="large"
          @click="router.push({ name: 'upload' })"
          v-if="route.name !== 'upload'"
        >
          {{ $t('message.upload') }}
        </el-button>
        <el-button
          class="c-btn-bg-cold border-0 text-white"
          style="min-width: 100px"
          size="large"
          @click="
            router.push({ name: 'upload', params: { behavior: 'creation' } })
          "
          v-if="route.name !== 'upload'"
        >
          {{ $t('message.creation') }}
        </el-button>
        <el-button
          class="border border-secondary bg-transparent text-white rounded-1"
          size="large"
          v-if="route.name !== 'upload'"
          @click="getAccount"
        >
          <i-ep-wallet />
        </el-button>
      </div>
    </el-header>
    <el-main id="content">
      <router-view :key="key" />
    </el-main>
    <c-modal v-model="getAccountLoading" width="30%" lock :show-close="false">
      <template #title>
        <div class="text-center">
          <icon-modal-loader />
        </div>
      </template>
      <template #body>
        <div class="text-white text-center mt-3">
          Connecting to your wallet...
        </div>
      </template>
    </c-modal>
  </el-container>
</template>

<script setup lang="ts">
import router from '@/router'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import logo from '@/assets/img/logo.jpg'
import CModal from '@/components/c-modal.vue'
import { IconModalLoader } from '@/assets/icon/loaders'
import { Metamask } from '@/utils/metamask.utils'

const route = useRoute()
const key = computed(() => `${String(route.name || route.path)}-${new Date()}`)
const getAccountLoading = ref<boolean>(false)
const metamaskInstance = Metamask.getInstance()

const getAccount = async () => {
  getAccountLoading.value = true
  metamaskInstance.getAccount().then(() => {
    getAccountLoading.value = false
  })
}
</script>

<style scoped lang="less">
.layout-header {
  margin-top: 1%;
}
.header-left {
  float: left;
}
.header-right {
  float: right;
  margin-right: 0;
}
.logo {
  width: 180px;
  height: 36px;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
