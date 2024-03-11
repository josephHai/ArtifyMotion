<template>
  <div>
    <el-autocomplete
      class="w-100"
      v-model="keywords"
      :fetch-suggestions="querySearch"
      :placeholder="$t('tips.input')"
      @select="handleSearch"
      :trigger-on-focus="false"
      size="large"
      @input="showSuggestion"
      @keyup.enter="handleSearch"
    >
      <template #append>
        <el-icon size="20" color="white" @click="handleSearch"
          ><i-ep-search
        /></el-icon>
      </template>
    </el-autocomplete>
    <!-- 最近上传的文件 -->
    <div v-if="false">
      <el-row>
        <el-icon color="#6a2c70" size="24">
          <i-ep-clock />
        </el-icon>
        <span class="h5 fw-semibold text-white mx-2">Latest</span>
      </el-row>
      <el-row :gutter="5">
        <el-col
          :span="4"
          v-for="file in latestFiles"
          :key="file['fid']"
          class="image-container"
        >
          <el-image
            class="rounded-1"
            style="width: 100%; height: 200px"
            fit="cover"
            :src="file.media_formats.gif.preview || file.media_formats.gif.url"
          />
          <div class="overlay text-center">
            <el-row :gutter="40" style="z-index: 100">
              <el-col :span="6">
                <el-tooltip
                  effect="dark"
                  content="edit"
                  placement="top"
                  :show-arrow="false"
                  :offset="2"
                >
                  <el-icon
                    size="large"
                    color="white"
                    class="pointer"
                    @click="navigateTo('edit', { id: file['fid'] })"
                  >
                    <i-ep-edit />
                  </el-icon>
                </el-tooltip>
              </el-col>
              <el-col :span="6">
                <el-tooltip
                  effect="dark"
                  content="creation"
                  placement="top"
                  :show-arrow="false"
                  :offset="2"
                >
                  <el-icon
                    size="large"
                    color="white"
                    class="pointer"
                    @click="navigateTo('replace', { id: file['fid'] })"
                  >
                    <i-ep-promotion />
                  </el-icon>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 最近上传的文件结束 -->
    <!-- 最多次下载的文件 -->
    <div class="mt-5" v-if="false">
      <el-row>
        <el-icon color="#b83b5e" size="24">
          <i-ep-download />
        </el-icon>
        <span class="h5 fw-semibold text-white mx-2">Most Download</span>
      </el-row>
      <el-row :gutter="5">
        <el-col
          :span="4"
          v-for="file in mostDownloadFiles"
          :key="file['fid']"
          class="image-container"
        >
          <el-image
            class="rounded-1"
            style="width: 100%; height: 200px"
            fit="cover"
            :src="file['media']['preview']['url']"
          />
          <div class="overlay text-center">
            <el-row :gutter="40" style="z-index: 100">
              <el-col :span="6">
                <el-button
                  @click="navigateTo('creation', { id: file['fid'] })"
                ></el-button>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 最多次下载的文件结束 -->
    <!-- 文件列表 -->
    <div
      class="mt-5 m-auto"
      v-if="false"
      element-loading-background="rgba(0,0,0,0)"
    >
      <el-row>
        <el-icon color="#f08a5d" size="24">
          <i-ep-files />
        </el-icon>
        <span class="h5 fw-semibold text-white mx-2">Lists</span>
      </el-row>
      <el-container>
        <el-row :gutter="10">
          <el-col
            class="pointer image-container"
            v-for="file in fileList"
            :key="file.id"
            :span="file['span']"
          >
            <el-image
              class="rounded-1"
              fit="cover"
              style="width: 100%; height: 314px"
              :src="file.media_formats.tinygif.url"
            />
            <div class="overlay text-center">
              <el-row :gutter="40" style="z-index: 100">
                <el-col :span="6">
                  <el-tooltip
                    effect="dark"
                    content="Creation"
                    placement="top"
                    :show-arrow="false"
                    :offset="2"
                  >
                    <el-icon
                      size="large"
                      color="white"
                      class="pointer"
                      @click="navigateTo('creation', { id: file.id })"
                    >
                      <i-ep-edit />
                    </el-icon>
                  </el-tooltip>
                </el-col>
                <el-col :span="6">
                  <el-tooltip
                    effect="dark"
                    content="Tips"
                    placement="top"
                    :show-arrow="false"
                    :offset="2"
                  >
                    <el-icon
                      size="large"
                      color="white"
                      class="pointer"
                      @click="handleTransaction(file['walletAddress'])"
                    >
                      <i-ep-wallet />
                    </el-icon>
                  </el-tooltip>
                </el-col>
                <el-col :span="6">
                  <el-tooltip
                    effect="dark"
                    content="Like"
                    placement="top"
                    :show-arrow="false"
                    :offset="2"
                  >
                    <el-icon size="large">
                      <icon-like width="24" height="24" />
                    </el-icon>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-container>
      <el-container
        v-observe-visibility="{
          callback: loadingData,
        }"
        class="mt-3"
      >
        <div v-if="hasData" class="m-auto">
          <icon-loading />
        </div>
        <div v-else class="m-auto">
          <span class="text-secondary">No more data!</span>
        </div>
      </el-container>
    </div>
    <!-- 文件列表结束 -->
    <!-- 素材列表 -->
    <div ref="materialList" class="mt-5 overflow-hidden">
      <el-image
        v-for="file in fileList"
        :key="file.id"
        class="material-item mb-3 rounded-1"
        :src="file.media_formats.tinygif.url"
        :style="{ height: file.media_formats.tinygif.dims[1] + 'px' }"
        @click="navigateTo('creation', { id: file.id })"
        :alt="file.content_description"
      >
        <template #placeholder>
          <div style="width: 100%; height: 100%">Loading...</div>
        </template>
      </el-image>
      <el-container
        v-observe-visibility="{
          callback: loadingData,
        }"
        class="mt-3"
        style="
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 5px;
        "
      >
        <div v-if="hasData" class="m-auto">
          <icon-loading />
        </div>
        <div v-else class="m-auto">
          <span class="text-secondary">No more data!</span>
        </div>
      </el-container>
    </div>
    <!-- 素材列表结束 -->
    <el-backtop :right="100" :bottom="100">
      <div class="text-secondary fw-bold" style="font-size: 1.2rem">
        <i-ep-top />
      </div>
    </el-backtop>
    <c-modal v-model="loadingVisible" width="30%" lock :show-close="false">
      <template #title>
        <div class="text-center">
          <icon-modal-loader />
        </div>
      </template>
      <template #body>
        <div class="text-white text-center mt-3">
          <span v-if="metamaskAction === 'logging'"
            >Connecting to your wallet...</span
          >
          <span v-if="metamaskAction === 'transaction'">transaction...</span>
        </div>
      </template>
    </c-modal>
    <c-modal v-model="transactionModalVisible" width="30%">
      <template #title>
        <div class="text-center text-white">Amount</div>
      </template>
      <template #body>
        <el-row class="mt-4 mx-3" justify="space-around" :gutter="5">
          <el-col :span="5">
            <el-button
              class="border border-secondary text-white"
              @click="transaction(1)"
              text
              >1eth</el-button
            >
          </el-col>
          <el-col :span="5">
            <el-button
              class="border border-secondary text-white"
              @click="transaction(2)"
              text
              >2eth</el-button
            >
          </el-col>
          <el-col :span="5">
            <el-button
              class="border border-secondary text-white"
              @click="transaction(5)"
              text
              >5eth</el-button
            >
          </el-col>
          <el-col :span="5">
            <el-button
              class="border border-secondary text-white"
              @click="transaction(10)"
              text
              >10eth</el-button
            >
          </el-col>
        </el-row>
      </template>
    </c-modal>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { getFeatured, autocomplete, search } from '@/api/tenor'
import {
  PageParamsModel,
  ResponseObject,
  PageResultModel,
} from '@/api/tenor/model/tenorModel'
import { orderRecord } from '@/api/eth'
import IconLoading from '@/components/icon-loading.vue'
import { IconLike } from '@/assets/icon'
import { ElMessage } from 'element-plus'
import CModal from '@/components/c-modal.vue'
import { IconModalLoader } from '@/assets/icon/loaders'
import { Metamask } from '@/utils/metamask.utils'
import web3 from 'web3'
import Masonry from 'masonry-layout'
import { nextTick } from 'vue'

const loadingVisible = ref(false)
const materialList = ref()
const _masonry = ref<Masonry>()

// 图片文件获取及渲染
const keywords = ref<string>('')
const latestFiles = ref<ResponseObject[]>()
const mostDownloadFiles = ref<object[]>()
const fileList = ref<ResponseObject[]>([])
const busy = ref<boolean>(false)
const hasData = ref<boolean>(true)
const curPos = ref<string | number>('')

const navigateTo = (name, params) => {
  router.push({
    name,
    params,
  })
}

const layout = () => {
  _masonry.value = new Masonry(materialList.value, {
    itemSelector: '.material-item',
    percentPosition: true,
    gutter: 10,
  })
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

// 搜索事件，每次搜索之前清空之前的列表状态
const handleSearch = () => {
  fileList.value = []
  curPos.value = ''
  hideSuggestion()
  getList()
}

const hideSuggestion = () => {
  document.querySelectorAll('.el-autocomplete__popper')[0].style.display =
    'none'
}

const showSuggestion = () => {
  document.querySelectorAll('.el-autocomplete__popper')[0].style.display =
    'block'
}

const loadingData = (visible) => {
  if (visible && hasData.value && !busy.value) getList()
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

// eth交易
const transactionModalVisible = ref(false)
const metamaskAction = ref<string>('')
const metamaskInstance = Metamask.getInstance()
let account: string
const toWalletAddress = ref<string>('')

const handleTransaction = async (walletAddress) => {
  metamaskAction.value = 'logging'
  loadingVisible.value = true
  account = await metamaskInstance.getAccount()

  loadingVisible.value = false
  transactionModalVisible.value = true
  toWalletAddress.value = walletAddress
}

const transaction = async (amount: number) => {
  transactionModalVisible.value = false
  metamaskAction.value = 'transaction'
  loadingVisible.value = true
  const amountWei = web3.utils.toWei(amount.toString(), 'ether')
  window.ethereum
    ?.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: account,
          to: toWalletAddress.value,
          value: parseInt(amountWei).toString(16),
        },
      ],
    })
    .then(async (txHash) => {
      const chainId = await metamaskInstance.getChainId()
      const data = new FormData()
      data.append('chainId', chainId)
      data.append('fromAddress', account)
      data.append('toAddress', toWalletAddress.value)
      data.append('value', amountWei)
      data.append('txHash', txHash as string)
      await orderRecord(data)
    })
    .catch((err) => {
      if (err.code === 4001) {
        ElMessage({
          type: 'info',
          message: 'transaction is denied!',
          duration: 3 * 1000,
        })
      } else if (err.code === -32602) {
        ElMessage({
          type: 'error',
          message: 'Something went wrong, please contact the administrator!',
          duration: 3 * 1000,
        })
      }
    })
    .finally(() => {
      loadingVisible.value = false
    })
}

onMounted(() => {
  getList()
  nextTick(() => {
    layout()
  })
})

onUpdated(() => {
  layout()
})
</script>

<style scoped lang="less">
.image-container {
  position: relative;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container:hover .overlay {
  opacity: 1;
}

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

.material-item {
  width: calc(100% / 4 - 10px);
}
</style>
