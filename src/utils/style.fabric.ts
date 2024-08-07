import { fabric } from 'fabric'
import trash from '@/assets/icon/trash.svg?url'

export class memeFabric {
  trashImg: HTMLImageElement
  constructor() {
    this.trashImg = document.createElement('img')
    this.trashImg.src = trash
  }

  addDeleteControl = (
    instance: fabric.Object,
    canvas: fabric.Canvas,
    callback: Function
  ) => {
    instance.set({
      cornerSize: 24,
      borderColor: 'rgba(230, 255, 33, 0.4)',
      borderScaleFactor: 5,
      borderDashArray: [5, 5],
      cornerStyle: 'circle',
      cornerColor: '#E6FF21',
    })
    instance.setControlsVisibility({
      tl: false, //top-left
      mt: false, // middle-top
      tr: false, //top-right
      ml: false, //middle-left
      mr: false, //middle-right
      bl: false, // bottom-left
      mb: false, //middle-bottom
      br: false, //bottom-right,
      mtr: false, // rotate
    })
    let instanceToCanvasRight =
      canvas.width! - instance.left! - instance.getBoundingRect().width
    instance.controls.deleteControl = new fabric.Control({
      x: instanceToCanvasRight > 30 ? 0.5 : -0.5,
      y: -0.5,
      offsetX: instance.cornerSize! / 2,
      offsetY: instance.cornerSize! / 2,
      cursorStyle: 'pointer',
      //@ts-ignore
      mouseUpHandler: callback,
      render: (ctx, left, top) => {
        const size = instance.cornerSize!
        ctx.save()
        ctx.translate(left, top)
        ctx.drawImage(this.trashImg, -size / 2, -size / 2, size, size)
        ctx.fillStyle = 'pink'
        ctx.restore()
      },
    })

    canvas.on('mouse:move', (event) => {
      const pointer = canvas.getPointer(event.e)
      const rect = instance.getBoundingRect()
      // 计算鼠标位置与矩形边界的距离
      const isLeftIn =
        pointer.x >= rect.left - 32 && pointer.x <= rect.left + rect.width + 32
      const isTopIn =
        pointer.y >= rect.top && pointer.y <= rect.top + rect.height

      // 判断是否超出了阈值
      if (!isLeftIn || !isTopIn) {
        // 触发自定义的 mouseout 事件
        instance.fire('custom:mouseout')
      }
    })
  }
}
