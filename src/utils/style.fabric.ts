import { fabric } from 'fabric'
import trash from '@/assets/icon/trash.svg?url'
import flipX from '@/assets/icon/tool_hFlip.svg?url'

export class MemeFabric {
  name2ImgMap: Map<string, HTMLImageElement>
  instance: fabric.Object
  canvas: fabric.Canvas
  constructor(instance: fabric.Object, canvas: fabric.Canvas) {
    const trashImg = document.createElement('img')
    trashImg.src = trash
    const flipXImg = document.createElement('img')
    flipXImg.src = flipX
    this.name2ImgMap = new Map()
    this.name2ImgMap.set('trash', trashImg)
    this.name2ImgMap.set('flipX', flipXImg)

    this.instance = instance
    this.canvas = canvas

    this.init()
  }

  init = () => {
    this.instance.set({
      cornerSize: 24,
      borderColor: 'rgba(230, 255, 33, 0.4)',
      borderScaleFactor: 5,
      borderDashArray: [5, 5],
      cornerStyle: 'circle',
      cornerDashArray: [2, 2],
      cornerColor: '#E6FF21',
    })
    this.instance.setControlsVisibility({
      tl: false, //top-left
      mt: false, // middle-top
      tr: false, //top-right
      ml: false, //middle-left
      mr: false, //middle-right
      bl: false, // bottom-left
      mb: false, //middle-bottom
      br: true, //bottom-right,
      mtr: true, // rotate
    })

    this.canvas.on('mouse:move', (event) => {
      const pointer = this.canvas.getPointer(event.e)
      const rect = this.instance.getBoundingRect()
      // 计算鼠标位置与矩形边界的距离
      const isLeftIn =
        pointer.x >= rect.left - 32 && pointer.x <= rect.left + rect.width + 32
      const isTopIn =
        pointer.y >= rect.top && pointer.y <= rect.top + rect.height

      // 判断是否超出了阈值
      if (!isLeftIn || !isTopIn) {
        // 触发自定义的 mouseout 事件
        this.instance.fire('custom:mouseout')
      }
    })
  }

  addCustomControl = (controlName: string, callback: Function) => {
    if (controlName === 'trash') {
      this.instance.controls.deleteControl = this.generateControl(
        controlName,
        callback
      )
    } else if (controlName === 'flipX') {
      this.instance.controls.flipXControl = this.generateControl(
        controlName,
        callback
      )
    }
  }

  generateControl = (controlName: string, callback: Function) => {
    let instanceToCanvasRight =
      this.canvas.width! -
      this.instance.left! -
      this.instance.getBoundingRect().width
    const top = controlName === 'trash' ? -0.5 : -0.3

    return new fabric.Control({
      x: instanceToCanvasRight > 30 ? 0.6 : -0.6,
      y: top,
      offsetX: this.instance.cornerSize! / 2,
      offsetY: this.instance.cornerSize! / 2,
      cursorStyle: 'pointer',
      //@ts-ignore
      mouseUpHandler: callback,
      render: (ctx, left, top) => {
        const size = this.instance.cornerSize!
        ctx.save()

        ctx.translate(left, top)

        ctx.beginPath() // 开始绘制路径
        ctx.arc(0, 0, size / 1.5, 0, Math.PI * 2) // 绘制圆形背景
        ctx.fillStyle = 'rgba(0, 0, 0)'
        ctx.fill()

        ctx.drawImage(
          this.name2ImgMap.get(controlName)!,
          -size / 2,
          -size / 2,
          size,
          size
        )

        ctx.restore()
      },
    })
  }
}
