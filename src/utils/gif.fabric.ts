import { gifToSprites } from '@/utils/gif.utils'
import { fabric } from 'fabric'
import GIF from 'gif.js'
import gifWorkerScript from '@/utils/gif.worker.js?url'
import { ParsedFrame } from 'gifuct-js'
import { ElLoading } from 'element-plus'

const [PLAY, PAUSE, STOP] = [0, 1, 2]
let curFramesIndex = 0

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

        curFramesIndex = framesIndex
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
        /**
         * gifRenderer 将gifuct-js提取的帧合并成gif
         *
         * 声明两个Canvas的原因：ctx.putImageData方法会覆盖画布之前的内容，导致像素缺失
         * （像素缺失的原因参考 gif optimization）
         *
         * @return gifUrl: string
         * @param modifiedContent
         * @param isFrame boolean
         */
        gifRenderer: (
          modifiedContent: fabric.Object[] | fabric.Object[][],
          isFrame?: boolean
        ): Promise<object> => {
          const gifCanvas = document.createElement('canvas')
          gifCanvas.width = frameWidth
          gifCanvas.height = frameHeight
          const gifCtx = gifCanvas.getContext('2d')!

          const frameCanvas = document.createElement('canvas')
          frameCanvas.width = frameWidth
          frameCanvas.height = frameHeight
          const frameCtx = frameCanvas.getContext('2d')!

          // 存储未渲染sticker的gifCanvas
          const tempCanvas = document.createElement('canvas')
          tempCanvas.width = frameWidth
          tempCanvas.height = frameHeight
          const tempCtx = tempCanvas.getContext('2d')!

          const gifEncoder = new GIF({
            workers: 4,
            quality: 1,
            workerScript: gifWorkerScript,
            width: frameWidth,
            height: frameHeight,
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
              gifCanvas.remove()
            })

            gifEncoder.on('progress', () => {
              // console.log(p)
            })

            let previousFrame: ParsedFrame | undefined
            let curFrameIndex = 0
            for (const frame of frames) {
              const frameImageData = new ImageData(
                frame.patch,
                frame.dims.width,
                frame.dims.height
              )

              if (previousFrame && previousFrame.disposalType === 2) {
                const { width, height, left, top } = previousFrame.dims
                tempCtx.clearRect(left, top, width, height)
              }

              frameCtx.putImageData(frameImageData, 0, 0)
              tempCtx.drawImage(frameCanvas, 0, 0)
              if (isFrame) {
                modifiedContent = modifiedContent as fabric.Object[][]
                modifiedContent[curFrameIndex].forEach((item) => {
                  item.render(frameCtx)
                })
              } else {
                modifiedContent = modifiedContent as fabric.Object[]
                modifiedContent.forEach((item) => {
                  item.render(frameCtx)
                })
              }

              gifCtx.drawImage(frameCanvas, 0, 0)

              gifEncoder.addFrame(gifCtx, {
                delay: frame.delay,
                copy: true,
                dispose: frame.disposalType,
              })

              if (previousFrame) {
                const { width, height, left, top } = previousFrame.dims
                gifCtx.clearRect(left, top, width, height)
                gifCtx.drawImage(tempCanvas, 0, 0)
              }

              previousFrame = frame
              curFrameIndex++
              tempCanvas.remove()
            }
            gifEncoder.render()
          })
        },
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

export function getCurFramesIndex() {
  return curFramesIndex
}
