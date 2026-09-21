import type { Note } from './index'
import { FALLBACK_CHANNELS, getFallbackFeed } from './fallback'

/**
 * 实时数据接口（/api/xhs/*）。
 *
 * 数据机制：
 * - 本地开发/生产 Node 环境：通过当前域名下的 /api/xhs/* 实时抓取。
 * - GitHub Pages 等纯静态环境：优先向已部署的独立在线接口服务请求；
 *   若遇远程服务网络阻断或风控，自动无缝降级到本地精选兜底数据，确保页面稳定可用。
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
}

const DEFAULT_REMOTE_API = 'https://xhs-explore.app.workbuddy.host'

function getApiBase(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE
  }
  if (typeof window !== 'undefined') {
    // 若在 GitHub Pages (github.io) 等静态托管环境，代理到已上线的后端服务
    if (window.location.hostname.endsWith('github.io')) {
      return DEFAULT_REMOTE_API
    }
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

/** 实时拉取频道分类 */
export async function fetchChannels(signal?: AbortSignal) {
  try {
    return await get<{ fetchedAt: string; channels: ChannelItem[] }>('/api/xhs/channels', signal)
  } catch (err) {
    console.warn('[api] fetchChannels failed, using fallback channels:', err)
    return { fetchedAt: new Date().toISOString(), channels: FALLBACK_CHANNELS }
  }
}

/** 实时拉取某个流的笔记 */
export async function fetchFeed(
  channel: string,
  opts: { signal?: AbortSignal; more?: boolean } = {}
) {
  const qs = new URLSearchParams({ channel })
  if (opts.more) qs.set('fresh', '1')
  try {
    return await get<FeedResult>(`/api/xhs/feed?${qs.toString()}`, opts.signal)
  } catch (err) {
    console.warn(`[api] fetchFeed(${channel}) failed, using fallback feed:`, err)
    return getFallbackFeed(channel)
  }
}
