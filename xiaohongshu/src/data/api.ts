import type { Note } from './index'

/**
 * 实时数据接口（/api/xhs/*）。
 *
 * 数据不再有静态快照：分类与笔记全部现抓。
 * - 开发环境：由 scripts/vite-xhs-data.mjs 这个 Vite 中间件提供
 * - 生产环境：由 scripts/server.mjs 这个 Node 服务提供（npm run start）
 * 如果部署成纯静态站点（没有 /api），页面会明确提示接口不可用，而不是显示假数据。
 */

export interface FeedResult {
  channel: string
  channelId: string
  fetchedAt: string
  count: number
  notes: Note[]
  cached?: boolean
}

export interface ChannelItem {
  name: string
  id: string
}

/** 内存缓存，避免切回去时重复请求同一个流 */
const feedCache = new Map<string, { at: number; data: FeedResult }>()
const FEED_TTL = 30 * 1000

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(path, { signal, headers: { Accept: 'application/json' } })
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

/** 实时拉取频道分类（分类也是从探索页现读的，不是写死的） */
export function fetchChannels(signal?: AbortSignal) {
  return get<{ fetchedAt: string; channels: ChannelItem[] }>('/api/xhs/channels', signal)
}

/** 实时拉取某个流的笔记 */
export async function fetchFeed(channel: string, signal?: AbortSignal, useCache = false) {
  if (useCache) {
    const hit = feedCache.get(channel)
    if (hit && Date.now() - hit.at < FEED_TTL) return { ...hit.data, cached: true }
  }
  const data = await get<FeedResult>(`/api/xhs/feed?channel=${encodeURIComponent(channel)}`, signal)
  feedCache.set(channel, { at: Date.now(), data })
  return data
}
