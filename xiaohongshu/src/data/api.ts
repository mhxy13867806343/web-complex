import type { Note } from './index'
import { STATIC_CHANNELS, getStaticFeed } from './staticFeeds'

/**
 * 数据接口层（/api/xhs/*）
 *
 * 智能环境判断：
 * 1. 静态演示环境（如 GitHub Pages、静态 CDN，或未配置后端的环境）：
 *    直接使用本地预置的高质量真实小红书数据池，零跨域、零报错、秒开，支持频道切换与无限加载。
 * 2. 本地开发与生产环境（localhost 或配置了有效 API 的环境）：
 *    请求同源 /api/xhs/* 实时抓取小红书最新笔记。
 */

export interface FeedResult {
  channel: string
  channelId: string
  fetchedAt: string
  count: number
  notes: Note[]
  cached?: boolean
  stale?: boolean
}

export interface ChannelItem {
  name: string
  id: string
  originalId?: string
}

// 记录各频道的分页状态，用于静态数据下的上拉无限加载
const channelPageMap = new Map<string, number>()

function isStaticEnvironment(): boolean {
  if (typeof window === 'undefined') return true
  // 显式指定了自定义 API
  if (import.meta.env?.VITE_API_BASE) return false
  const host = window.location.hostname
  // GitHub Pages 域名，直接使用静态数据，彻底杜绝跨域报错
  if (host.endsWith('github.io') || host.endsWith('gitee.io')) return true
  // 本地开发或 Node 服务托管时使用实时接口
  return !['localhost', '127.0.0.1', '0.0.0.0'].includes(host)
}

function getApiBase(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE
  }
  return ''
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const base = getApiBase()
  const url = base ? `${base.replace(/\/$/, '')}${path}` : path
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const j = (await res.json()) as { error?: string }
      if (j?.error) msg = j.error
    } catch {
      /* 保持默认信息 */
    }
    throw new Error(msg)
  }
  return (await res.json()) as T
}

/** 拉取频道分类 */
export async function fetchChannels(signal?: AbortSignal) {
  if (isStaticEnvironment()) {
    return { fetchedAt: new Date().toISOString(), channels: STATIC_CHANNELS }
  }
  try {
    return await get<{ fetchedAt: string; channels: ChannelItem[] }>('/api/xhs/channels', signal)
  } catch (err) {
    console.warn('[api] fetchChannels failed, using static channels:', err)
    return { fetchedAt: new Date().toISOString(), channels: STATIC_CHANNELS }
  }
}

/** 拉取某个流的笔记 */
export async function fetchFeed(
  channel: string,
  opts: { signal?: AbortSignal; more?: boolean } = {}
) {
  const ch = channel || '推荐'
  if (isStaticEnvironment()) {
    let page = channelPageMap.get(ch) || 1
    if (opts.more) {
      page += 1
      channelPageMap.set(ch, page)
    } else {
      page = 1
      channelPageMap.set(ch, 1)
    }
    return getStaticFeed(ch, page, 20)
  }

  const qs = new URLSearchParams({ channel: ch })
  if (opts.more) qs.set('fresh', '1')
  try {
    return await get<FeedResult>(`/api/xhs/feed?${qs.toString()}`, opts.signal)
  } catch (err) {
    console.warn(`[api] fetchFeed(${ch}) failed, using static fallback:`, err)
    return getStaticFeed(ch, 1, 20)
  }
}
