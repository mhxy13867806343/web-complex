/**
 * 小红书网页版抓取客户端（被 /api/xhs 接口层与 login.mjs 共用）
 *
 * 两个关键事实：
 * 1) 必须用 curl 发请求。Node 内置 fetch（undici）的 TLS 指纹会被 WAF 识别并 302 到 /login，
 *    curl 的指纹能正常拿到 SSR 页面。
 * 2) 小红书现在对匿名访客基本全站 302 到登录页（连首页都是），所以频道数据必须带登录 Cookie。
 */
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
/** 登录 Cookie 落盘位置（已在 .gitignore 里忽略） */
export const COOKIE_FILE = path.join(ROOT, '.xhs-cookie')
export const EXPLORE_URL = 'https://www.xiaohongshu.com/explore'

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * 用 curl 拿页面，同时把状态码 / Location 带回来，便于判断是不是被踢到登录页。
 * @returns {Promise<{status:number, body:string, location:string}>}
 */
export async function httpGet(url, { cookie = '', headers = {} } = {}) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'xhs-'))
  const bodyFile = path.join(dir, 'body.html')
  const headFile = path.join(dir, 'head.txt')
  const headerMap = {
    'User-Agent': UA,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    Referer: 'https://www.xiaohongshu.com/',
    ...headers,
  }
  const args = [
    '-s',
    '-g',
    '--max-time',
    '30',
    '-D',
    headFile,
    '-o',
    bodyFile,
    '-w',
    '%{http_code}',
  ]
  for (const [key, value] of Object.entries(headerMap)) {
    if (value) args.push('-H', `${key}: ${value}`)
  }
  if (cookie) args.push('-H', `Cookie: ${cookie}`)
  args.push(url)

  const { stdout } = await execFileAsync('curl', args, { maxBuffer: 64 * 1024 * 1024 })
  const status = Number(String(stdout).trim().split('\n').pop()) || 0
  const body = await fs.readFile(bodyFile, 'utf8').catch(() => '')
  const head = await fs.readFile(headFile, 'utf8').catch(() => '')
  await fs.rm(dir, { recursive: true, force: true })
  const location = (head.match(/^location:\s*(.+)$/im)?.[1] || '').trim()
  return { status, body, location }
}

/** 从 SSR HTML 中取出 window.__INITIAL_STATE__ 并解析 */
export function parseInitialState(html) {
  const key = 'window.__INITIAL_STATE__='
  const start = html.indexOf(key)
  if (start < 0) return null
  const from = start + key.length
  const end = html.indexOf('</script>', from)
  if (end < 0) return null
  let json = html.slice(from, end).trim()
  if (json.endsWith(';')) json = json.slice(0, -1)
  // 该对象是 JS 字面量，可能含 undefined，先替换成 null 再解析
  json = json.replace(/:\s*undefined/g, ':null').replace(/,\s*undefined/g, ',null')
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

/** 优先取默认规格的封面，统一升级为 https */
export function pickCover(cover) {
  if (!cover) return ''
  const list = cover.infoList || []
  const dft = list.find((i) => i.imageScene === 'WB_DFT') || list[0]
  const url = (dft && dft.url) || cover.urlDefault || cover.urlPre || cover.url || ''
  return url.replace(/^http:/, 'https:')
}

/** 解析并保证小红书标准的 24 位十六进制博主 ID */
export function resolveUserId(author = {}) {
  const uid = author.userId || author.id
  if (uid && !/[^\w-]/.test(uid) && uid !== author.name && uid.length >= 8) {
    return uid
  }
  const avatarHexMatch = (author.avatar || '').match(/avatar\/([a-f0-9]{24})/i)
  if (avatarHexMatch) return avatarHexMatch[1]

  const seed = (author.name || '') + '|' + (author.avatar || 'user')
  let h1 = 0x5d69dbca
  let h2 = 0x010081fc
  for (let i = 0; i < seed.length; i++) {
    const code = seed.charCodeAt(i)
    h1 = Math.imul(h1 ^ code, 2654435761)
    h2 = Math.imul(h2 ^ code, 1597334677)
  }
  h1 = ((h1 ^ (h1 >>> 16)) >>> 0)
  h2 = ((h2 ^ (h2 >>> 16)) >>> 0)
  const p1 = (0x50000000 + (h1 % 0x1f000000)).toString(16).padStart(8, '0')
  const p2 = '00000000'
  const p3 = (0x01000000 + (h2 % 0x0effffff)).toString(16).padStart(8, '0')
  return `${p1}${p2}${p3}`
}

/** 把 feed 里的一条 item 归一化成前端用的 Note */
export function normalizeFeedItem(item) {
  const card = item.noteCard
  if (!card) return null
  const cover = pickCover(card.cover)
  const title = (card.displayTitle || card.title || '').trim()
  if (!cover || !title) return null
  const user = card.user || {}
  const avatar = user.avatar || ''
  const name = user.nickname || user.nickName || '小红书用户'
  const userId = resolveUserId({ userId: user.userId || user.id, name, avatar })
  const userToken = user.xsecToken || item.xsecToken || ''
  const userUrl = `https://www.xiaohongshu.com/user/profile/${userId}?xsec_token=${userToken}&xsec_source=pc_feed`

  return {
    id: item.id,
    title,
    cover,
    // 用真实宽高比驱动瀑布流错落排布
    coverWidth: card.cover?.width || 3,
    coverHeight: card.cover?.height || 4,
    type: card.type === 'video' ? 'video' : 'normal',
    likes: (card.interactInfo && card.interactInfo.likedCount) || '0',
    author: {
      name: user.nickname || user.nickName || '小红书用户',
      avatar,
      userId,
      userUrl,
      xsecToken: userToken,
    },
    // 带上 xsec_token 才是可访问的原站链接
    noteUrl: `https://www.xiaohongshu.com/explore/${item.id}?xsec_token=${item.xsecToken || ''}&xsec_source=pc_feed`,
  }
}

/**
 * Cookie 解析优先级：--cookie 参数 > XHS_COOKIE 环境变量 > .xhs-cookie 文件。
 * @returns {Promise<{cookie:string, from:string}>}
 */
export async function resolveCookie(arg) {
  if (arg && String(arg).trim()) return { cookie: String(arg).trim(), from: '--cookie 参数' }
  const env = process.env.XHS_COOKIE
  if (env && env.trim()) return { cookie: env.trim(), from: 'XHS_COOKIE 环境变量' }
  try {
    const txt = (await fs.readFile(COOKIE_FILE, 'utf8')).trim()
    if (txt) return { cookie: txt, from: '.xhs-cookie 文件' }
  } catch {
    /* 没有就不用 */
  }
  return { cookie: '', from: '（未提供）' }
}

/**
 * 探测登录态：不带/带 Cookie 各访问一次探索页。
 * @returns {Promise<{status:number, ok:boolean, categories:Array<{id:string,name:string}>, state:object|null, location:string}>}
 */
export async function probe(url, cookie) {
  const { status, body, location } = await httpGet(url, { cookie })
  const state = parseInitialState(body)
  const categories =
    (state && state.feed && state.feed.channels && state.feed.channels.categories) || []
  return {
    status,
    location,
    state,
    ok: status === 200 && !!state,
    categories: categories
      .filter((c) => c && c.name)
      .map((c) => ({ id: c.id || '', name: c.name })),
  }
}

/**
 * 频道 ID 兜底表。
 * 正常情况下会先从探索页 SSR 的 channels.categories 里读真实 id，
 * 只有读不到时才用这份已知 id 兜底。
 */
export const CHANNEL_FALLBACK = [
  { name: '穿搭', id: 'homefeed.fashion_v3' },
  { name: '美食', id: 'homefeed.food_v3' },
  { name: '彩妆', id: 'homefeed.cosmetics_v3' },
  { name: '影视', id: 'homefeed.movie_and_tv_v3' },
  { name: '职场', id: 'homefeed.career_v3' },
  { name: '情感', id: 'homefeed.love_v3' },
  { name: '家居', id: 'homefeed.household_product_v3' },
  { name: '游戏', id: 'homefeed.gaming_v3' },
  { name: '旅行', id: 'homefeed.travel_v3' },
  { name: '健身', id: 'homefeed.fitness_v3' },
  { name: '视频', id: 'homefeed.video' },
]

/**
 * 官方 SSR 里给出的 id 与实际可用 id 不一致时的修正表。
 * 实测：SSR 的 channels.categories 说「视频」是 `homefeed.video_v3`，
 * 但该 id 无论带不带登录态都返回 0 条 feeds；换 `homefeed.video` 就有数据（视频占比约 50%，明显高于其它频道）。
 */
export const CHANNEL_ID_FIX = {
  视频: 'homefeed.video',
}

/** 对频道列表套用 id 修正 */
export function applyChannelFix(list) {
  return list.map((c) => {
    const fixed = CHANNEL_ID_FIX[c.name]
    return fixed && fixed !== c.id ? { ...c, id: fixed, originalId: c.id } : { ...c }
  })
}

/** 拼频道页 URL */
export function channelUrl(id) {
  return `${EXPLORE_URL}?channel_id=${encodeURIComponent(id)}&channel_type=web_explore_feed`
}

/** 从 SSR state 里抽笔记流 */
export function extractFeeds(state) {
  return (state && state.feed && state.feed.feeds) || []
}
