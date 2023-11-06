<template>
  <div
    :style="{
      width: boxWidth + 'px',
      height: boxHeight ? boxHeight + 'px' : 'auto',
    }"
    v-loading="renderLoading"
    element-loading-text="rendering..."
    element-loading-background="rgba(88, 88, 88, 1)"
  >
    <el-row>
      <canvas id="source-image-canvas-frame" width="100%"></canvas>
    </el-row>
    <el-row
      justify="space-around"
      class="mt-3 px-3 py-3 rounded-3 c-bg-secondary"
    >
      <!-- 大小位置调整 -->
      <el-col :span="16">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-button
              class="w-100 bg-transparent border-secondary"
              @click="handleOpClick('+')"
              ><icon-search-plus width="16" height="16"
            /></el-button>
          </el-col>
          <el-col :span="4">
            <el-button
              class="w-100 bg-transparent border-secondary"
              @click="handleOpClick('-')"
              ><icon-search-minus width="16" height="16"
            /></el-button>
          </el-col>
          <el-col :span="8">
            <el-button
              class="w-100 bg-transparent border border-secondary"
              @click="showPositionOptions = !showPositionOptions"
              text
              ><icon-switch width="16" height="16" />
              &nbsp;Position
            </el-button>
          </el-col>
          <el-col :span="8">
            <el-button
              class="w-100 bg-transparent border border-secondary"
              text
            >
              <el-col :span="16" class="text-white">
                <div>{{ playSpeed }}x</div>
              </el-col>
              <el-col :span="8">
                <div style="margin-bottom: -4px">
                  <i-ep-caret-top @click="changeSpeed('+')" />
                </div>
                <div>
                  <i-ep-caret-bottom @click="changeSpeed('-')" />
                </div>
              </el-col>
            </el-button>
          </el-col>
        </el-row>
        <el-row v-if="showPositionOptions">
          <!-- 位置调整 -->
          <el-row class="mt-3">
            <!-- 位置调整 up -->
            <el-row class="w-100">
              <el-col :span="8" :offset="8">
                <el-button
                  class="m-auto text-secondary fw-bold w-75 bg-transparent border-secondary"
                  @click="handleOpClick('up')"
                  round
                >
                  <i-ep-arrow-up />
                </el-button>
              </el-col>
            </el-row>
            <!-- 位置调整 up结束 -->
            <!-- 位置调整 left flip right -->
            <el-row el-row class="w-100 mt-3">
              <el-col :span="8">
                <el-button
                  class="m-auto text-secondary fw-bold w-75 bg-transparent border-secondary"
                  @click="handleOpClick('left')"
                  round
                >
                  <i-ep-arrow-left />
                </el-button>
              </el-col>
              <el-col :span="8">
                <el-button
                  class="m-auto text-secondary fw-bold w-75 bg-transparent border-secondary"
                  @click="handleOpClick('flip')"
                  round
                >
                  <icon-flip width="16" height="16" /> Flip
                </el-button>
              </el-col>
              <el-col :span="8">
                <el-button
                  class="m-auto text-secondary fw-bold w-75 bg-transparent border-secondary"
                  @click="handleOpClick('right')"
                  round
                >
                  <i-ep-arrow-right />
                </el-button>
              </el-col>
            </el-row>
            <!-- 位置调整 left flip right结束 -->
            <!-- 位置调整 down -->
            <el-row el-row class="w-100 mt-3">
              <el-col :span="8" :offset="8">
                <el-button
                  class="m-auto text-secondary fw-bold w-75 bg-transparent border-secondary"
                  @click="handleOpClick('down')"
                  round
                >
                  <i-ep-arrow-down />
                </el-button>
              </el-col>
            </el-row>
            <!-- 位置调整 down结束 -->
          </el-row>
          <!-- 位置调整结束 -->
        </el-row>
      </el-col>
      <!-- 大小位置调整结束 -->
      <el-col :span="8" class="text-end">
        <el-button
          class="c-btn-bg-warm border-0 m-auto text-white fw-bold w-75"
          @click="convertGif('fusion')"
        >
          <icon-edit width="24" height="24" class="mx-2" />
          Edit
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { fabric } from 'fabric'
import { fabricGif } from '@/utils/gif.fabric'
import { generateRandomString } from '@/utils/common'
import {
  IconEdit,
  IconSearchPlus,
  IconSearchMinus,
  IconFlip,
  IconSwitch,
} from '@/assets/icon'
import router from '@/router'
import { useUploadFileStore } from '@/stores'
import { sleep } from '@bassist/utils'
import { memeFabric } from '@/utils/style.fabric'

const props = defineProps({
  boxWidth: {
    type: Number,
    default: 100,
  },
  boxHeight: {
    type: Number,
    default: 0,
  },
  sourceImageInfo: {
    type: Object,
    default: () => {
      return { fid: null, url: '', width: 1, height: 1, file: undefined }
    },
  },
  selectedStickerUrl: {
    type: String,
    default: '',
  },
  trackResults: {
    type: Object<Array<FaceBox>>,
  },
})

const emits = defineEmits(['fusion'])
const uploadFileStore = useUploadFileStore()
const showPositionOptions = ref<boolean>(false)
const playSpeed = ref<number>(1)
const renderLoading = ref<boolean>(false)

interface FaceBox {
  id: string
  rectId: string
  stickerId: string
  stickerBase64: string
  faceBase64: string
  top: number
  left: number
  width: number
  height: number
  sizeRate: number
}
interface stickerStyle {
  sizeRate: 1.0
  flip: false
  leftSpan: 0
  topSpan: 0
}

// 画布对象
let sourceImageCanvas: fabric.Canvas
const framesCount = ref<number>(0)
const stickerBoxes = {}
let selectedFaceId: number = 1
let isRunning: boolean = true

const framesRender = () => {
  renderLoading.value = true
  sourceImageCanvas = new fabric.Canvas('source-image-canvas-frame')
  sourceImageCanvas.setWidth(props.boxWidth!)
  sourceImageCanvas.setHeight(
    (props.boxWidth / props.sourceImageInfo!.width) *
      props.sourceImageInfo!.height
  )

  const gifPromise = fabricGif(props.sourceImageInfo!.file!, props.boxWidth!)

  gifPromise.then((gif) => {
    renderLoading.value = false
    framesCount.value = gif.totalFrames
    let curFramesIndex = 0
    gif.image.set({
      top: 0,
      left: 0,
      selectable: false,
      hoverCursor: 'auto',
    })
    const result = props.trackResults
    let previousImage: fabric.Image
    const animate = async () => {
      if (previousImage) {
        sourceImageCanvas.remove(previousImage)
      }
      canvasRefresh()
      let newImage = gif.frameRenderer(curFramesIndex)
      previousImage = newImage
      sourceImageCanvas.add(newImage)
      Object.keys(result).forEach((id) => {
        const item = result![id]
        if (Object.keys(item.boxes)) {
          item.stickerId
            ? addSticker(
                item.boxes[curFramesIndex],
                stickerBoxes[item.stickerId],
                item.stickerStyle
              )
            : addRect(item.boxes[curFramesIndex])
        }
      })
      curFramesIndex = (curFramesIndex + 1) % gif.totalFrames
      await sleep(gif.delay / playSpeed.value)
      if (isRunning) fabric.util.requestAnimFrame(animate)
      else sourceImageCanvas.dispose()
    }
    animate()
  })
}

// 画布上元素相关操作，包括rect的添加和删除、rect的点击事件、sticker的添加和删除
/*
 * 添加rect到画布上
 *
 * @param item 包含rect的位置、大小信息
 */
const addRect = (item: FaceBox) => {
  const scale = props.boxWidth / props.sourceImageInfo?.width
  const rectId = 'rect' + generateRandomString(4)

  const rect = new fabric.Rect({
    id: rectId,
    fill: item.id == selectedFaceId ? 'rgba(88, 88, 88, 0.8)' : 'transparent',
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
    selectedFaceId = item.id as number
    handleRectSelect()
    rect.set({
      fill: 'rgba(88, 88, 88, 0.8)',
    })
  })
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

watch(
  () => props.selectedStickerUrl,
  (newValue) => {
    if (newValue) {
      if (Object.keys(props.trackResults!).length === 0) return
      const urlParts = props.selectedStickerUrl!.split('/')
      const stickerId =
        urlParts[urlParts.length - 1].split('.')[0] + selectedFaceId

      if (stickerId in stickerBoxes)
        props.trackResults![selectedFaceId].stickerId = stickerId
      else {
        fabric.Image.fromURL(
          props.selectedStickerUrl!,
          (img) => {
            stickerBoxes[stickerId] = img
            props.trackResults![selectedFaceId].stickerId = stickerId
          },
          { crossOrigin: 'anonymous' }
        )
      }
      props.trackResults![selectedFaceId].stickerStyle = {
        sizeRate: 1.0,
        flip: false,
        leftSpan: 0,
        topSpan: 0,
      }
    }
  }
)

/*
 * 添加sticker到画布上
 *
 * @param item 包含sticker的位置、大小信息
 * @param sticker 要添加的sticker对象
 * @param stickerStyle 包含sticker的大小、偏移、翻转信息
 */
const addSticker = (
  item: FaceBox,
  sticker: fabric.Image,
  stickerStyle: stickerStyle
) => {
  const newSticker = stickerModify(item, sticker, stickerStyle, true)
  if (newSticker) {
    new memeFabric().addDeleteControl(newSticker, sourceImageCanvas, () => {
      props.trackResults![selectedFaceId].stickerId = ''
    })
    if (item.id == selectedFaceId) sourceImageCanvas.setActiveObject(newSticker)
    sourceImageCanvas.add(newSticker)
  }
}

const stickerModify = (
  item: FaceBox,
  sticker: fabric.Image,
  stickerStyle: stickerStyle,
  isScale?: boolean
) => {
  if (!Object.keys(item).length) return

  const scale = isScale ? props.boxWidth / props.sourceImageInfo.width : 1
  const stickerId = 'sticker' + generateRandomString(4)
  const leftSpan =
    (item.width * (stickerStyle.sizeRate - 1)) / 2 - stickerStyle.leftSpan
  const topSpan =
    (item.height * (stickerStyle.sizeRate - 1)) / 2 - stickerStyle.topSpan

  sticker.set({
    left: (item.left - leftSpan) * scale,
    top: (item.top - topSpan) * scale,
    selectable: true,
    hoverCursor: 'pointer',
    lockMovementX: true,
    lockMovementY: true,
    lockScalingX: true,
    lockScalingY: true,
  })
  sticker['id'] = stickerId
  sticker.scaleToWidth(
    (item.width + item.width * (stickerStyle.sizeRate - 1)) * scale
  )
  sticker.scaleToHeight(
    (item.height + item.height * (stickerStyle.sizeRate - 1)) * scale
  )
  sticker.on('mousedown', () => {
    selectedFaceId = item.id as number
  })
  sticker.flipX = stickerStyle.flip
  return sticker
}

// 清除画布上的rect和sticker对象
const canvasRefresh = () => {
  sourceImageCanvas.getObjects().forEach((obj) => {
    if (
      obj['id'] &&
      (obj['id'].includes('rect') || obj['id'].includes('sticker'))
    ) {
      sourceImageCanvas.remove(obj)
    }
  })
}

/*
 * sticker处理，大小调整、位置调整、翻转
 *
 * @param op 对sticker调整操作，包含大小缩放、位置偏移、翻转
 */
const handleOpClick = (op) => {
  const item = props.trackResults![selectedFaceId].stickerStyle
  const sizeRate = item.sizeRate ? item.sizeRate : 1

  if (op === '+') {
    item.sizeRate = sizeRate + 0.1
  } else if (op === '-') {
    item.sizeRate = sizeRate - 0.1
  } else if (op === 'up') {
    item.topSpan -= 5
  } else if (op === 'down') {
    item.topSpan += 5
  } else if (op === 'left') {
    item.leftSpan -= 5
  } else if (op === 'right') {
    item.leftSpan += 5
  } else if (op === 'flip') {
    item.flip = !item.flip
  } else {
    console.error('unknown operation')
  }
}

const changeSpeed = (op) => {
  if (op === '+' && playSpeed.value < 2) {
    playSpeed.value = parseFloat((playSpeed.value + 0.1).toFixed(1))
    return
  }
  if (op === '-') {
    if (playSpeed.value > 0.1) {
      playSpeed.value = parseFloat((playSpeed.value - 0.1).toFixed(1))
      return
    }
    if (playSpeed.value == 0.1) {
      playSpeed.value = 0.05
      return
    }
    if (playSpeed.value === 0.05) {
      playSpeed.value = 0.01
      return
    }
  }
}

watch(
  () => props.sourceImageInfo?.url,
  () => {
    const url = new URL(props.sourceImageInfo!.url)
    const searchParams = new URLSearchParams(url.search)
    const op = searchParams.get('op')

    if (!op) return
    convertGif(op)
  }
)

// 将canvas上的gif转为url
const convertGif = (op: string) => {
  const result = props.trackResults
  const tempStickers: fabric.Object[][] = Array.from(
    { length: framesCount.value },
    () => []
  )

  for (
    let curFrameIndex = 0;
    curFrameIndex < framesCount.value;
    curFrameIndex++
  ) {
    Object.keys(result).forEach((id) => {
      const item = result![id]

      if (Object.keys(item.boxes) && item.stickerId) {
        stickerModify(
          item.boxes[curFrameIndex],
          stickerBoxes[item.stickerId],
          item.stickerStyle
        )?.clone((newSticker) => {
          tempStickers[curFrameIndex].push(newSticker)
        })
      }
    })
  }
  fabricGif(props.sourceImageInfo!.file!).then((gif) => {
    gif.mergeFramesToGif(tempStickers).then((result) => {
      if (op === 'fusion') emits('fusion', result)
      else if (op === 'download') {
        const link = document.createElement('a')
        link.href = result.url
        link.download = 'memefun.gif'
        link.click()
      } else if (op === 'upload') {
        uploadFileStore.updateUploadFile(result.url, '', result.file)
        router.replace({
          name: 'finalize',
        })
      } else {
        console.log('error')
      }
    })
  })
}

onMounted(() => {
  framesRender()
})
onUnmounted(() => {
  isRunning = false
})
</script>

<style scoped lang="less">
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
