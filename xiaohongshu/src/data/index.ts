import channelsRaw from './channels.json'
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
  channelIds?: Record<string, string>
  notes: Note[]
}

/** 一个频道流（真实抓取） */
export interface ChannelFeed {
  name: string
  /** 小红书频道 id，如 homefeed.food_v3 */
  id: string
  count: number
  fetchedAt: string | null
  /** 是否本轮没抓到、沿用了旧数据 */
  stale: boolean
  notes: Note[]
}

interface ChannelsPayload {
  source: string
  fetchedAt: string
  withCookie: boolean
  note: string
  channels: ChannelFeed[]
}

const payload = raw as unknown as NotesPayload
const channelsPayload = channelsRaw as unknown as ChannelsPayload

/** 按时间倒序排（新抓的排前面） */
function byTime(a: string | null, b: string | null) {
  return new Date(b || 0).getTime() - new Date(a || 0).getTime()
}

/** 真实笔记列表（推荐流） */
export const NOTES: Note[] = payload.notes

/** 频道名（来自探索页真实数据） */
export const CHANNELS: string[] = payload.channels

/** 频道 id 映射 */
export const CHANNEL_IDS: Record<string, string> = payload.channelIds || {}

/**
 * 有真实数据的频道流。
 * 没抓到数据的频道（count === 0）会被过滤掉，不给用户看空列表。
 * 按抓取时间倒序，保证「上一次补抓过的频道」排在前面。
 */
export const CHANNEL_FEEDS: ChannelFeed[] = (channelsPayload.channels || [])
  .filter((c) => c.notes.length > 0)
  .sort((a, b) => byTime(a.fetchedAt, b.fetchedAt))

/** 按频道名取数据，取不到返回 undefined */
export function getChannelFeed(name: string): ChannelFeed | undefined {
  return CHANNEL_FEEDS.find((c) => c.name === name)
}

/** 频道数据抓取时间（取最新的一条） */
export const CHANNELS_FETCHED_AT: string = channelsPayload.fetchedAt

/** 频道数据是否带过登录 Cookie */
export const CHANNELS_WITH_COOKIE: boolean = channelsPayload.withCookie

/** 推荐流抓取时间 */
export const FETCHED_AT: string = payload.fetchedAt

/** 数据来源 */
export const SOURCE_URL: string = payload.source

/** 频道数据来源 */
export const CHANNELS_SOURCE_URL: string = channelsPayload.source

/** 每次「加载更多」追加的条数 */
export const PAGE_SIZE = 12
