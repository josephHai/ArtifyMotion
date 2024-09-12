<template>
  <div class="mt-5">
    <el-row justify="space-between" style="min-height: 600px">
      <!-- 图片预览 -->
      <el-col
        :span="11"
        class="rounded-lg px-3 py-3"
        style="background: rgba(35, 35, 35, 0.8); backdrop-filter: blur(2px)"
      >
        <div class="w-full h-full" ref="sourceImageCanvasBox">
          <el-row
            class="align-items-center pointer text-white font-bold mb-5"
            @click="router.back()"
          >
            <el-icon :size="24">
              <i-ep-arrow-left />
            </el-icon>
            <div class="mx-1">Back</div>
          </el-row>
          <!-- 以gif形式渲染 -->
          <div v-if="renderMethod === 'gif'">
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
          </div>
          <!-- 以gif形式渲染结束 -->
          <!-- 以帧形式渲染 -->
          <div v-else-if="renderMethod === 'frame' && trackResults">
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
          <div
            v-else
            class="w-full h-full c-bg-block"
            v-loading="trackLoading"
            element-loading-background="transparent"
            :element-loading-svg="LocalLoadingSvg"
            element-loading-svg-class="loading-svg"
          />
        </div>
      </el-col>
      <!-- 图片预览结束 -->
      <!-- 操作面板 -->
      <el-col
        :span="12"
        class="rounded-lg px-3 py-3"
        style="background: #232323"
      >
        <!-- 操作目录 -->
        <el-row>
          <div class="w-full mb-3">
            <el-row class="w-full bg-black rounded-3xl">
              <el-col v-if="renderMethod === 'gif'" :span="12">
                <div
                  class="w-full flex justify-center items-center h-9 rounded-3xl cursor-pointer text-white"
                  :class="{ 'radio-btn': op === 'Caption' }"
                  @click="op = 'Caption'"
                >
                  <span class="font-medium">Caption</span>
                </div>
              </el-col>
              <el-col :span="renderMethod === 'frame' ? 24 : 12">
                <div
                  class="w-full flex justify-center items-center h-9 rounded-3xl cursor-pointer text-white"
                  :class="{ 'radio-btn': op === 'Stickers' }"
                  @click="op = 'Stickers'"
                >
                  <span class="font-medium">Stickers</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-row>
        <!-- 操作目录结束 -->
        <!-- 详细操作项 -->
        <!-- Caption -->
        <div v-if="op === 'Caption'" class="w-full mt-1">
          <div>
            <!-- 要添加的文字输入框 -->
            <el-row class="mt-3 w-full">
              <el-input
                v-model="text"
                placeholder="Enter your caption"
                class="caption-input h-9"
              />
            </el-row>
            <!-- 要添加的文字输入框结束 -->
            <!-- 颜色选择 -->
            <el-row class="mt-1 mx-auto w-full" justify="space-between">
              <el-col :span="22">
                <el-row class="w-full">
                  <el-col
                    v-for="(color, index) in colors"
                    v-show="index < 12 || (index >= 12 && showMultiColors)"
                    :key="index"
                    :span="2"
                    class="px-1 mt-2"
                  >
                    <div
                      style="aspect-ratio: 1 / 1"
                      :style="{ background: color }"
                      :class="{ 'c-is-active': selectedColor === color }"
                      class="pointer rounded-sm w-full"
                      @click="selectedColor = color"
                    />
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="2">
                <div
                  class="w-3/4 h-9 flex rounded-sm justify-center items-center px-1 mt-2 cursor-pointer"
                  style="background: #2d2d2d"
                  @click="showMultiColors = !showMultiColors"
                >
                  <i-ep-arrow-up v-if="showMultiColors" color="#A5A5A5" />
                  <i-ep-arrow-down v-else color="#A5A5A5" />
                </div>
              </el-col>
            </el-row>
            <!-- 颜色选择结束 -->
          </div>
          <!-- 字体选择 -->
          <div class="py-5 w-full">
            <div class="text-white opacity-40 font-bold ml-2 text-sm">
              Style
            </div>
            <el-row class="mt-2 h-48 overflow-y-scroll" :gutter="10">
              <el-col
                v-for="fontFamily in fontFamilies"
                :key="fontFamily"
                :span="12"
                class="mt-2"
              >
                <div
                  class="text-white text-center py-2 pointer w-full rounded-lg font-bold secondary-box"
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
          <div class="w-full">
            <div class="text-white opacity-40 font-bold ml-2 text-sm">
              Font Size
            </div>
            <el-row class="mt-2" :gutter="10">
              <el-col :span="12">
                <div
                  class="w-full h-10 flex justify-center items-center rounded-lg cursor-pointer secondary-box"
                  style="color: #979797"
                  @click="textScale += 0.1"
                >
                  +
                </div>
              </el-col>
              <el-col :span="12">
                <div
                  class="w-full h-10 flex justify-center items-center rounded-lg cursor-pointer secondary-box"
                  style="color: #979797"
                  @click="
                    textScale = textScale > 0.2 ? textScale - 0.1 : textScale
                  "
                >
                  -
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- 字体大小调整结束 -->
        </div>
        <!-- Caption END -->
        <!-- Stickers -->
        <div v-if="op === 'Stickers'" class="w-full mt-1">
          <div class="py-2 flex justify-between">
            <div
              class="w-40 rounded-t-3xl cursor-pointer stickers-tag-input"
              :class="{ 'rounded-b-3xl': !visible }"
            >
              <el-popover
                placement="bottom-end"
                :visible="visible"
                :width="160"
                ref="popoverRef"
                :show-arrow="false"
                popper-class="h-36 overflow-y-auto !rounded-b-3xl !border-0"
                popper-style="background: #000000; opacity: 0.8; backdrop-filter: blur(6px);"
                :offset="-10"
              >
                <div class="m-auto px-3">
                  <div class="mt-3">
                    <div v-for="tag in stickersTags" :key="tag.id" class="mt-2">
                      <div
                        class="w-auto cursor-pointer border-white border-solid border rounded-3xl px-3 py-1 inline-block overflow-hidden text-ellipsis whitespace-nowrap"
                        style="max-width: 120px"
                        @click="handleTagSelect(tag.value)"
                      >
                        <span class="w-full text-white font-light text-sm">
                          # {{ tag.value }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <template #reference>
                  <div
                    class="w-full h-full rounded-3xl"
                    @click="visible = true"
                    v-click-outside="onClickOutside"
                  >
                    <div class="h-full flex justify-between items-center px-3">
                      <div>
                        <span class="text-white fw-bold"
                          ># {{ selectedTag }}</span
                        >
                      </div>
                      <div class="flex">
                        <el-icon class="text-white">
                          <i-ep-search color="#999999" />
                        </el-icon>
                      </div>
                    </div>
                  </div>
                </template>
              </el-popover>
            </div>
            <div class="w-1/4">
              <el-upload
                class="uploader"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleStickerUpload"
              >
                <div
                  class="w-full h-9 rounded-3xl flex justify-center items-center text-sm font-bold btn-bg"
                >
                  upload sticker
                </div>
              </el-upload>
            </div>
          </div>
          <stickers-list
            class="mt-1 py-2"
            :stickers="stickers"
            @select="handleStickerSelect"
          ></stickers-list>
        </div>
        <!-- Stickers End -->
        <!-- 详细操作项结束 -->
        <!-- 操作按钮  -->
        <div class="mt-1">
          <el-row class="pt-5">
            <div
              class="w-full h-10 rounded-3xl flex justify-center items-center text-sm font-bold cursor-pointer btn-bg"
              @click="handleDownload"
            >
              download
            </div>
          </el-row>
          <el-row>
            <div
              class="w-full h-9 rounded-3xl flex justify-center items-center text-sm underline cursor-pointer"
              style="color: #e6ff21"
              @click="handleUpload"
            >
              Upload to memefun
            </div>
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
import router from '@/router'
import { LocalLoadingSvg } from '@/assets/icon'

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
const showMultiColors = ref<boolean>(false)

const colors = ref<string[]>([
  'white',
  'black',
  'coral',
  'aquamarine',
  'blueviolet',
  'khaki',
  'fuchsia',
  'cyan',
  'red',
  'blue',
  'green',
  'yellow',
  'gray',
  'orange',
  'purple',
  'pink',
  'brown',
  'lime',
  'teal',
  'indigo',
  'violet',
  'beige',
  'gold',
  'silver',
])

const fontFamilies = ref<object[]>([
  { label: 'Default', name: 'Arial' },
  { label: 'MEME', name: 'Verdana' },
  { label: 'PIXEL', name: 'Times New Roman' },
  { label: 'Fancy', name: 'Georgia' },
  { label: 'Subtitle', name: 'Monaco' },
  { label: 'Fusion', name: 'Courier' },
  { label: 'ELEGANT', name: 'Helvetica' },
  { label: 'CLASSIC', name: 'Palatino' },
  { label: 'MODERN', name: 'Trebuchet MS' },
  { label: 'FUN', name: 'Comic Sans MS' },
  { label: 'BOLD', name: 'Impact' },
  { label: 'LUXURY', name: 'Lucida Sans Unicode' },
  { label: 'SLEEK', name: 'Century Gothic' },
  { label: 'CLEAN', name: 'Segoe UI' },
  { label: 'FRESH', name: 'Calibri' },
  { label: 'STYLISH', name: 'Candara' },
  { label: 'STRONG', name: 'Franklin Gothic Medium' },
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

const handleStickerUpload = (uploadFile) => {
  const reader = new FileReader()

  reader.readAsDataURL(uploadFile.raw)

  reader.onload = (e) => {
    uploadFileStore.updateUploadFile(
      '',
      e.target!.result.toString(),
      uploadFile,
      'sticker'
    )
    router.push({
      name: 'finalize',
    })
  }
}

const handleFusion = (result) => {
  sourceImageInfo.value.url = result.url
  sourceImageInfo.value.file = result.file
  renderMethod.value = 'gif'
}

onMounted(() => {
  boxWidth.value = sourceImageCanvasBox.value?.clientWidth
  getFileInfo()
  getOptionalTags()
  getStickers()
})
</script>

<style lang="less" scoped>
.radio-btn {
  border: 1px solid #e6ff21;
  color: #e6ff21;
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
  border: 1px solid #e6ff21;
  color: #e6ff21;
}
.c-not-active {
  border: 1px solid transparent;
}
.uploader {
  :deep(.el-upload) {
    width: 100%;
  }
}
.btn-bg {
  background: linear-gradient(90deg, #faffab 0%, #e7ff24 100%);
}
.stickers-tag-input {
  background: #000000;
  opacity: 0.8;
  backdrop-filter: blur(6px);
}
.caption-input {
  :deep(.el-input__wrapper) {
    background-color: white;
  }
  :deep(.el-input__wrapper input::placeholder) {
    font-size: 12px;
    color: #999999;
    line-height: 22px;
  }
  :deep(input) {
    color: black;
  }
}
.secondary-box {
  background: #2d2d2d;
  backdrop-filter: blur(2px);
}
</style>
