/**
 * 只放类型与常量。
 * 数据不再有静态快照（原先的 notes.json / channels.json 已移除），
 * 全部改由运行时的 /api/xhs/* 实时抓取，见 ./api.ts。
 */

/** 单条笔记（字段来自小红书探索页 SSR 的真实数据） */
export interface Note {
  id: string
  title: string
  /** 封面直链（小红书 CDN，带时效） */
  cover: string
  coverWidth: number
  coverHeight: number
  type: 'normal' | 'video'
  /** 点赞数，原样保留「3.5万」这类格式 */
  likes: string
  author: {
    name: string
    avatar: string
  }
  /** 原站笔记链接（含 xsec_token） */
  noteUrl: string
  /** 详情扩展字段（可选） */
  desc?: string
  imageList?: string[]
  videoUrl?: string
  tags?: string[]
}

export interface NoteDetailData {
  id: string
  title?: string
  desc?: string
  type?: 'normal' | 'video'
  imageList?: string[]
  videoUrl?: string
  tags?: string[]
  time?: number | string | null
  interactInfo?: {
    likedCount?: string
    collectedCount?: string
    commentCount?: string
    shareCount?: string
  } | null
  user?: {
    name?: string
    avatar?: string
  }
}

/** 每次「上拉加载」追加的条数 */
export const PAGE_SIZE = 12
