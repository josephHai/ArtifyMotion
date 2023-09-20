import { gifToSprites } from '@/utils/gif.utils'
import { fabric } from 'fabric'
import GIF from 'gif.js'
import gifWorkerScript from '@/utils/gif.worker.js?url'
import { ParsedFrame } from 'gifuct-js'
import { ElMessage } from 'element-plus'

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
        /**
         * gifRenderer 将gifuct-js提取的帧合并成gif
         *
         * 声明两个Canvas的原因：ctx.putImageData方法会覆盖画布之前的内容，导致像素缺失
         * （像素缺失的原因参考 gif optimization）
         *
         * @return gifUrl: string
         * @param modifiedContent
         */
        gifRenderer: (modifiedContent: fabric.Object[]): Promise<object> => {
          const gifCanvas = document.createElement('canvas')
          gifCanvas.width = frameWidth
          gifCanvas.height = frameHeight
          const gifCtx = gifCanvas.getContext('2d')!

          const frameCanvas = document.createElement('canvas')
          frameCanvas.width = frameWidth
          frameCanvas.height = frameHeight
          const frameCtx = frameCanvas.getContext('2d')!

          const gifEncoder = new GIF({
            workers: 4,
            quality: 30,
            workerScript: gifWorkerScript,
            width: frameWidth,
            height: frameHeight,
          })

          return new Promise((resolve) => {
            gifEncoder.on('finished', (blob) => {
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
            for (const frame of frames) {
              const frameImageData = new ImageData(
                frame.patch,
                frame.dims.width,
                frame.dims.height
              )

              if (previousFrame && previousFrame.disposalType === 2) {
                const { width, height, left, top } = previousFrame.dims
                gifCtx.clearRect(left, top, width, height)
              }

              frameCtx.putImageData(frameImageData, 0, 0)
              modifiedContent.forEach((item) => {
                item.render(frameCtx)
              })

              gifCtx.drawImage(frameCanvas, 0, 0)
              gifEncoder.addFrame(gifCtx, {
                delay: frame.delay,
                copy: true,
                dispose: frame.disposalType,
              })

              previousFrame = frame
            }
            gifEncoder.render()
          })
        },
        /**
         * perFrameRenderer 渲染gif中的某一帧至canvas中
         *
         * @param frameIndex number 帧数
         * @param canvas HtmlCanvasElement 画布对象
         */
        perFrameRenderer: (frameIndex: number, canvas: HTMLCanvasElement) => {
          const frameCanvas = document.createElement('canvas')
          const frameCtx = frameCanvas.getContext('2d')!
          frameCanvas.width = originalWidth
          frameCanvas.height = originalHeight

          const ctx = canvas.getContext('2d')!
          canvas.width = frameWidth
          canvas.height = frameHeight

          ctx.clearRect(0, 0, originalWidth, originalHeight)

          for (let i = 0; i <= frameIndex; i++) {
            if (i > 0 && frames[i - 1]?.disposalType === 2) {
              ctx.clearRect(
                frames[i - 1].dims.left,
                frames[i - 1].dims.top,
                frameWidth,
                frameHeight
              )
            }
            try {
              const frameImageData = new ImageData(
                frames[i].patch,
                originalWidth,
                originalHeight
              )
              frameCtx.putImageData(frameImageData, 0, 0)
              ctx.drawImage(
                frameCanvas,
                0,
                0,
                originalWidth,
                originalHeight,
                0,
                0,
                frameWidth,
                frameHeight
              )
            } catch (DOMException) {
              ElMessage({
                message:
                  'There was an error parsing the animated image. Please choose another image.',
                type: 'error',
                duration: 3 * 1000,
              })
              return
            }
          }
        },
      }

      methods.play()

      resolve({
        ...methods,
        image,
        originalWidth,
        originalHeight,
        totalFrames,
      })
    })
  })
}
