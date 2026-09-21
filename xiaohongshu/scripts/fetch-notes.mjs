#!/usr/bin/env node
/**
 * 抓取小红书探索页的真实笔记数据
 *
 * 原理：www.xiaohongshu.com/explore 的服务端渲染 HTML 里带有
 * `window.__INITIAL_STATE__`，其中的 feed.feeds 就是首屏推荐流（含标题、
 * 封面直链、作者头像、点赞数、xsec_token）。每次请求返回的内容都不同，
 * 因此多抓几轮可以累积出一批真实数据。
 *
 * 用法：
 *   node scripts/fetch-notes.mjs [轮数]      # 默认 8 轮
 *
 * 说明：频道页（?channel_id=...）与笔记详情页需要登录，匿名请求会被 302 到
 * /login，所以本脚本只抓默认的推荐流。
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT = path.join(ROOT, 'src/data/notes.json')

const ROUNDS = Math.max(1, Math.min(30, Number(process.argv[2]) || 8))
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * 用 curl 发请求，而不是 Node 内置 fetch。
 * 原因：小红书的 WAF 会对 Node/undici 的 TLS 指纹直接返回 302 到 /login，
 * 而 curl 的指纹可以正常拿到 SSR 页面（已实测，与请求头无关）。
 */
async function httpGet(url) {
  const { stdout } = await execFileAsync(
    'curl',
    [
      '-s',
      '--max-time',
      '25',
      '-H',
      `User-Agent: ${UA}`,
      '-H',
      'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      '-H',
      'Accept-Language: zh-CN,zh;q=0.9',
      url,
    ],
    { maxBuffer: 32 * 1024 * 1024 }
  )
  return stdout
}

/** 从 SSR HTML 中取出 __INITIAL_STATE__ 并解析 */
function parseInitialState(html) {
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
function pickCover(cover) {
  if (!cover) return ''
  const list = cover.infoList || []
  const dft = list.find((i) => i.imageScene === 'WB_DFT') || list[0]
  const url = (dft && dft.url) || cover.urlDefault || cover.urlPre || cover.url || ''
  return url.replace(/^http:/, 'https:')
}

async function fetchOnce(round) {
  const html = await httpGet('https://www.xiaohongshu.com/explore')
  const state = parseInitialState(html)
  if (!state) {
    console.warn(`  第 ${round} 轮：未取到 __INITIAL_STATE__（${html.length} 字节）`)
    return { items: [], channels: [] }
  }
  const feeds = (state.feed && state.feed.feeds) || []
  const categories = (state.feed && state.feed.channels && state.feed.channels.categories) || []
  console.log(`  第 ${round} 轮：${feeds.length} 条`)
  return { items: feeds, channels: categories }
}

function normalize(item) {
  const card = item.noteCard
  if (!card) return null
  const cover = pickCover(card.cover)
  const title = (card.displayTitle || '').trim()
  if (!cover || !title) return null
  const user = card.user || {}
  const w = card.cover?.width || 3
  const h = card.cover?.height || 4
  return {
    id: item.id,
    title,
    cover,
    // 用真实宽高比驱动瀑布流错落排布
    coverWidth: w,
    coverHeight: h,
    type: card.type === 'video' ? 'video' : 'normal',
    likes: (card.interactInfo && card.interactInfo.likedCount) || '0',
    author: {
      name: user.nickname || user.nickName || '小红书用户',
      avatar: user.avatar || '',
    },
    // 带上 xsec_token 才是可访问的原站链接
    noteUrl: `https://www.xiaohongshu.com/explore/${item.id}?xsec_token=${item.xsecToken || ''}&xsec_source=pc_feed`,
  }
}

async function main() {
  console.log(`开始抓取小红书探索页，共 ${ROUNDS} 轮……`)
  const map = new Map()
  let channels = []
  for (let i = 1; i <= ROUNDS; i++) {
    try {
      const { items, channels: chs } = await fetchOnce(i)
      if (chs.length && !channels.length) channels = chs.map((c) => c.name)
      for (const it of items) {
        const n = normalize(it)
        if (n && !map.has(n.id)) map.set(n.id, n)
      }
    } catch (e) {
      console.warn(`  第 ${i} 轮失败：${e.message}`)
    }
    if (i < ROUNDS) await sleep(1200 + Math.random() * 800)
  }

  const notes = [...map.values()]
  if (!notes.length) {
    console.error('没有抓到任何数据，保持原有 notes.json 不变。')
    process.exit(1)
  }

  const payload = {
    source: 'https://www.xiaohongshu.com/explore',
    fetchedAt: new Date().toISOString(),
    count: notes.length,
    note: '本文件由 scripts/fetch-notes.mjs 抓取生成。封面与头像为小红书 CDN 直链，带时效，如失效请重新执行 npm run fetch:notes。',
    channels: channels.length ? channels : ['穿搭', '美食', '彩妆', '影视', '职场', '情感', '家居', '游戏', '旅行', '健身', '视频'],
    notes,
  }

  await fs.mkdir(path.dirname(OUT), { recursive: true })
  await fs.writeFile(OUT, JSON.stringify(payload, null, 1), 'utf8')
  console.log(`\n完成：去重后 ${notes.length} 条真实笔记 -> src/data/notes.json`)
  console.log(`真实频道（需登录才能切换）：${payload.channels.join('、')}`)
}

main()
