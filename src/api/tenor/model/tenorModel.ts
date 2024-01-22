class BaseParamsModel {
  key = 'AIzaSyBZIa8XY4B0PjVqdTNezmvj6gyfzzXUmic'
  client_key = 'tenor_web'
}

export class PageParamsModel extends BaseParamsModel {
  contentfilter = 'high'
  media_filter = 'gif, tinygif'
  ar_range = 'standard'
  limit = 20
  pos?: string | number
  q?: string
  ids?: string
}

interface GifObject {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface ResponseObject {
  id: string
  title: string
  media_formats: {
    nanogifpreview: GifObject
    tinygif: GifObject
    tinymp4: GifObject
    nanowebppreview_transparent: GifObject
    gif_transparent: GifObject
    mediumgif: GifObject
    nanogif: GifObject
    nanowebm: GifObject
    tinygif_transparent: GifObject
    mp4: GifObject
    gifpreview_transparent: GifObject
    webppreview_transparent: GifObject
    nanogifpreview_transparent: GifObject
    tinygifpreview_transparent: GifObject
    nanomp4: GifObject
    tinywebm: GifObject
    gifpreview: GifObject
    loopedmp4: GifObject
    png_transparent: GifObject
    tinygifpreview: GifObject
    gif: GifObject
    tinywebppreview_transparent: GifObject
    nanowebp_transparent: GifObject
    tinywebp_transparent: GifObject
    nanogif_transparent: GifObject
    webp_transparent: GifObject
    webm: GifObject
  }
  created: number
  content_description: string
  itemurl: string
  tags: string[]
  flags: string[]
  hasaudio: boolean
}

export interface PageResultModel {
  locale: string
  next: string | number
  results: ResponseObject[]
}
