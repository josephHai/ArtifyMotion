<template>
  <el-container style="width: 65%; margin: 0 auto">
    <el-header id="header" class="layout-header">
      <div class="header-left">
        <div @click="router.push('/')">
          <el-image class="logo" fit="cover" :src="logo" />
        </div>
      </div>
      <div class="header-right">
        <el-button class="text-white" link @click="toggleLanguage">
          <el-icon class="mx-1" :size="18">
            <i-ep-copyDocument />
          </el-icon>
          <el-text class="text-white fw-bold">
            {{ $t('message.locale') }}
          </el-text>
        </el-button>
        <el-button
          class="c-btn-bg-cold border-0 text-white"
          style="min-width: 100px"
          size="large"
          @click="router.push({ name: 'upload' })"
          v-if="route.name !== 'upload'"
        >
          {{ $t('message.upload') }}
        </el-button>
      </div>
      <el-input
        v-model="searchValue"
        :placeholder="$t('tips.input')"
        class="searchBox"
        size="large"
        v-if="route.name === 'list'"
      >
        <template #append>
          <el-icon size="20" color="white"><i-ep-search /></el-icon>
        </template>
      </el-input>
    </el-header>
    <el-main id="content" :class="{ 'mt-5': route.name === 'list' }">
      <router-view :key="key" />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import router from '@/router'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import logo from '@/assets/img/logo.jpg'

let searchValue = ref<string>('')
const { locale } = useI18n({ useScope: 'global' })
const route = useRoute()
const key = computed(() => `${String(route.name || route.path)}-${new Date()}`)

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
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
.searchBox {
  margin-top: 1%;
  height: 40px;
}
.searchBox {
  :deep(.el-input-group__append) {
    height: 50px;
    cursor: pointer;
    border-radius: 0 5px 5px 0;
    background: linear-gradient(
      45deg,
      var(--c-gradient-btn-bg-cold-start),
      var(--c-gradient-btn-bg-cold-end)
    );
  }
  :deep(.el-input__wrapper) {
    height: 50px;
  }
}
</style>
