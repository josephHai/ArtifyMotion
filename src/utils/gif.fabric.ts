import { gifToSprites } from '@/utils/gif.utils'
import { fabric } from 'fabric'
import GIF from 'gif.js'
import gifWorkerScript from '@/utils/gif.worker.js?url'
import { ElLoading } from 'element-plus'

const [PLAY, PAUSE, STOP] = [0, 1, 2]

export async function fabricGif(
  gif: string | File,
  maxWidth?: number,
  maxHeight?: number
): Promise<unknown> {
  const {
    framesPerSprite,
    sprites,
    frames,
    frameWidth,
    frameHeight,
    originalWidth,
    originalHeight,
    totalFrames,
  } = await gifToSprites(gif, maxWidth, maxHeight)

  const delay = frames[0].delay
  const frameRenderer = (framesIndex: number) => {
    const img = document.createElement('img')
    const image = new fabric.Image(img)
    image.width = frameWidth
    image.height = frameHeight
    image.set({
      top: 0,
      left: 0,
      selectable: false,
      hoverCursor: 'auto',
    })
    image._render = (ctx) => {
      const spriteIndex = Math.floor(framesIndex / framesPerSprite)

      ctx.drawImage(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        sprites[spriteIndex]!,
        frameWidth * (framesIndex % framesPerSprite),
        0,
        frameWidth,
        frameHeight,
        -frameWidth / 2,
        -frameHeight / 2,
        frameWidth,
        frameHeight
      )
    }
    return image
  }

  /**
   * mergeFramesToGif 将帧合并成gif
   *
   * 声明两个Canvas的原因：ctx.putImageData方法会覆盖画布之前的内容，导致像素缺失
   * （像素缺失的原因参考 gif optimization）
   *
   * @param modifiedContent
   * @return gifUrl: string
   */
  const mergeFramesToGif = (
    modifiedContent: fabric.Object[] | fabric.Object[][]
  ) => {
    const canvas = document.createElement('canvas')
    canvas.width = frameWidth
    canvas.height = frameHeight
    const ctx = canvas.getContext('2d')!
    const gifEncoder = new GIF({
      workers: 4,
      quality: 1,
      workerScript: gifWorkerScript,
      width: canvas.width,
      height: canvas.height,
    })
    return new Promise((resolve) => {
      const options = {
        fullscreen: true,
        lock: true,
        text: 'generating...',
        background: 'rgba(88, 88, 88, 0.8)',
      }
      const loadingInstance = ElLoading.service(options)
      gifEncoder.on('finished', (blob) => {
        loadingInstance.close()
        resolve({
          url: URL.createObjectURL(blob),
          file: new File([blob], 'memefun', {
            type: blob.type,
          }),
        })
        canvas.remove()
      })

      gifEncoder.on('progress', () => {
        // console.log(p)
      })
      for (let framesIndex = 0; framesIndex < totalFrames; framesIndex++) {
        frameRenderer(framesIndex).render(ctx)
        if (Array.isArray(modifiedContent[0])) {
          modifiedContent = modifiedContent as fabric.Object[][]
          modifiedContent[framesIndex].forEach((item) => {
            item.render(ctx)
          })
        } else {
          modifiedContent = modifiedContent as fabric.Object[]
          modifiedContent.forEach((item) => {
            item.render(ctx)
          })
        }
        gifEncoder.addFrame(ctx, {
          delay: delay,
          copy: true,
          dispose: frames[framesIndex].disposalType,
        })
      }
      gifEncoder.render()
    })
  }

  const frameCanvas = document.createElement('canvas')
  frameCanvas.width = frameWidth
  frameCanvas.height = frameHeight
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const frameCtx = frameCanvas.getContext('2d')!

  frameCtx.drawImage(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    sprites[0]!,
    0,
    0,
    frameWidth,
    frameHeight
  )

  return new Promise((resolve) => {
    fabric.Image.fromURL(frameCanvas.toDataURL(), (image) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const firstFrame = frames[0]!
      let framesIndex = 0
      let start = performance.now()
      let status: number
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      let accumulatedDelay = firstFrame.delay

      image.width = frameWidth
      image.height = frameHeight
      image._render = function (ctx) {
        if (status === PAUSE || (status === STOP && framesIndex === 0)) return
        const now = performance.now()
        const delta = now - start
        if (delta > accumulatedDelay) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          accumulatedDelay += frames[framesIndex]!.delay
          framesIndex++
        }
        if (framesIndex === totalFrames || status === STOP) {
          framesIndex = 0
          start = now
          accumulatedDelay = firstFrame.delay
        }

        const spriteIndex = Math.floor(framesIndex / framesPerSprite)

        ctx.drawImage(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          sprites[spriteIndex]!,
          frameWidth * (framesIndex % framesPerSprite),
          0,
          frameWidth,
          frameHeight,
          -frameWidth / 2,
          -frameHeight / 2,
          frameWidth,
          frameHeight
        )
      }

      const methods = {
        play: () => {
          status = PLAY
          image.dirty = true
        },
        pause: () => {
          status = PAUSE
          image.dirty = false
        },
        stop: () => {
          status = STOP
          image.dirty = false
        },
        getStatus: () => ['Playing', 'Paused', 'Stopped'][status],
        frameRenderer,
        mergeFramesToGif,
      }

      methods.play()

      resolve({
        ...methods,
        image,
        originalWidth,
        originalHeight,
        totalFrames,
        delay,
      })
    })
  })
}
