<template>
  <el-container style="width: 70%; margin: 0 auto">
    <el-header id="header" class="layout-header">
      <el-row>
        <el-col :span="4">
          <div class="el-row" @click="router.push('/')">
            <el-image class="logo" fit="cover" :src="logo" />
          </div>
        </el-col>
        <el-col :span="14">
          <div class="mx-4">
            <el-autocomplete
              class="w-100 border-4"
              v-model="keywords"
              :fetch-suggestions="querySearch"
              :placeholder="$t('tips.input')"
              @select="handleSearch"
              :trigger-on-focus="false"
              size="large"
              @input="showSuggestion"
              @keyup.enter="handleSearch"
              :prefix-icon="Search"
            >
            </el-autocomplete>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="header-right">
            <el-button
              class="c-btn-light"
              size="large"
              @click="router.push({ name: 'upload' })"
              v-if="route.name !== 'upload'"
              round
            >
              {{ $t('message.upload') }}
            </el-button>
            <el-button
              class="c-btn-light"
              size="large"
              @click="
                router.push({
                  name: 'upload',
                  params: { behavior: 'creation' },
                })
              "
              v-if="route.name !== 'upload'"
              round
            >
              {{ $t('message.creation') }}
            </el-button>
            <el-dropdown
              style="
                margin-left: 16px;
                outline: none;
                border: 1px solid transparent;
              "
            >
              <span class="el-dropdown-link">
                <el-avatar :icon="User" />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="navigateTo('login', '')"
                    >Log in</el-dropdown-item
                  >
                  <el-dropdown-item @click="navigateTo('register', '')"
                    >Sign up</el-dropdown-item
                  >
                  <el-dropdown-item @click="getAccount"
                    >Wallet</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
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
import logo from '@/assets/img/logo.png'
import CModal from '@/components/c-modal.vue'
import { IconModalLoader } from '@/assets/icon/loaders'
import { Metamask } from '@/utils/metamask.utils'
import { navigateTo } from '@/utils/common'
import {
  PageParamsModel,
  ResponseObject,
  PageResultModel,
} from '@/api/tenor/model/tenorModel'
import { getFeatured, autocomplete, search } from '@/api/tenor'
import { Search, User } from '@element-plus/icons-vue'

const route = useRoute()
const key = computed(() => `${String(route.name || route.path)}-${new Date()}`)
const keywords = ref<string>('')
const curPos = ref<string | number>('')
const fileList = ref<ResponseObject[]>([])
const busy = ref<boolean>(false)
const hasData = ref<boolean>(true)

// eth变量
const getAccountLoading = ref<boolean>(false)
const metamaskInstance = Metamask.getInstance()

const getAccount = async () => {
  getAccountLoading.value = true
  metamaskInstance.getAccount().then(() => {
    getAccountLoading.value = false
  })
}

// 搜索事件，每次搜索之前清空之前的列表状态
const handleSearch = () => {
  fileList.value = []
  curPos.value = ''
  hideSuggestion()
  getList()
}

/**
 * 获取素材列表
 *
 * 若keywords为空，则调用getFeatured接口，反之调用search接口
 */

const getList = () => {
  busy.value = true

  const params = new PageParamsModel()
  params.pos = curPos.value

  let requestObj
  if (keywords.value) {
    params.q = keywords.value
    requestObj = search(params)
  } else {
    requestObj = getFeatured(params)
  }

  requestObj
    .then((res: PageResultModel) => {
      curPos.value = res.next
      hasData.value = res.results.length > 0
      res.results.forEach((item) => {
        fileList.value.push(item)
      })

      busy.value = false
    })
    .catch((e) => {
      console.log(e)
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
const querySearch = (queryString, callback) => {
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
.layout-header {
  margin-top: 1%;
}
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
.logo {
  width: 150px;
  cursor: pointer;
}
:deep(.el-input__wrapper) {
  box-shadow: none;
  border-radius: 36px;
  background-color: rgba(36, 36, 36, 1);
  color: white;
}
.c-btn-light {
  background-color: transparent;
  color: white;
  min-width: 100px;
  box-shadow: inset 0 0 7px 0 rgba(230, 255, 33, 1);
  outline: none;
  border: 1px solid transparent;
}
.c-btn-light:hover {
  color: rgba(230, 255, 33, 1);
  font-weight: bold;
}
:deep(.el-avatar) {
  background-color: transparent;
  border: 1px solid;
  box-shadow: inset 0 0 7px 0 rgba(230, 255, 33, 1);
}
:deep(.el-dropdown__popper.el-popper) {
  background-color: transparent;
  box-shadow: inset 0 0 7px 0 rgba(230, 255, 33, 1);
}
</style>
