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
  // GitHub Pages 域名
  if (host.endsWith('github.io') || host.endsWith('gitee.io')) return true
  // 非本地开发环境默认走静态 API
  return !['localhost', '127.0.0.1', '0.0.0.0'].includes(host)
}

function getApiBase(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE
  }
  return ''
}

/** 拉取频道分类 */
export async function fetchChannels(signal?: AbortSignal) {
  if (isStaticEnvironment()) {
    try {
      const res = await fetch('./api/channels.json', { signal, headers: { Accept: 'application/json' } })
      if (res.ok) {
        return (await res.json()) as { fetchedAt: string; channels: ChannelItem[] }
      }
    } catch {
      /* 静默降级 */
    }
    return { fetchedAt: new Date().toISOString(), channels: STATIC_CHANNELS }
  }

  const base = getApiBase()
  const url = base ? `${base.replace(/\/$/, '')}/api/xhs/channels` : '/api/xhs/channels'
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()) as { fetchedAt: string; channels: ChannelItem[] }
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

    try {
      // 每次切换 tab 或刷新，均发起真实的同源 Fetch 请求（命名匹配 homefeed）
      const url = `./api/homefeed-${encodeURIComponent(ch)}.json?t=${Date.now()}&fresh=${opts.more ? 1 : 0}`
      const res = await fetch(url, { signal: opts.signal, headers: { Accept: 'application/json' } })
      if (res.ok) {
        const data = (await res.json()) as FeedResult
        const pool = data.notes || []
        if (pool.length > 0) {
          const pageSize = 12
          const start = ((page - 1) * pageSize) % pool.length
          const selected: Note[] = []
          for (let i = 0; i < Math.min(pageSize, pool.length); i++) {
            selected.push(pool[(start + i) % pool.length])
          }
          return {
            ...data,
            fetchedAt: new Date().toISOString(),
            notes: selected,
            count: selected.length,
          }
        }
      }
    } catch {
      /* 静默降级 */
    }
    return getStaticFeed(ch, page, 12)
  }

  const base = getApiBase()
  const qs = new URLSearchParams({ channel: ch })
  if (opts.more) qs.set('fresh', '1')
  const path = `/api/xhs/feed?${qs.toString()}`
  const url = base ? `${base.replace(/\/$/, '')}${path}` : path
  const res = await fetch(url, { signal: opts.signal, headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()) as FeedResult
}
