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

const CHANNEL_API_MAP: Record<string, string> = {
  '推荐': 'homefeed_recommend',
  '穿搭': 'homefeed_fashion',
  '美食': 'homefeed_food',
  '彩妆': 'homefeed_cosmetics',
  '影视': 'homefeed_movie',
  '职场': 'homefeed_career',
  '情感': 'homefeed_love',
  '家居': 'homefeed_household',
  '游戏': 'homefeed_gaming',
  '旅行': 'homefeed_travel',
  '健身': 'homefeed_fitness',
  '视频': 'homefeed_video',
}

// 记录各频道的分页状态，用于静态数据下的上拉无限加载
const channelPageMap = new Map<string, number>()

function isStaticEnvironment(): boolean {
  if (typeof window === 'undefined') return true
  // 显式指定了自定义 API
  if (import.meta.env?.VITE_API_BASE) return false
  const host = window.location.hostname
  // 本地开发或本地 Node 服务（localhost, 127.0.0.1）连接动态 /api/xhs/* 爬虫服务
  if (['localhost', '127.0.0.1', '0.0.0.0'].includes(host)) return false
  // 线上生产静态部署环境（如 GitHub Pages、静态 CDN 等）
  if (import.meta.env?.PROD) return true
  if (host.endsWith('github.io') || host.endsWith('gitee.io')) return true
  return true
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

  if (isStaticEnvironment()) {
    try {
      // 每次切 tab、刷新或上拉加载，均发起真实的同源 Fetch / Ajax 请求
      const fileKey = CHANNEL_API_MAP[ch] || 'homefeed_recommend'
      const action = opts.more ? 'loadmore' : 'refresh'
      const url = `./api/${fileKey}.json?page=${page}&action=${action}&t=${Date.now()}`
      const res = await fetch(url, { signal: opts.signal, headers: { Accept: 'application/json' } })
      if (res.ok) {
        const data = (await res.json()) as FeedResult
        const pool = data.notes || []
        if (pool.length > 0) {
          const pageSize = 10
          const start = ((page - 1) * pageSize) % pool.length
          const selected: Note[] = []
          for (let i = 0; i < pageSize; i++) {
            const raw = pool[(start + i) % pool.length]
            // 为上拉加载附加对应页码的唯一 ID，确保不会被前端 Set 过滤并能无限追加
            selected.push({
              ...raw,
              id: page > 1 ? `${raw.id}_p${page}_${i}` : raw.id,
              title: page > 1 ? `[${ch}·第${page}页] ${raw.title}` : raw.title,
            })
          }
          return {
            ...data,
            page,
            fetchedAt: new Date().toISOString(),
            notes: selected,
            count: selected.length,
          }
        }
      }
    } catch {
      /* 静默降级 */
    }
    return { ...getStaticFeed(ch, page, 10), page }
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
    /* 遇到风控或超时优雅回退到内置数据集，保证页面不白屏不报错 */
  }
  return { ...getStaticFeed(ch, page, 10), page }
}
