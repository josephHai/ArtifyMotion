import { parseGIF, decompressFrames, ParsedFrame } from 'gifuct-js'

export async function gifToSprites(
  gif: string | File,
  maxWidth?: number,
  maxHeight?: number
) {
  const arrayBuffer = await getGifArrayBuffer(gif)
  const frames = decompressFrames(parseGIF(arrayBuffer), true)

  if (!frames[0]) {
    throw new Error('No frames found in gif')
  }
  const totalFrames = frames.length

  // get the frames dimensions and delay
  let width = frames[0].dims.width
  let height = frames[0].dims.height

  // set the scale ratio if any
  maxWidth = maxWidth || width
  maxHeight = maxHeight || height
  let scale = maxWidth / width
  if (scale === 1) scale = maxHeight / height
  const originalWidth = width
  const originalHeight = height
  width = width * scale
  height = height * scale

  const dataCanvas = document.createElement('canvas')
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const dataCtx = dataCanvas.getContext('2d')!
  const frameCanvas = document.createElement('canvas')
  frameCanvas.width = width
  frameCanvas.height = height
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const frameCtx = frameCanvas.getContext('2d')!

  // 4096 is the max canvas width in IE
  const framesPerSprite = Math.floor(4096 / width)
  const totalSprites = Math.ceil(totalFrames / framesPerSprite)

  let previousFrame: ParsedFrame | undefined
  const sprites: Array<HTMLCanvasElement> = []
  for (let spriteIndex = 0; spriteIndex < totalSprites; spriteIndex++) {
    const framesOffset = framesPerSprite * spriteIndex
    const remainingFrames = totalFrames - framesOffset
    const currentSpriteTotalFrames = Math.min(framesPerSprite, remainingFrames)

    const spriteCanvas = document.createElement('canvas')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const spriteCtx = spriteCanvas.getContext('2d')!
    spriteCanvas.width = width * currentSpriteTotalFrames
    spriteCanvas.height = height

    frames
      .slice(framesOffset, framesOffset + currentSpriteTotalFrames)
      .forEach((frame, i) => {
        const frameImageData = dataCtx.createImageData(
          frame.dims.width,
          frame.dims.height
        )
        frameImageData.data.set(frame.patch)
        dataCanvas.width = frame.dims.width
        dataCanvas.height = frame.dims.height
        dataCtx.putImageData(frameImageData, 0, 0)

        if (previousFrame?.disposalType === 2) {
          const { width, height, left, top } = previousFrame.dims
          frameCtx.clearRect(left, top, width, height)
        }

        // draw a frame from the imageData
        frameCtx.drawImage(
          dataCanvas,
          frame.dims.left * scale,
          frame.dims.top * scale,
          frame.dims.width * scale,
          frame.dims.height * scale
        )

        // add the frame to the sprite sheet
        spriteCtx.drawImage(frameCanvas, width * i, 0)

        previousFrame = frame
      })

    sprites.push(spriteCanvas)
    spriteCanvas.remove()
  }

  // clean the dom, dispose of the unused canvass
  dataCanvas.remove()
  frameCanvas.remove()

  return {
    framesPerSprite,
    sprites,
    frames,
    frameWidth: width,
    frameHeight: height,
    originalWidth,
    originalHeight,
    totalFrames,
  }
}

async function getGifArrayBuffer(gif: string | File): Promise<ArrayBuffer> {
  if (typeof gif === 'string') {
    return fetch(gif).then((resp) => resp.arrayBuffer())
  } else {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result as ArrayBuffer)
      reader.onerror = () => reject(reader.error)
      reader.readAsArrayBuffer(gif)
    })
  }
}
