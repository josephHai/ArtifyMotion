<template>
  <div style="min-height: 650px">
    <el-row justify="space-between">
      <!-- 待处理文件 -->
      <el-col :span="10">
        <el-row
          ref="sourceImageCanvasBox"
          class="w-100"
          v-loading="detectLoading"
          element-loading-text="Recognizing faces in progress..."
          element-loading-background="rgba(88, 88, 88, 1)"
        >
          <canvas id="source-image-canvas" class="image-box"></canvas>
        </el-row>
        <el-row justify="space-between" class="my-3">
          <el-slider
            v-model="curFrameIndex"
            class="slider-tooltip"
            :max="framesCount"
            @change="handleSliderChange"
            :disabled="sliderDisabled"
          />
          <el-text class="text-white" size="small">
            You can choose a frame from the GIF by sliding the button.
          </el-text>
        </el-row>
      </el-col>
      <!-- 待处理文件结束 -->
      <!-- 操作面板 -->
      <el-col :span="10" style="min-height: 650px" class="c-bg-secondary">
        <!-- 操作目录 -->
        <el-row>
          <el-radio-group class="w-100 op-radio-group" v-model="op">
            <el-row class="w-100">
              <el-col>
                <el-radio-button class="w-100" label="Stickers" />
              </el-col>
            </el-row>
          </el-radio-group>
        </el-row>
        <!-- 操作目录结束 -->
        <!-- 详细操作项 -->
        <!-- 替换头像选择 -->
        <div v-if="op === 'Stickers'" class="rounded-1 py-3 py-3">
          <el-row class="c-bg-secondary py-2">
            <el-col :span="12">
              <el-popover
                placement="bottom"
                :width="360"
                :visible="tagsSelectVisible"
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
                    @click="tagsSelectVisible = true"
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
            <!--            <el-col :span="10" class="text-end px-1">-->
            <!--              <el-upload-->
            <!--                ref="stickerUploadEl"-->
            <!--                :limit="1"-->
            <!--                :show-file-list="false"-->
            <!--                :http-request="stickerUpload"-->
            <!--                :before-upload="beforeChangeImgUpload"-->
            <!--                :on-success="handleFileSuccess"-->
            <!--                :on-exceed="handleExceed"-->
            <!--                class="uploader w-100"-->
            <!--              >-->
            <!--                <template #trigger>-->
            <!--                  <el-button-->
            <!--                    type="primary"-->
            <!--                    class="w-100 bg-transparent border-0 rounded-0 c-btn-bg-cold fw-bold mt-1"-->
            <!--                  >-->
            <!--                    Select File-->
            <!--                  </el-button>-->
            <!--                </template>-->
            <!--              </el-upload>-->
            <!--            </el-col>-->
          </el-row>
          <stickers-list
            class="c-bg-secondary mt-1 py-2"
            :stickers="stickers"
            @select="handleStickerSelect"
          ></stickers-list>
        </div>
        <!-- 替换头像选择结束 -->
        <!-- 详细操作项结束 -->
        <el-row class="mt-5">
          <el-button
            class="w-100 c-btn-bg-cold border-0 rounded-0 text-white fw-bold"
            @click="handleFile('preview')"
            >Preview</el-button
          >
        </el-row>
      </el-col>
      <!-- 操作面板结束 -->
    </el-row>
    <el-dialog
      v-model="previewDialogVisible"
      align-center
      class="preview-modal shadow"
      :close-on-click-modal="allowPreviewDialogClose"
      width="500"
      :show-close="false"
      :center="true"
    >
      <template #header>
        <span class="text-white fw-bold h5">Fusion result</span>
      </template>
      <el-divider />
      <el-image
        v-if="fusionResultUrl"
        fit="contain"
        style="width: 500px; height: auto"
        :src="fusionResultUrl"
      />
      <div v-else class="my-5 mx-3">
        <el-progress
          :text-inside="true"
          :stroke-width="26"
          :percentage="fusionProgress"
        />
      </div>
      <el-row>
        <el-col>
          <el-button
            class="w-100 c-btn-bg-cold border-0 rounded-0 text-white fw-bold my-2"
            @click="handleFile('download')"
            >download</el-button
          >
        </el-col>
        <!--        <el-col :span="12">-->
        <!--          <el-button-->
        <!--            class="w-100 border-0 text-black border-0 rounded-0 fw-bold"-->
        <!--            @click="handleFile('upload')"-->
        <!--            >Upload to memefun</el-button-->
        <!--          >-->
        <!--        </el-col>-->
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getFileDetails, getFilesList, getStickerTags } from '@/api/file'
import { useRoute } from 'vue-router'
import { fabricGif } from '@/utils/gif.fabric'
import { faceDetect, picFusion } from '@/api/creation'
import { fabric } from 'fabric'
import { ElMessage } from 'element-plus'
import { memeFabric } from '@/utils/style.fabric'
import { ClickOutside as vClickOutside } from 'element-plus'

// 全局变量
const op = ref<string>('Stickers')
const detectLoading = ref(false)
const sliderDisabled = ref(false)
const previewDialogVisible = ref(false)
const allowPreviewDialogClose = ref(true)

// 左侧图像渲染
// 变量声明
const sourceImageCanvasBox = ref<HTMLElement>()
let sourceImageCanvas: fabric.Canvas
const sourceImageInfo = ref<object>({ fid: null, url: '', width: 0, height: 0 })
const curFrameIndex = ref<number>(0)
const curFrameUrl = ref<string>()
const framesCount = ref<number>(0)

// 方法实现
// 画布初始化（设置画布大小）
const init = () => {
  const boxWidth = sourceImageCanvasBox.value?.$el.clientWidth
  sourceImageCanvas = new fabric.Canvas('source-image-canvas')
  sourceImageCanvas.setWidth(boxWidth)

  getFileDetails({ fid: useRoute().params.id }).then((res) => {
    sourceImageInfo.value.fid = res.data.fid
    const file_info = res.data.media.src

    sourceImageInfo.value.url = file_info.url
    sourceImageInfo.value.width = file_info.dims[0]
    sourceImageInfo.value.height = file_info.dims[1]
    sourceImageCanvas.setHeight(
      (boxWidth / sourceImageInfo.value.width) * sourceImageInfo.value.height
    )
    handleSliderChange()
  })
}

// 滑块拖动事件的处理，加载新的帧
const handleSliderChange = () => {
  removeSticker()
  fusionResultUrl.value = ''

  const tempCanvas = document.createElement('canvas')
  const gifPromise = fabricGif(sourceImageInfo.value.url)
  gifPromise.then((gif) => {
    framesCount.value = gif.totalFrames
    gif.perFrameRenderer(curFrameIndex.value, tempCanvas)

    tempCanvas.toBlob((blob) => {
      const file = new File([blob], 'img', { type: blob.type })
      detectLoading.value = true
      sliderDisabled.value = true
      handleFaceDetect(file)

      curFrameUrl.value = URL.createObjectURL(blob)
    })
  })
}

// 将特定帧渲染至画布
const curFrameRenderer = () => {
  const boxWidth = sourceImageCanvasBox.value?.$el.clientWidth

  fabric.Image.fromURL(curFrameUrl.value!, (img) => {
    img.selectable = false
    img.hoverCursor = 'default'
    img.scaleToWidth(boxWidth)

    sourceImageCanvas.add(img)
    addRect()
  })
}

// 画布上元素相关操作，包括rect的添加和删除、rect的点击事件、sticker的添加和删除
const addRect = () => {
  const boxWidth = sourceImageCanvasBox.value?.$el.clientWidth
  const scale = boxWidth / sourceImageInfo.value.width

  for (const item of detectResult.value) {
    const rect = new fabric.Rect({
      fill:
        item.id === selectedFaceInfo.value.id
          ? 'rgba(88, 88, 88, 0.8)'
          : 'transparent',
      stroke: 'white',
      strokeWidth: 2,
      selectable: false,
      hoverCursor: 'pointer',
    })
    rect.top = item.top * scale
    rect.left = item.left * scale
    rect.width = item.width * scale
    rect.height = item.height * scale

    sourceImageCanvas.add(rect)
    rect.on('mousedown', () => {
      selectedFaceInfo.value = item
      handleRectSelect()
      rect.set({
        fill: 'rgba(88, 88, 88, 0.8)',
      })
    })
  }
}

const removeRect = () => {
  const objectsOnCanvas = sourceImageCanvas.getObjects()
  for (const obj of objectsOnCanvas) {
    // obj as fabric.Rect目的在于避免 Redundant 检查警告
    if ((obj as fabric.Rect) instanceof fabric.Rect) {
      sourceImageCanvas.remove(obj)
    }
  }
}

const handleRectSelect = () => {
  const objectsOnCanvas = sourceImageCanvas.getObjects()
  for (const obj of objectsOnCanvas) {
    if ((obj as fabric.Rect) instanceof fabric.Rect) {
      ;(obj as fabric.Rect).set({
        fill: 'transparent',
      })
    }
  }
}

const addSticker = () => {
  removeSticker()
  fabric.Image.fromURL(selectedStickerInfo.value.url!, (img) => {
    const boxWidth = sourceImageCanvasBox.value?.$el.clientWidth
    const scale = boxWidth / sourceImageInfo.value.width

    img.set({
      left: selectedFaceInfo.value.left * scale,
      top: selectedFaceInfo.value.top * scale,
      selectable: true,
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
    })
    img['id'] = 'sticker'
    img.scaleToWidth(selectedFaceInfo.value.width * scale)
    img.scaleToHeight(selectedFaceInfo.value.height * scale)

    new memeFabric().addDeleteControl(img, sourceImageCanvas, () => {
      removeSticker()
      addRect()
    })

    sourceImageCanvas.add(img)
  })
}

const removeSticker = () => {
  const sticker = sourceImageCanvas
    .getObjects()
    .find((obj) => obj['id'] === 'sticker')
  if (sticker) {
    sticker.off('custom:mouseout')
    sourceImageCanvas.remove(sticker)
    sourceImageCanvas.renderAll()
  }
}

// 人脸替换，共三个步骤
// 步骤1 人脸识别
const detectResult = ref<object[]>()
const selectedFaceInfo = ref<object>({
  id: null,
  faceBase64: '',
  top: 0,
  left: 0,
  width: 0,
  height: 0,
})

const handleFaceDetect = (file) => {
  const data = new FormData()

  data.append('img', file)
  if (selectedFaceInfo.value.faceBase64)
    data.append('replaceFace', selectedFaceInfo.value.faceBase64)

  faceDetect(data).then((res) => {
    detectResult.value = res.data

    if (res.data.length) selectedFaceInfo.value = res.data[0]
    else {
      ElMessage({
        message:
          'We cannot recognize a face in this frame. Please select another frame or a different GIF animation.',
        type: 'info',
        duration: 5 * 1000,
      })
    }
    detectLoading.value = false
    sliderDisabled.value = false
    curFrameRenderer()
  })
}

// 步骤2 替换头像选择
const stickersTags = ref<object[]>([
  {
    id: 0,
    value: 'all',
  },
])
const selectedTag = ref('all')
const tagsSelectVisible = ref(false)
const stickers = ref<object[]>([])
const selectedStickerInfo = ref({ url: '', base64: '' })

// 选择方式1 从提供的头像中选择
const getOptionalTags = () => {
  getStickerTags().then((res) => {
    Array.prototype.push.apply(stickersTags.value, res.data)
  })
}

const onClickOutside = () => {
  tagsSelectVisible.value = false
}

const handleTagSelect = (tag) => {
  selectedTag.value = tag
  fusionResultUrl.value = ''
  tagsSelectVisible.value = false
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
  selectedStickerInfo.value.url = event.target.src
  fabric.Image.fromURL(
    event.target.src,
    (img) => {
      selectedStickerInfo.value.base64 = img.toDataURL({}).split(',')[1]
      removeRect()
      if (selectedFaceInfo.value.id) addSticker()
    },
    { crossOrigin: 'anonymous' }
  )
}

// 选择方式2 用户自己上传

// 步骤3 图片融合
const fusionResultUrl = ref<string>()
const fusionProgress = ref<number>(0)

const handleFile = (op) => {
  if (op === 'preview') {
    if (!selectedStickerInfo.value.base64 && !fusionResultUrl.value) {
      ElMessage({
        message: 'Please select a sticker!',
        type: 'error',
        duration: 3 * 1000,
      })
      return
    }
    previewDialogVisible.value = true
    if (!fusionResultUrl.value) allowPreviewDialogClose.value = false
    handlePicFusion()
  } else if (op === 'download') {
    ElMessage({
      message:
        "Right-click the image and select 'Save image as...' to download it.",
      type: 'success',
      duration: 3 * 1000,
    })
  }
}

const handlePicFusion = () => {
  if (fusionResultUrl.value) return
  const data = {
    fid: sourceImageInfo.value.fid.toString(),
    replaceFace: selectedFaceInfo.value.faceBase64,
    newFace: selectedStickerInfo.value.base64,
  }

  picFusion(JSON.stringify(data))
    .then((socket) => {
      socket.onmessage = (e) => {
        const res = JSON.parse(e.data)

        if (res.code != 200) {
          socket.close()
          previewDialogVisible.value = false
          ElMessage({
            message: res['msg'],
            type: 'error',
            duration: 3 * 1000,
          })
        } else {
          fusionProgress.value = Math.round(res.data.progress)
          fusionResultUrl.value = res.data.src
        }

        if (fusionResultUrl.value) allowPreviewDialogClose.value = true
      }
    })
    .catch((e) => {
      console.log(e)
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
.slider-tooltip {
  :deep(.el-slider__bar) {
    height: 16px;
    background: linear-gradient(
      45deg,
      var(--c-gradient-btn-bg-warm-start),
      var(--c-gradient-btn-bg-warm-end)
    );
  }
  :deep(.el-slider__runway) {
    height: 16px;
    background: white;
  }
  :deep(.el-slider__button) {
    height: 28px;
    position: absolute;
    bottom: 0;
    border-radius: 30%;
    border: solid 2px var(--c-gradient-btn-bg-warm-start);
  }
}
.image-box {
  width: 100%;
  height: auto;
  margin: 0 auto;
  :deep(.el-image__error) {
    background: transparent;
  }
  :deep(.el-image__placeholder) {
    background: transparent;
  }
}
.uploader {
  :deep(.el-upload) {
    width: 100%;
  }
}
.el-loading-spinner .circular {
  display: none !important;
}
</style>
<style lang="less">
.preview-modal {
  background: rgba(0, 0, 0);
  .el-dialog__body {
    padding: 0;
  }
}
</style>
