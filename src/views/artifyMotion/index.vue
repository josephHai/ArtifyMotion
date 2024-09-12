<template>
  <el-container class="w-3/4 m-auto">
    <el-header id="header" class="sticky top-0 z-50 bg-black py-5">
      <div class="flex items-center justify-between mt-3">
        <div class="w-1/5">
          <div @click="router.push('/')">
            <icon-logo class="cursor-pointer" :width="200" />
          </div>
        </div>
        <div class="w-1/2">
          <el-autocomplete
            v-show="route.name === 'list'"
            class="w-full"
            v-model="keywords"
            :fetch-suggestions="querySearch"
            :placeholder="$t('tips.input')"
            @select="handleSearch"
            :trigger-on-focus="false"
            size="large"
            @input="showSuggestion"
            @keyup.enter="handleSearch"
            :prefix-icon="Search"
            popper-class="!border-0 !z-50 autocomplete-popper"
          />
        </div>
        <div class="w-1/5">
          <div class="header-right w-full flex items-center">
            <div
              class="w-full h-10 flex justify-center items-center rounded-3xl bg-transparent text-white mx-1 cursor-pointer c-btn-light"
              @click="router.push({ name: 'upload' })"
            >
              {{ $t('message.upload') }}
            </div>
            <div
              class="w-full h-10 flex justify-center items-center rounded-3xl bg-transparent text-white mx-1 cursor-pointer c-btn-light"
              @click="
                router.push({
                  name: 'upload',
                  params: { behavior: 'creation' },
                })
              "
            >
              {{ $t('message.creation') }}
            </div>
          </div>
        </div>
        <div>
          <el-popover effect="dark" popper-class="!px-0 !border-0">
            <template #reference>
              <div class="ml-3">
                <el-avatar class="cursor-pointer avatar-box" :icon="User" />
              </div>
            </template>
            <div class="w-full flex flex-col text-white">
              <div v-if="getToken()">
                <div class="py-2 cursor-pointer px-3 navigation-btn">
                  <span @click="navigateTo('userHome')">User Home</span>
                </div>
                <div class="py-2 cursor-pointer px-3 navigation-btn">
                  <span @click="userStore.logout()">Log Out</span>
                </div>
              </div>
              <div v-else>
                <div
                  class="py-2 cursor-pointer px-3 navigation-btn"
                  @click="navigateTo('login')"
                >
                  <span>Sign In</span>
                </div>
                <div
                  class="py-2 cursor-pointer px-3 navigation-btn"
                  @click="navigateTo('register')"
                >
                  <span>Sign Up</span>
                </div>
              </div>
            </div>
          </el-popover>
        </div>
      </div>
    </el-header>
    <div id="content">
      <router-view :key="key" />
    </div>
    <c-modal v-model="getAccountLoading" width="30%" lock :show-close="false">
      <template #title>
        <div class="text-center">
          <icon-loading />
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
import { IconLogo, IconLoading } from '@/assets/icon'
import CModal from '@/components/c-modal.vue'
import { navigateTo } from '@/utils/common'
import { PageParamsModel } from '@/api/tenor/model/tenorModel'
import { autocomplete } from '@/api/tenor'
import { Search, User } from '@element-plus/icons-vue'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/stores'

const route = useRoute()
const key = computed(() => `${String(route.name || route.path)}-${new Date()}`)
const keywords = ref(route.query.q)
const userStore = useUserStore()

// eth变量
const getAccountLoading = ref<boolean>(false)

// 搜索事件，每次搜索之前清空之前的列表状态
const handleSearch = () => {
  hideSuggestion()
  router.push({
    path: '/',
    query: {
      q: keywords.value,
    },
  })
}

const hideSuggestion = () => {
  document.querySelectorAll('.el-autocomplete__popper')[0].style.display =
    'none'
}

const showSuggestion = () => {
  document.querySelectorAll('.el-autocomplete__popper')[0].style.display =
    'block'
}

// 获取搜索建议
const querySearch = (queryString: string, callback: Function) => {
  let params: PageParamsModel = new PageParamsModel()
  params.q = queryString
  autocomplete(params).then((res) => {
    const results = []
    res['results'].map((item) => {
      results.push({ value: item })
    })
    callback(results)
  })
}
</script>

<style scoped lang="less">
.header-left {
  float: left;
}
.header {
  float: inherit;
  position: relative;
}
.header-right {
  float: right;
}
:deep(.el-input__wrapper) {
  --el-input-text-color: white;
  box-shadow: none !important;
  border-radius: 36px;
  background-color: rgba(36, 36, 36, 1);
  color: white;
  outline: none;
  :deep(input) {
    outline: none !important;
  }
}
.c-btn-light {
  box-shadow: inset 0 0 7px 0 rgba(230, 255, 33, 1);
  border: 1px solid transparent;
}
.c-btn-light:hover {
  color: rgba(230, 255, 33, 1);
  font-weight: bold;
}
.avatar-box {
  background-color: transparent;
  border: 1px solid;
  box-shadow: inset 0 0 7px 0 rgba(230, 255, 33, 1);
}
.navigation-btn:hover {
  background: rgba(0, 0, 0, 0.6);
  color: rgba(230, 255, 33, 1);
}
</style>
<style lang="less">
.autocomplete-popper {
  background: #303133 !important;
  --el-fill-color-light: rgba(0, 0, 0, 0.6);
  --el-text-color-regular: white;
  --el-bg-color-overlay: #303133;
  --el-border-color-light: #303133;
}
</style>
