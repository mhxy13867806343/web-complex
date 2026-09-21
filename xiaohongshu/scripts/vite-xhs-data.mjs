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
import fs from 'node:fs/promises'
import path from 'node:path'
import {
  CHANNEL_FALLBACK,
  EXPLORE_URL,
  ROOT,
  applyChannelFix,
  channelUrl,
  extractFeeds,
  normalizeFeedItem,
  probe,
  resolveCookie,
  sleep,
} from './xhs-client.mjs'

/**
 * 带重试的探测。
 * 小红书对匿名访客会「间歇性」风控：偶尔把整站 302 跳到 /login，几分钟后又自行放行。
 * 所以遇到 302/非 200 不要立刻放弃，隔一会儿重试几次，绝大多数情况能过。
 */
async function probeRetry(url, cookie, tries = 3, gapMs = 1200) {
  let last = null
  for (let i = 0; i < tries; i++) {
    last = await probe(url, cookie)
    if (last.ok) return last
    if (i < tries - 1) await sleep(gapMs)
  }
  return last
}

/** 频道 id 缓存，避免每次都重新探一次探索页 */
let cache = { at: 0, list: [] }
const CACHE_MS = 10 * 60 * 1000

/** 同一次请求结果的短缓存，防止连点刷新把对方打挂 */
const feedCache = new Map()
const FEED_CACHE_MS = 20 * 1000

/**
 * 落盘缓存：小红书会间歇性把匿名访客 302 到登录页（风控），这时如果内存里没有数据，
 * 页面就会空掉。把每次成功抓到的结果写到磁盘，风控期间直接读回来顶上，
 * 这样「抓不到」也不会白屏（放在 node_modules/.cache 下，不进 git）。
 */
const DISK_DIR = path.join(ROOT, 'node_modules', '.cache', 'xhs')
const diskFile = (key) => path.join(DISK_DIR, encodeURIComponent(key) + '.json')
async function readDisk(key) {
  try {
    return JSON.parse(await fs.readFile(diskFile(key), 'utf8'))
  } catch {
    return null
  }
}
async function writeDisk(key, data) {
  try {
    await fs.mkdir(DISK_DIR, { recursive: true })
    await fs.writeFile(diskFile(key), JSON.stringify(data))
  } catch {
    /* 落盘失败无所谓，不影响主流程 */
  }
}

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
  const home = await probeRetry(EXPLORE_URL, cookie)
  const cats = home.categories.length > 0 ? home.categories.filter((c) => c.id) : []
  if (cats.length > 0) {
    const list = applyChannelFix(cats)
    cache = { at: Date.now(), list }
    void writeDisk('__channels__', list)
    return list
  }
  // 抓不到：内存 → 磁盘 → 兜底表
  const disk = await readDisk('__channels__')
  return applyChannelFix(
    cache.list.length > 0 ? cache.list : Array.isArray(disk) && disk.length ? disk : CHANNEL_FALLBACK
  )
}

function send(res, code, data) {
  const body = JSON.stringify(data)
  res.statusCode = code
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(body)
}

/** 抓一个流（推荐 or 频道）。
 * @param fresh 为 true 时绕过短缓存、现抓一批新笔记（上拉加载用）。
 *              小红书推荐流是随机的，所以 fresh 每次都能拿到和上次不一样的内容。 */
async function fetchFeed(channel, fresh = false) {
  if (!fresh) {
    const hit = feedCache.get(channel)
    if (hit && Date.now() - hit.at < FEED_CACHE_MS) return { ...hit.data, cached: true }
  }

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
  const r = await probeRetry(url, cookie)
  if (!r.ok) {
    // 重试仍失败：优先返回上一次抓到的好数据，让页面继续有内容，
    // 而不是直接 502 让前端显示「接口不可用」。内存 → 磁盘 依次兜底。
    const stale = feedCache.get(channel)?.data
    if (stale) {
      console.warn(`[api/xhs] ${channel} 抓取失败（HTTP ${r.status}），用内存里的上一次数据顶上`)
      return { ...stale, cached: true, stale: true }
    }
    const disk = await readDisk('feed:' + channel)
    if (disk) {
      console.warn(`[api/xhs] ${channel} 抓取失败（HTTP ${r.status}），用磁盘缓存顶上`)
      feedCache.set(channel, { at: Date.now(), data: disk })
      return { ...disk, cached: true, stale: true }
    }
    throw Object.assign(
      new Error(
        r.status === 302
          ? '小红书临时风控拦截（302 跳登录页），一般几分钟后自动恢复、无需登录；稍后点右上角刷新重试即可'
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
  void writeDisk('feed:' + channel, data)
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
        const fresh = u.searchParams.get('fresh') === '1'
        const data = await fetchFeed(channel, fresh)
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
