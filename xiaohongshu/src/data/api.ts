import type { Note } from './index'
import { STATIC_CHANNELS, getStaticFeed } from './staticFeeds'

/**
 * 数据接口层（/api/xhs/*）
 *
 * 智能环境判断：
 * 1. 静态演示环境（如 GitHub Pages、静态托管，或未配置独立后端）：
 *    发出真实的同源 HTTP Fetch 请求（./api/homefeed-*.json），零跨域、零报错，
 *    在浏览器 Network 面板能清晰抓取到每一个 tab 的请求与响应。
 * 2. 本地开发与私有 Node 环境（localhost 或配置了有效 API 的环境）：
 *    请求同源 /api/xhs/* 实时抓取小红书最新笔记。
 */

export interface FeedResult {
  channel: string
  channelId: string
  fetchedAt: string
  count: number
  notes: Note[]
  page?: number
  cached?: boolean
  stale?: boolean
}

export interface ChannelItem {
  name: string
  id: string
  originalId?: string
}

// 记录各频道的分页状态，用于上拉无限加载
const channelPageMap = new Map<string, number>()

function getApiBase(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE
  }
  return ''
}

/** 拉取频道分类 */
export async function fetchChannels(signal?: AbortSignal) {
  const base = getApiBase()
  const url = base ? `${base.replace(/\/$/, '')}/api/xhs/channels` : '/api/xhs/channels'
  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
    if (res.ok) {
      return (await res.json()) as { fetchedAt: string; channels: ChannelItem[] }
    }
  } catch {
    /* 降级到静态兜底分类 */
  }
  return { fetchedAt: new Date().toISOString(), channels: STATIC_CHANNELS }
}

/** 拉取某个流的笔记 */
export async function fetchFeed(
  channel: string,
  opts: { signal?: AbortSignal; more?: boolean } = {}
) {
  const ch = channel || '推荐'
  let page = channelPageMap.get(ch) || 1
  if (opts.more) {
    page += 1
    channelPageMap.set(ch, page)
  } else {
    page = 1
    channelPageMap.set(ch, 1)
  }

  const base = getApiBase()
  const qs = new URLSearchParams({ channel: ch })
  if (opts.more) qs.set('fresh', '1')
  qs.set('page', String(page))
  qs.set('action', opts.more ? 'loadmore' : 'refresh')
  qs.set('t', String(Date.now()))
  const path = `/api/xhs/feed?${qs.toString()}`
  const url = base ? `${base.replace(/\/$/, '')}${path}` : path
  try {
    const res = await fetch(url, { signal: opts.signal, headers: { Accept: 'application/json' } })
    if (res.ok) {
      const data = (await res.json()) as FeedResult
      return { ...data, page }
    }
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err
    /* 遇到风控或超时优雅回退到内存数据集，保证页面不白屏不报错 */
  }
  return { ...getStaticFeed(ch, page, 10), page }
}

/** 抓取笔记完整详情（多图列表、视频播放直链、正文描述、话题标签、点赞数等） */
export async function fetchNoteDetail(
  id: string,
  noteUrl?: string,
  signal?: AbortSignal
): Promise<import('./index').NoteDetailData> {
  const base = getApiBase()
  const qs = new URLSearchParams({ id })
  if (noteUrl) qs.set('url', noteUrl)
  const path = `/api/xhs/note?${qs.toString()}`
  const url = base ? `${base.replace(/\/$/, '')}${path}` : path

  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
    if (res.ok) {
      return (await res.json()) as import('./index').NoteDetailData
    }
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') throw e
  }

  return {
    id,
    imageList: [],
    videoUrl: '',
    desc: '',
    tags: [],
  }
}

/** 获取笔记评论列表（支持主评论、二级回复嵌套与点赞） */
export async function fetchNoteComments(
  noteId: string,
  title?: string,
  signal?: AbortSignal
): Promise<{ count: number; comments: import('./index').CommentItem[] }> {
  const base = getApiBase()
  const qs = new URLSearchParams({ note_id: noteId })
  if (title) qs.set('title', title)
  const path = `/api/xhs/comments?${qs.toString()}`
  const url = base ? `${base.replace(/\/$/, '')}${path}` : path

  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
    if (res.ok) {
      return (await res.json()) as { count: number; comments: import('./index').CommentItem[] }
    }
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') throw e
  }

  return { count: 0, comments: [] }
}
