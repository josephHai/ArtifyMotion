<template>
  <div style="min-height: 650px">
    <el-row justify="space-between">
      <!-- 图片预览 -->
      <el-col :span="10" ref="sourceImageCanvasBox">
        <canvas id="source-image-canvas" width="100%" height="auto"></canvas>
      </el-col>
      <!-- 图片预览结束 -->
      <!-- 操作面板 -->
      <el-col :span="10" style="min-height: 650px">
        <!-- 操作目录 -->
        <el-row>
          <el-radio-group class="w-100 op-radio-group" v-model="op">
            <el-row class="w-100">
              <el-col :span="12">
                <el-radio-button class="w-100" label="Caption" />
              </el-col>
              <el-col :span="12">
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
                @input="handleInput"
              />
            </el-row>
            <!-- 要添加的文字输入框结束 -->
            <!-- 颜色选择 -->
            <el-row class="px-3 mt-2 mx-0 w-100" justify="space-between">
              <el-col v-for="color in colors" :key="color" :span="2">
                <div
                  style="width: 100%; aspect-ratio: 1 / 1"
                  :style="{ background: color }"
                  :class="{ 'c-is-active': selectColor === color }"
                  class="pointer"
                  @click="selectColor = color"
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
                    'c-is-active': selectFontFamily === fontFamily.name,
                    'c-not-active': selectFontFamily !== fontFamily.name,
                  }"
                  @click="selectFontFamily = fontFamily.name"
                >
                  {{ fontFamily.label }}
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- 字体选择结束 -->
        </div>
        <!-- Caption END -->
        <!-- Stickers -->
        <div v-if="op === 'Stickers'" class="w-100 mt-1">
          <div class="c-bg-secondary py-2">
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
          </div>
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
              @click="handleFile('download')"
              >download</el-button
            >
          </el-row>
          <!--          <el-row>-->
          <!--            <el-button-->
          <!--              class="w-100 bg-transparent border-0 text-white fw-bold"-->
          <!--              @click="handleFile('upload')"-->
          <!--              >Upload to memefun</el-button-->
          <!--            >-->
          <!--          </el-row>-->
        </div>
        <!-- 操作按钮结束 -->
      </el-col>
      <!-- 操作面板结束 -->
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { fabric } from 'fabric'
import { fabricGif } from '@/utils/gif.fabric'
import { getFileDetails, getFilesList, getStickerTags } from '@/api/file'
import { useRoute } from 'vue-router'
import { useUploadFileStore } from '@/stores'
import router from '@/router'
import { memeFabric } from '@/utils/style.fabric'
import { ClickOutside as vClickOutside } from 'element-plus'

// global variable
const op = ref<string>('Caption')
const uploadFileStore = useUploadFileStore()

// 1. 添加文本
let sourceImageCanvas: fabric.Canvas
const sourceImageCanvasBox = ref<HTMLElement>()
const sourceImageInfo = ref<object>({ fid: null, url: '', width: 0, height: 0 })
const text = ref<string>('')
const selectColor = ref<string>('black')
const selectFontFamily = ref<string>('Arial')

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

const fabricShadow = new fabric.Shadow({
  color: 'rgb(200, 200, 200)',
  offsetX: 1,
  offsetY: 1,
  blur: 1,
})

const init = () => {
  sourceImageCanvas = new fabric.Canvas('source-image-canvas')
  getFileDetails({ fid: useRoute().params.id }).then((res) => {
    const file_info = res.data.media.src

    sourceImageInfo.value.url = file_info.url
    sourceImageInfo.value.width = file_info.dims[0]
    sourceImageInfo.value.height = file_info.dims[1]
    gifRenderer()
  })
}

const gifRenderer = () => {
  const canvasBoxWidth = sourceImageCanvasBox.value.$el.clientWidth
  const gifPromise = fabricGif(sourceImageInfo.value.url, canvasBoxWidth)

  gifPromise.then((gif) => {
    sourceImageCanvas.setDimensions({
      width: gif.image.width,
      height: gif.image.height,
    })
    gif.image.set({
      top: 0,
      left: 0,
      selectable: false,
      hoverCursor: 'auto',
    })
    sourceImageCanvas.add(gif.image)
    fabric.util.requestAnimFrame(function render() {
      sourceImageCanvas.renderAll()
      fabric.util.requestAnimFrame(render)
    })
  })
}

const handleInput = () => {
  const fabricText = sourceImageCanvas
    .getObjects()
    .find((obj) => obj['id'] === 'text')
  if (!fabricText) addText()
}

const addText = () => {
  const fabricText = new fabric.Text(text.value, {
    id: 'text',
    left: 0,
    top: 0,
    fontFamily: selectFontFamily.value,
    fontSize: 16,
    fill: selectColor.value,
    strokeWidth: 3,
    charSpacing: 36,
    shadow: fabricShadow,
    borderColor: 'rgb(255, 255, 255)',
    borderDashArray: [5, 2],
    cornerColor: 'rgb(255, 255, 255)',
  })
  const canvasBoxWidth = sourceImageCanvasBox.value.$el.clientWidth
  const scale = canvasBoxWidth / sourceImageInfo.value.width

  fabricText.fontSize = fabricText.fontSize * scale
  new memeFabric().addDeleteControl(fabricText, sourceImageCanvas, () => {
    sourceImageCanvas.remove(fabricText)
  })

  fabricText.on('mouseover', () => {
    sourceImageCanvas.setActiveObject(fabricText)
    fabricText.set({
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    })
    sourceImageCanvas.renderAll()
  })

  fabricText.on('mouseout', () => {
    sourceImageCanvas.discardActiveObject()
    fabricText.set({
      backgroundColor: 'transparent',
    })
    sourceImageCanvas.renderAll()
  })

  sourceImageCanvas.add(fabricText)
  handleTextOptionChange(fabricText)
}

// 监听文本样式选项改变
const handleTextOptionChange = (fabricText) => {
  watch(text, (newValue) => {
    fabricText.set('text', newValue)
  })
  watch(selectFontFamily, (newValue) => {
    fabricText.setOptions({ fontFamily: newValue })
  })
  watch(selectColor, (newValue) => {
    fabricText.setOptions({ fill: newValue })
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
const stickersOnCanvas = ref<fabric.Image[]>([])
const selectedStickerUrl = ref<string>()

const getOptionalTags = () => {
  getStickerTags().then((res) => {
    Array.prototype.push.apply(stickersTags.value, res.data)
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
    stickers.value = res.data
  })
}

const handleStickerSelect = (event) => {
  selectedStickerUrl.value = event.target.src
  addSticker()
}

const addSticker = () => {
  fabric.Image.fromURL(
    selectedStickerUrl.value!,
    (img) => {
      img.set({
        left: 0,
        top: 0,
        selectable: true,
      })
      img.scaleToWidth(120)

      new memeFabric().addDeleteControl(
        img,
        sourceImageCanvas,
        (eventData, transform) => {
          let target = transform.target
          stickersOnCanvas.value.splice(stickersOnCanvas.value.indexOf(target))
          sourceImageCanvas.remove(target)
        }
      )

      img.on('mouseover', () => {
        sourceImageCanvas.setActiveObject(img)
        sourceImageCanvas.renderAll()
      })

      img.on('mouseout', () => {
        sourceImageCanvas.discardActiveObject()
        sourceImageCanvas.renderAll()
      })

      sourceImageCanvas.add(img)
      stickersOnCanvas.value.push(img)
    },
    { crossOrigin: '' }
  )
}

// 3. 将canvas转为gif
const handleFile = (op) => {
  const fabricText = sourceImageCanvas
    .getObjects()
    .find((obj) => obj['id'] === 'text')

  const link = document.createElement('a')
  const canvasBoxWidth = sourceImageCanvasBox.value.$el.clientWidth
  const scale = canvasBoxWidth / sourceImageInfo.value.width

  fabricGif(sourceImageInfo.value.url).then((gif) => {
    const tempFabricImages = []
    stickersOnCanvas.value.forEach((item) => {
      const tempFabricImage = fabric.util.object.clone(item)
      tempFabricImage.left = item.left / scale
      tempFabricImage.top = item.top / scale
      tempFabricImage.scaleToWidth(item.getBoundingRect().width / scale)
      tempFabricImage.scaleToHeight(item.getBoundingRect().height / scale)
      tempFabricImages.push(tempFabricImage)
    })
    if (fabricText) {
      const tempFabricText = fabric.util.object.clone(fabricText)
      tempFabricText.left = fabricText.left / scale
      tempFabricText.top = fabricText.top / scale
      tempFabricText.fontSize = fabricText['fontSize'] / scale
      tempFabricImages.push(tempFabricText)
    }
    gif.gifRenderer(tempFabricImages).then((res) => {
      if (op === 'download') {
        link.href = res['url']
        link.download = 'memefun.gif'
        link.click()
      } else if (op === 'upload') {
        uploadFileStore.updateUploadFile('', res['url'], res['file'])
        router.push({
          name: 'finalize',
        })
      } else {
        console.log('error')
      }
    })
  })
}

onMounted(() => {
  init()
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
