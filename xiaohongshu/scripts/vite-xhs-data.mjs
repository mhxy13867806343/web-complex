/**
 * /api/xhs/* 接口实现：让页面刷新时能拿到「新的」真实数据。
 *
 * 这份文件同时被两处复用：
 *   - 开发环境：xhsDataServer() 作为 Vite 插件挂到 dev server 上（configureServer）。
 *   - 生产环境：buildXhsHandler() 被 scripts/server.mjs 直接挂到 Node http server 上。
 * 两者共用同一套抓取逻辑，避免两份实现漂移。
 *
 * 接口：
 *   GET /api/xhs/feed?channel=推荐   -> { channel, channelId, fetchedAt, count, notes }
 *   GET /api/xhs/channels            -> { channels: [{ name, id }] }
 */
import {
  CHANNEL_FALLBACK,
  EXPLORE_URL,
  applyChannelFix,
  channelUrl,
  extractFeeds,
  normalizeFeedItem,
  probe,
  resolveCookie,
} from './xhs-client.mjs'

/** 频道 id 缓存，避免每次都重新探一次探索页 */
let cache = { at: 0, list: [] }
const CACHE_MS = 10 * 60 * 1000

/** 同一次请求结果的短缓存，防止连点刷新把对方打挂 */
const feedCache = new Map()
const FEED_CACHE_MS = 20 * 1000

/** 登录 Cookie（启动后惰性读取一次） */
let resolvedCookie = null
async function getCookie() {
  if (resolvedCookie === null) {
    try {
      const { cookie } = await resolveCookie('')
      resolvedCookie = cookie
    } catch {
      resolvedCookie = ''
    }
  }
  return resolvedCookie
}

async function resolveChannels() {
  if (cache.list.length && Date.now() - cache.at < CACHE_MS) return cache.list
  const cookie = await getCookie()
  const home = await probe(EXPLORE_URL, cookie)
  const list = applyChannelFix(
    home.categories.length > 0
      ? home.categories.filter((c) => c.id)
      : CHANNEL_FALLBACK
  )
  if (list.length) cache = { at: Date.now(), list }
  return list
}

function send(res, code, data) {
  const body = JSON.stringify(data)
  res.statusCode = code
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(body)
}

/** 抓一个流（推荐 or 频道） */
async function fetchFeed(channel) {
  const hit = feedCache.get(channel)
  if (hit && Date.now() - hit.at < FEED_CACHE_MS) return { ...hit.data, cached: true }

  let url = EXPLORE_URL
  let channelId = 'homefeed_recommend'
  if (channel && channel !== '推荐') {
    const list = await resolveChannels()
    const target = list.find((c) => c.name === channel)
    if (!target) throw Object.assign(new Error(`未知频道：${channel}`), { code: 400 })
    channelId = target.id
    url = channelUrl(channelId)
  }

  const cookie = await getCookie()
  const r = await probe(url, cookie)
  if (!r.ok) {
    throw Object.assign(
      new Error(
        r.status === 302
          ? '小红书当前要求登录（302），稍等一会儿或配置 Cookie 后再试'
          : `小红书返回 HTTP ${r.status}`
      ),
      { code: 502 }
    )
  }

  const notes = extractFeeds(r.state).map(normalizeFeedItem).filter(Boolean)
  const data = {
    channel,
    channelId,
    fetchedAt: new Date().toISOString(),
    count: notes.length,
    notes,
  }
  feedCache.set(channel, { at: Date.now(), data })
  return { ...data, cached: false }
}

/**
 * 返回 connect 风格的请求处理器 (req, res) => void。
 * 约定：req.url 已经被去掉了 `/api/xhs` 前缀，即形如 `/feed?channel=推荐`。
 */
export function buildXhsHandler() {
  return async (req, res) => {
    const u = new URL(req.url || '/', 'http://localhost')
    try {
      if (u.pathname === '/feed') {
        const channel = u.searchParams.get('channel') || '推荐'
        const data = await fetchFeed(channel)
        return send(res, 200, data)
      }
      if (u.pathname === '/channels') {
        const list = await resolveChannels()
        return send(res, 200, {
          fetchedAt: new Date().toISOString(),
          channels: list.map((c) => ({ name: c.name, id: c.id })),
        })
      }
      return send(res, 404, { error: 'not found' })
    } catch (e) {
      console.warn('[api/xhs]', e?.message || e)
      return send(res, e?.code || 500, { error: e?.message || String(e) })
    }
  }
}

/** Vite 开发插件（仅 apply:'serve' 生效） */
export default function xhsDataServer() {
  return {
    name: 'xhs-data-server',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/xhs', buildXhsHandler())
      server.config.logger.info('  ➜  /api/xhs/feed?channel=<频道名>  实时抓取（仅开发环境）')
    },
  }
}
