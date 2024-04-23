<template>
  <div>
    <el-row justify="space-between">
      <!-- 图片预览 -->
      <el-col
        :span="10"
        ref="sourceImageCanvasBox"
        v-loading="trackLoading"
        element-loading-text="handling..."
        element-loading-background="rgba(88, 88, 88, 1)"
      >
        <!-- 以gif形式渲染 -->
        <div v-if="renderMethod === 'gif'">
          <el-row>
            <gif-render
              v-if="sourceImageInfo.url"
              :box-width="boxWidth"
              :text="text"
              :text-scale="textScale"
              :selected-color="selectedColor"
              :selected-font-family="selectedFontFamily"
              :source-image-info="sourceImageInfo"
              :selected-sticker-url="selectedStickerUrl"
            />
          </el-row>
        </div>
        <!-- 以gif形式渲染结束 -->
        <!-- 以帧形式渲染 -->
        <div v-if="renderMethod === 'frame' && trackResults">
          <frame-render
            v-if="sourceImageInfo.url"
            :box-width="boxWidth"
            :source-image-info="sourceImageInfo"
            :selected-sticker-url="selectedStickerUrl"
            :track-results="trackResults"
            @fusion="handleFusion"
          />
        </div>
        <!-- 以帧形式渲染结束 -->
      </el-col>
      <!-- 图片预览结束 -->
      <!-- 操作面板 -->
      <el-col :span="10">
        <!-- 操作目录 -->
        <el-row>
          <el-radio-group class="w-100 op-radio-group" v-model="op">
            <el-row class="w-100">
              <el-col v-if="renderMethod === 'gif'" :span="12">
                <el-radio-button class="w-100" label="Caption" />
              </el-col>
              <el-col :span="renderMethod === 'frame' ? 24 : 12">
                <el-radio-button class="w-100" label="Stickers" />
              </el-col>
            </el-row>
          </el-radio-group>
        </el-row>
        <!-- 操作目录结束 -->
        <!-- 详细操作项 -->
        <!-- Caption -->
        <div v-if="op === 'Caption'" class="w-100 mt-1">
          <div class="c-bg-secondary py-3">
            <!-- 要添加的文字输入框 -->
            <el-row class="px-3 mt-3 w-100">
              <el-input
                v-model="text"
                :rows="2"
                type="textarea"
                placeholder="Enter your caption"
              />
            </el-row>
            <!-- 要添加的文字输入框结束 -->
            <!-- 颜色选择 -->
            <el-row class="px-3 mt-2 mx-0 w-100" justify="space-between">
              <el-col v-for="color in colors" :key="color" :span="2">
                <div
                  style="width: 100%; aspect-ratio: 1 / 1"
                  :style="{ background: color }"
                  :class="{ 'c-is-active': selectedColor === color }"
                  class="pointer"
                  @click="selectedColor = color"
                />
              </el-col>
            </el-row>
            <!-- 颜色选择结束 -->
          </div>
          <!-- 字体选择 -->
          <div class="px-3 py-5 w-100 c-bg-secondary">
            <el-text class="text-white" size="small">Style</el-text>
            <el-row class="mt-2" :gutter="10">
              <el-col
                v-for="fontFamily in fontFamilies"
                :key="fontFamily"
                :span="12"
                class="mt-2"
              >
                <div
                  class="c-bg-secondary-light text-white text-center py-2 pointer w-100"
                  :style="{ 'font-family': fontFamily.name }"
                  :class="{
                    'c-is-active': selectedFontFamily === fontFamily.name,
                    'c-not-active': selectedFontFamily !== fontFamily.name,
                  }"
                  @click="selectedFontFamily = fontFamily.name"
                >
                  {{ fontFamily.label }}
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- 字体选择结束 -->
          <!-- 字体大小调整 -->
          <div class="px-3 py-3 w-100 c-bg-secondary">
            <el-text class="text-white" size="small">Font Size</el-text>
            <el-row class="mt-2" :gutter="10">
              <el-col :span="12">
                <el-button
                  class="w-100 bg-transparent border-secondary"
                  @click="textScale += 0.1"
                  >+</el-button
                >
              </el-col>
              <el-col :span="12">
                <el-button
                  class="w-100 bg-transparent border-secondary"
                  @click="
                    textScale = textScale > 0.2 ? textScale - 0.1 : textScale
                  "
                  >-</el-button
                >
              </el-col>
            </el-row>
          </div>
          <!-- 字体大小调整结束 -->
        </div>
        <!-- Caption END -->
        <!-- Stickers -->
        <div v-if="op === 'Stickers'" class="w-100 mt-1">
          <el-row class="c-bg-secondary py-2">
            <el-col :span="18">
              <el-popover
                placement="bottom"
                :width="360"
                :visible="visible"
                trigger="click"
                ref="popoverRef"
              >
                <div class="m-auto m-0 px-3">
                  <el-row class="text-start">
                    <el-col>
                      <el-text class="fw-bold">Tags</el-text>
                    </el-col>
                  </el-row>
                  <el-row justify="space-between" class="mt-3">
                    <el-col
                      :span="8"
                      v-for="tag in stickersTags"
                      :key="tag.id"
                      class="mt-2"
                    >
                      <el-text
                        class="pointer"
                        @click="handleTagSelect(tag.value)"
                      >
                        # {{ tag.value }}
                      </el-text>
                    </el-col>
                  </el-row>
                </div>
                <template #reference>
                  <el-button
                    color="#62aef"
                    style="border: 0"
                    @click="visible = true"
                    v-click-outside="onClickOutside"
                  >
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <span class="text-secondary fw-bold"
                          ># {{ selectedTag }}</span
                        >
                      </el-col>
                      <el-col :span="12">
                        <el-icon class="text-white">
                          <i-ep-arrow-down />
                        </el-icon>
                      </el-col>
                    </el-row>
                  </el-button>
                </template>
              </el-popover>
            </el-col>
            <el-col :span="4">
              <el-button type="primary">upload sticker</el-button>
            </el-col>
          </el-row>
          <stickers-list
            class="c-bg-secondary mt-1 py-2"
            :stickers="stickers"
            @select="handleStickerSelect"
          ></stickers-list>
        </div>
        <!-- Stickers End -->
        <!-- 详细操作项结束 -->
        <!-- 操作按钮  -->
        <div class="c-bg-secondary mt-1 py-3">
          <el-row class="pt-5">
            <el-button
              class="w-100 c-btn-bg-cold border-0 text-white fw-bold"
              @click="handleDownload"
            >
              download
            </el-button>
          </el-row>
          <el-row>
            <el-button
              class="w-100 bg-transparent border-0 text-white fw-bold"
              @click="handleUpload"
              >Upload to memefun</el-button
            >
          </el-row>
        </div>
        <!-- 操作按钮结束 -->
      </el-col>
      <!-- 操作面板结束 -->
    </el-row>
  </div>
</template>

<script setup lang="ts">
import GifRender from '@/components/gif-render.vue'
import FrameRender from '@/components/frame-render.vue'
import { getFilesList, getStickerTags } from '@/api/file'
import { getPosts } from '@/api/tenor'
import { headTrack } from '@/api/creation'
import { useRoute } from 'vue-router'
import { ClickOutside as vClickOutside } from 'element-plus'
import { generateRandomString, url2filename } from '@/utils/common'
import { useUploadFileStore } from '@/stores'
import { gifToSprites } from '@/utils/gif.utils'
import { PageParamsModel, ResponseObject } from '@/api/tenor/model/tenorModel'

// global variable
const uploadFileStore = useUploadFileStore()
const op = ref<string>('Stickers')
const renderMethod = ref<string>('frame')
const sourceImageCanvasBox = ref<HTMLElement>()
const sourceImageInfo = ref<object>({
  fid: null,
  url: '',
  width: 0,
  height: 0,
  file: undefined,
})
const boxWidth = ref<number>()
const trackResults = ref<Object>()
const trackLoading = ref<boolean>(false)

// 1. 添加文本
const text = ref<string>('')
const textScale = ref<number>(1)
const selectedColor = ref<string>('black')
const selectedFontFamily = ref<string>('Arial')

const colors = ref<string[]>([
  'white',
  'black',
  'coral',
  'aquamarine',
  'blueviolet',
  'khaki',
  'fuchsia',
  'cyan',
])

const fontFamilies = ref<object[]>([
  {
    label: 'Default',
    name: 'Arial',
  },
  {
    label: 'MEME',
    name: 'Verdana',
  },
  {
    label: 'PIXEL',
    name: 'Times New Roman',
  },
  {
    label: 'Fancy',
    name: 'Georgia',
  },
  {
    label: 'Subtitle',
    name: 'Monaco',
  },
  {
    label: 'Fusion',
    name: 'Courier',
  },
])

const getFileInfo = () => {
  const fid = useRoute().params.id as string
  const data = new FormData()

  trackLoading.value = true
  try {
    if (fid) {
      const params = new PageParamsModel()
      params.ids = fid
      getPosts(params).then((res) => {
        const file_info = res['results'][0] as ResponseObject

        sourceImageInfo.value.fid = file_info.id
        sourceImageInfo.value.url = file_info.media_formats.gif.url
        sourceImageInfo.value.width = file_info.media_formats.gif.dims[0]
        sourceImageInfo.value.height = file_info.media_formats.gif.dims[1]
        sourceImageInfo.value.file = file_info.media_formats.gif.url

        fetch(file_info.media_formats.gif.url).then((res) => {
          res.blob().then((blob) => {
            const file = new File(
              [blob],
              url2filename(file_info.media_formats.gif.url),
              {
                type: blob.type,
              }
            )
            data.append('file', file)
            handleHeadTrack(data)
          })
        })
      })
    } else {
      let uploadFile = undefined
      let uploadFileUrl = uploadFileStore.url
        ? uploadFileStore.url
        : URL.createObjectURL(uploadFileStore.file['raw'])
      uploadFile = uploadFileStore.url
        ? uploadFileStore.file
        : uploadFileStore.file['raw']
      gifToSprites(uploadFile).then((gif) => {
        sourceImageInfo.value.url = uploadFileUrl
        sourceImageInfo.value.width = gif.originalWidth
        sourceImageInfo.value.height = gif.originalHeight
        sourceImageInfo.value.file = uploadFile

        data.append('file', uploadFile)
        handleHeadTrack(data)
      })
    }
  } catch (e) {
    console.log(e.message)
  }
}

const handleHeadTrack = (data: FormData) => {
  headTrack(data).then((res) => {
    const data = {}
    Object.keys(res['result']).forEach((id) => {
      data[id] = {
        stickerId: '',
        stickerStyle: undefined,
        boxes: res['result'][id],
      }
    })
    trackResults.value = data
    trackLoading.value = false
  })
}

// 2. sticker select
const visible = ref(false)
const stickersTags = ref<object[]>([
  {
    id: 0,
    value: 'all',
  },
])

const selectedTag = ref('all')
const stickers = ref<object[]>([])
const selectedStickerUrl = ref<string>()

const getOptionalTags = () => {
  getStickerTags().then((res) => {
    Array.prototype.push.apply(stickersTags.value, res['result'])
  })
}

const onClickOutside = () => {
  visible.value = false
}

const handleTagSelect = (tag) => {
  selectedTag.value = tag
  visible.value = false
  getStickers()
}

const getStickers = () => {
  const params = {
    page: 1,
    limit: 50,
    searchFilter: 'sticker',
    keywords: selectedTag.value == 'all' ? '' : selectedTag.value,
  }
  getFilesList(params).then((res) => {
    stickers.value = res['result']
  })
}

const handleStickerSelect = (event) => {
  selectedStickerUrl.value = event.target.src + '#' + generateRandomString(4)
}

// 3. 操作按钮点击事件
const handleDownload = () => {
  const url = new URL(sourceImageInfo.value.url)
  const baseUrl = `${url.protocol}//${url.host}${url.pathname}`

  sourceImageInfo.value.url =
    baseUrl + '?op=download' + '#' + generateRandomString(4)
}

const handleUpload = () => {
  const url = new URL(sourceImageInfo.value.url)
  const baseUrl = `${url.protocol}//${url.host}${url.pathname}`

  sourceImageInfo.value.url =
    baseUrl + '?op=upload' + '#' + generateRandomString(4)
}

const handleFusion = (result) => {
  sourceImageInfo.value.url = result.url
  sourceImageInfo.value.file = result.file
  renderMethod.value = 'gif'
}

onMounted(() => {
  boxWidth.value = sourceImageCanvasBox.value.$el.clientWidth
  getFileInfo()
  getOptionalTags()
  getStickers()
})
</script>

<style lang="less" scoped>
.el-radio-group {
  --el-border-radius-base: 0;
}
.op-radio-group {
  --el-radio-button-checked-bg-color: var(--c-gradient-blue-start);
  --el-radio-button-checked-border-color: var(--c-gradient-blue-start);

  :deep(.el-radio-button__inner) {
    width: 100%;
  }
}
.el-textarea {
  --el-input-border-radius: 0;
}
.color-radio {
  --el-radio-button-checked-bg-color: rgba(255, 255, 255);
  :deep(.el-radio-button__inner) {
    width: 36px;
    height: 36px;
  }
}
.c-is-active {
  border: 2px solid lightgreen;
}
.c-not-active {
  border: 2px solid transparent;
}
.uploader {
  :deep(.el-upload) {
    width: 100%;
  }
}
</style>
