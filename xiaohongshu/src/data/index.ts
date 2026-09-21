import raw from './notes.json'

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
}

interface NotesPayload {
  source: string
  fetchedAt: string
  count: number
  note: string
  channels: string[]
  notes: Note[]
}

const payload = raw as unknown as NotesPayload

/** 真实笔记列表（推荐流） */
export const NOTES: Note[] = payload.notes

/** 真实频道名（切换频道需要登录，见 README） */
export const CHANNELS: string[] = payload.channels

/** 数据抓取时间 */
export const FETCHED_AT: string = payload.fetchedAt

/** 数据来源 */
export const SOURCE_URL: string = payload.source

/** 每次「加载更多」追加的条数 */
export const PAGE_SIZE = 12
