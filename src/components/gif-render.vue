<template>
  <div
    :style="{
      width: boxWidth + 'px',
      height: boxHeight ? boxHeight + 'px' : 'auto',
    }"
  >
    <canvas id="source-image-canvas-gif" width="100%" height="auto"></canvas>
  </div>
</template>

<script setup lang="ts">
import { fabric } from 'fabric'
import { fabricGif } from '@/utils/gif.fabric'
import { memeFabric } from '@/utils/style.fabric'
import router from '@/router'
import { useUploadFileStore } from '@/stores'
import { ElMessage } from 'element-plus'

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
      return { url: '', width: 1, height: 1, file: undefined }
    },
  },
  text: {
    type: String,
    default: '',
  },
  textScale: {
    type: Number,
    default: 1,
  },
  selectedColor: {
    type: String,
    default: '',
  },
  selectedFontFamily: {
    type: String,
    default: '',
  },
  selectedStickerUrl: {
    type: String,
    default: '',
  },
})

// 画布对象
let sourceImageCanvas: fabric.Canvas
let isRunning = true

// gif渲染
const gifRender = () => {
  sourceImageCanvas = new fabric.Canvas('source-image-canvas-gif')
  const gifPromise = fabricGif(props.sourceImageInfo!.file!, props.boxWidth)

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
      if (isRunning) fabric.util.requestAnimFrame(render)
      else sourceImageCanvas.dispose()
    })
  })
}

// 文本操作相关
const fabricShadow = new fabric.Shadow({
  color: 'rgb(200, 200, 200)',
  offsetX: 1,
  offsetY: 1,
  blur: 1,
})
const fabricText = new fabric.Text(<string>props.text, {
  id: 'text',
  left: 0,
  top: 0,
  fontFamily: props.selectedFontFamily,
  fontSize: 16,
  fill: props.selectedColor,
  strokeWidth: 3,
  charSpacing: 36,
  shadow: fabricShadow,
  borderColor: 'rgb(255, 255, 255)',
  borderDashArray: [5, 2],
  cornerColor: 'rgb(255, 255, 255)',
})

// 监听文本内容及样式，监听贴纸选择
watch(
  () => props.text,
  (newValue) => {
    if (!sourceImageCanvas.getObjects().find((obj) => obj['id'] === 'text'))
      addText()
    fabricText.set('text', newValue)
  }
)
watch(
  () => props.selectedFontFamily,
  (newValue) => {
    fabricText.setOptions({ fontFamily: newValue })
  }
)
watch(
  () => props.selectedColor,
  (newValue) => {
    fabricText.setOptions({ fill: newValue })
  }
)
watch(
  () => props.selectedStickerUrl,
  (newValue) => {
    if (newValue) addSticker()
  }
)
watch(
  () => props.textScale,
  (newValue) => {
    fabricText.setOptions({
      scaleX: newValue,
      scaleY: newValue,
    })
  }
)

// 添加文本至画布
const addText = () => {
  const scale = props.boxWidth / props.sourceImageInfo.width

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
}

// 贴纸操作相关
// 画布上的贴纸对象
const stickersOnCanvas = ref<fabric.Image[]>([])

// 添加贴纸至画布
const addSticker = () => {
  fabric.Image.fromURL(
    props.selectedStickerUrl!,
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

// 文件操作
const uploadFileStore = useUploadFileStore()
let isBusy = false

// 监听图片Url
watch(
  () => props.sourceImageInfo!.url,
  (newValue) => {
    if (newValue) {
      if (!isBusy) handleSourceImageUrlChange()
      else {
        ElMessage({
          type: 'info',
          message: 'The program is busy, please try again later.',
          duration: 3 * 1000,
        })
      }
    }
  }
)
const handleSourceImageUrlChange = () => {
  const url = new URL(props.sourceImageInfo!.url)
  const searchParams = new URLSearchParams(url.search)
  const op = searchParams.get('op')

  if (!op) return
  isBusy = true
  canvasToGif(op)
}

// 画布转GIF
const canvasToGif = (op) => {
  const fabricText = sourceImageCanvas
    .getObjects()
    .find((obj) => obj['id'] === 'text')

  const link = document.createElement('a')
  const canvasBoxWidth = props.boxWidth
  const scale = canvasBoxWidth / props.sourceImageInfo.width

  fabricGif(props.sourceImageInfo!.file!)
    .then((gif) => {
      const tempFabricObjects = []
      stickersOnCanvas.value.forEach((item) => {
        const tempFabricImage = fabric.util.object.clone(item)
        tempFabricImage.left = item.left / scale
        tempFabricImage.top = item.top / scale
        tempFabricImage.scaleToWidth(item.getBoundingRect().width / scale)
        tempFabricImage.scaleToHeight(item.getBoundingRect().height / scale)
        tempFabricObjects.push(tempFabricImage)
      })
      if (fabricText) {
        const tempFabricText = fabric.util.object.clone(fabricText)
        tempFabricText.left = fabricText.left / scale
        tempFabricText.top = fabricText.top / scale
        tempFabricText.fontSize = fabricText['fontSize'] / scale
        tempFabricObjects.push(tempFabricText)
      }
      gif
        .gifRenderer(tempFabricObjects)
        .then((res) => {
          isBusy = false
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
        .catch((e) => {
          console.log(e)
          isBusy = false
        })
    })
    .catch((e) => {
      console.log(e)
      isBusy = false
    })
}

onMounted(() => {
  gifRender()
})

onBeforeUnmount(() => {
  isRunning = false
})
</script>

<style scoped lang="less"></style>
