<template>
  <div>
    <!-- 文件列表 -->
    <div class="m-auto mt-5" element-loading-background="rgba(0,0,0,0)">
      <div class="flex justify-center items-center mb-20">
        <curve :text="keywords ? 'Search Results' : 'Featured GIFs'" />
      </div>
      <el-carousel
        v-if="!keywords"
        type="card"
        height="314px"
        :autoplay="false"
        indicator-position="none"
        @change="handleCarouselChange"
        arrow="always"
      >
        <el-carousel-item
          v-for="(file, index) in fileList.slice(0, 5)"
          :key="file.id"
          class="rounded-xl image-loading-bg"
          @click="navigateTo('creation', { id: file.id })"
        >
          <el-image
            class="w-full rounded-xl"
            fit="cover"
            style="height: 314px"
            :src="file.media_formats.gif.url"
          >
            <template #placeholder>
              <div class="w-full"></div>
            </template>
            <template #error>
              <div class="w-full"></div>
            </template>
          </el-image>
          <div
            v-if="index === carouselActiveIndex"
            class="absolute w-full h-1/4 bottom-0 flex items-center px-5 overlay"
          >
            <div class="flex">
              <div>
                <img
                  class="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                  src="../../assets/img/t.png"
                  alt=""
                />
              </div>
              <div class="ml-4">
                <div class="text-white text-base font-bold">Tenor</div>
                <div class="text-gray-500 text-xs">@Tenor</div>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 文件列表结束 -->
    <!-- 素材列表 -->
    <div ref="materialList" class="mt-5 overflow-hidden">
      <div
        class="material-item"
        v-for="file in fileList.slice(5)"
        :key="file.id"
        @click="navigateTo('creation', { id: file.id })"
      >
        <el-image
          :key="file.id"
          class="absolute w-full rounded-xl"
          :src="file.media_formats.gif.url"
          :style="{ height: file.media_formats.tinygif.dims[1] + 'px' }"
        >
          <template #placeholder>
            <div class="w-full h-full image-loading-bg"></div>
          </template>
          <template #error>
            <div class="w-full h-full image-loading-bg"></div>
          </template>
        </el-image>
        <div
          class="absolute w-full h-full bottom-0 opacity-0 hover:opacity-100 cursor-pointer overlay"
        >
          <div class="absolute right-6 top-1">
            <icon-binding class="absolute w-5 h-5" />
          </div>
          <div class="absolute bottom-3 left-3">
            <div class="flex">
              <div>
                <img
                  class="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                  src="../../assets/img/t.png"
                  alt=""
                />
              </div>
              <div class="ml-4">
                <div class="text-white text-base font-bold">Tenor</div>
                <div class="text-gray-500 text-xs">@Tenor</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-observe-visibility="{
        callback: loadingData,
      }"
      class="mt-3 flex justify-center"
    >
      <div v-if="hasData" class="m-auto">
        <icon-loading />
      </div>
      <div v-else class="m-auto">
        <span class="text-white">No more data!</span>
      </div>
    </div>
    <!-- 素材列表结束 -->
    <el-backtop :bottom="100">
      <div
        class="w-full h-full rounded-full image-loading-bg flex justify-center items-center font-bold"
        style="color: #e8ff27"
      >
        <i-ep-top />
      </div>
    </el-backtop>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '@/utils/common'
import { useRoute } from 'vue-router'
import {
  PageParamsModel,
  ResponseObject,
  PageResultModel,
} from '@/api/tenor/model/tenorModel'
import { IconBinding, IconLoading } from '@/assets/icon'
import { Curve } from '@/assets/icon'
import Masonry from 'masonry-layout'
import { nextTick } from 'vue'
import { getFeatured, search } from '@/api/tenor'

const materialList = ref()
const _masonry = ref<Masonry>()
const route = useRoute()

// 图片文件获取及渲染
const carouselActiveIndex = ref<Number>(0)
const fileList = ref<ResponseObject[]>([])
const curPos = ref<string | number>('')
const busy = ref<boolean>(false)
const hasData = ref<boolean>(true)
const keywords = ref(route.query.q)

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
    params.q = keywords.value as string
    requestObj = search(params)
  } else {
    requestObj = getFeatured(params)
  }

  requestObj
    .then((data: PageResultModel) => {
      curPos.value = data.next
      hasData.value = data.results.length > 0
      data.results.forEach((item) => {
        fileList.value.push(item)
      })

      busy.value = false
    })
    .catch((e) => {
      console.log(e)
    })
}

const handleCarouselChange = (cur: Number) => {
  carouselActiveIndex.value = cur
}

const layout = () => {
  _masonry.value = new Masonry(materialList.value, {
    itemSelector: '.material-item',
    percentPosition: true,
    gutter: 10,
  })
}

const loadingData = (visible: boolean) => {
  if (visible && hasData.value && !busy.value) getList()
}

onMounted(() => {
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
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.9) 100%
  );
}

.material-item {
  width: calc(100% / 4 - 10px);
}

:deep(.el-carousel__arrow) {
  font-size: 1.2rem;
  color: #e8ff27;
}
</style>
