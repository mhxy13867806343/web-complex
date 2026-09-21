#!/usr/bin/env node
/**
 * 抓取小红书真实笔记数据（推荐流 + 各频道流）
 *
 * 原理：www.xiaohongshu.com/explore 的服务端渲染 HTML 里带有 `window.__INITIAL_STATE__`，
 * 其中 feed.feeds 就是当前流的笔记（含标题、封面直链、作者头像、点赞数、xsec_token）。
 * 每次请求返回的内容不同，多抓几轮可以累积出一批数据。
 *
 * 用法：
 *   npm run fetch:notes                 # 推荐流 8 轮 + 各频道 3 轮
 *   npm run fetch:notes -- 12           # 推荐流 12 轮
 *   npm run fetch:notes -- --rounds 12 --channel-rounds 5
 *   npm run fetch:notes -- --no-recommend        # 只刷频道（推荐流保留原数据）
 *   npm run fetch:notes -- --no-channels         # 只刷推荐流
 *
 * 登录态（抓频道必须要）：
 *   小红书现在对匿名访客全站 302 到登录页，频道数据必须带 Cookie。
 *   先执行 `npm run login` 把 Cookie 存到 .xhs-cookie，或临时用：
 *     XHS_COOKIE="a1=...; web_session=..." npm run fetch:notes
 *
 * 产物：
 *   src/data/notes.json     推荐流（前端「发现」页）
 *   src/data/channels.json  各频道流（前端频道 chips）
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

const OUT_NOTES = path.join(ROOT, 'src/data/notes.json')
const OUT_CHANNELS = path.join(ROOT, 'src/data/channels.json')

/** 命令行参数解析 */
function parseArgs(argv) {
  const opts = {
    rounds: null,
    channelRounds: 3,
    recommend: true,
    channels: true,
    cookie: '',
    only: [],
    maxChannel: 150,
  }
  const rest = []
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--rounds') opts.rounds = Number(argv[++i])
    else if (a === '--channel-rounds') opts.channelRounds = Number(argv[++i])
    else if (a === '--no-recommend') opts.recommend = false
    else if (a === '--no-channels') opts.channels = false
    else if (a === '--cookie') opts.cookie = argv[++i] || ''
    else if (a === '--max-channel') opts.maxChannel = Number(argv[++i]) || 150
    else if (a === '--only') {
      opts.only = String(argv[++i] || '')
        .split(/[,，\s]+/)
        .filter(Boolean)
    } else if (!a.startsWith('--')) rest.push(a)
  }
  if (opts.rounds === null) opts.rounds = Number(rest[0]) || 8
  opts.rounds = Math.max(1, Math.min(50, opts.rounds))
  opts.channelRounds = Math.max(1, Math.min(20, opts.channelRounds))
  return opts
}

const opts = parseArgs(process.argv.slice(2))

/** 读已有产物，避免抓失败时把好数据覆盖掉 */
async function readJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'))
  } catch {
    return null
  }
}

async function writeJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, JSON.stringify(data, null, 1), 'utf8')
}

/** 反复抓同一个 URL，累积去重 */
async function collect(url, rounds, cookie, label, map) {
  for (let i = 1; i <= rounds; i++) {
    try {
      const { status, state, location } = await probe(url, cookie)
      if (!state) {
        const why = status === 302 ? `被 302 到 ${location || '/login'}` : `HTTP ${status}`
        console.warn(`  ${label} 第 ${i} 轮：拿不到数据（${why}）`)
        if (status === 302) return { blocked: true, added: 0 }
        continue
      }
      const feeds = extractFeeds(state)
      let added = 0
      for (const it of feeds) {
        const n = normalizeFeedItem(it)
        if (n && !map.has(n.id)) {
          map.set(n.id, n)
          added++
        }
      }
      console.log(`  ${label} 第 ${i} 轮：返回 ${feeds.length} 条，新增 ${added} 条`)
    } catch (e) {
      console.warn(`  ${label} 第 ${i} 轮失败：${e.message}`)
    }
    if (i < rounds) await sleep(1200 + Math.random() * 900)
  }
  return { blocked: false, added: map.size }
}

async function main() {
  const { cookie, from } = await resolveCookie(opts.cookie)
  console.log(
    `登录 Cookie 来源：${from}${cookie ? '' : '（匿名抓取；小红书偶尔会临时要求登录，此时配置 Cookie 即可）'}`
  )

  // ---- 1. 先探测探索页，同时拿到真实频道 id ----
  console.log('\n探测探索页……')
  const home = await probe(EXPLORE_URL, cookie)
  if (home.ok) {
    console.log(`  HTTP ${home.status}，拿到 ${extractFeeds(home.state).length} 条推荐流、${home.categories.length} 个频道`)
  } else {
    console.warn(
      `  HTTP ${home.status}${home.location ? ` -> ${home.location}` : ''}，` +
        '小红书当前要求登录。推荐流如有旧数据将保留，频道抓取会被跳过。'
    )
  }

  const cookiesUsable = home.ok
  const channelList = applyChannelFix(
    home.categories.length > 0
      ? home.categories.filter((c) => c.id && c.name !== '推荐')
      : CHANNEL_FALLBACK
  )
  const channelSource =
    (home.categories.length > 0 ? '探索页 SSR 实时读出' : '内置已知 id 兜底') +
    (channelList.some((c) => c.originalId) ? '，其中部分 id 已按实测修正' : '')
  for (const c of channelList) {
    if (c.originalId) console.log(`  ⚠「${c.name}」频道 id 修正：${c.originalId} -> ${c.id}`)
  }
  const toFetch = opts.only.length ? channelList.filter((c) => opts.only.includes(c.name)) : channelList

  // ---- 2. 推荐流 ----
  let notes = []
  const prevNotes = await readJson(OUT_NOTES)
  if (opts.recommend) {
    console.log(`\n抓取推荐流（${opts.rounds} 轮）……`)
    const map = new Map()
    if (!cookiesUsable && prevNotes?.notes?.length) {
      // 抓不到就先把旧数据放进去，保证产物不会变空
      for (const n of prevNotes.notes) map.set(n.id, n)
      console.log(`  已载入本地旧数据 ${prevNotes.notes.length} 条作为兜底`)
    }
    const { blocked } = await collect(EXPLORE_URL, opts.rounds, cookie, '推荐', map)
    notes = [...map.values()]
    if (blocked && !notes.length) {
      console.error('\n推荐流没抓到任何数据。请先执行 npm run login 配置登录 Cookie。')
    }
  } else {
    notes = prevNotes?.notes || []
    console.log(`\n跳过推荐流，沿用本地 ${notes.length} 条。`)
  }

  if (notes.length) {
    const prevChannels = prevNotes?.channels || []
    const names = channelList.map((c) => c.name)
    await writeJson(OUT_NOTES, {
      source: EXPLORE_URL,
      // 只在真的重抓了推荐流时才更新时间戳，避免沿用旧数据却显示新时间
      fetchedAt: opts.recommend ? new Date().toISOString() : prevNotes?.fetchedAt || null,
      count: notes.length,
      note: '本文件由 scripts/fetch-notes.mjs 抓取生成。封面与头像为小红书 CDN 直链，带时效，如失效请重新执行 npm run fetch:notes。',
      channels: names.length ? names : prevChannels,
      channelIds: Object.fromEntries(channelList.map((c) => [c.name, c.id])),
      notes,
    })
    console.log(`\n推荐流：${notes.length} 条 -> src/data/notes.json`)
  } else {
    console.warn('\n推荐流无数据，notes.json 保持不变。')
  }

  // ---- 3. 各频道流 ----
  const prevChannels = await readJson(OUT_CHANNELS)
  const prevByName = new Map((prevChannels?.channels || []).map((c) => [c.name, c]))

  if (!opts.channels) {
    console.log('\n跳过频道流（--no-channels）。')
  } else if (!cookiesUsable) {
    console.log('\n跳过频道流：没有可用的登录 Cookie。')
    console.log('  获取方式见 README「频道数据需要登录」一节，或直接执行：npm run login')
  } else {
    console.log(`\n抓取 ${toFetch.length} 个频道（每个 ${opts.channelRounds} 轮，频道 id 来自${channelSource}）……`)
    for (const ch of toFetch) {
      const map = new Map()
      // 抓之前先放旧数据兜底
      for (const n of prevByName.get(ch.name)?.notes || []) map.set(n.id, n)
      const before = map.size
      console.log(`[${ch.name}] ${ch.id}`)
      const { blocked } = await collect(channelUrl(ch.id), opts.channelRounds, cookie, ch.name, map)
      // 滚动窗口：超过上限就丢掉最早抓进来的，避免多次运行后文件无限膨胀
      if (map.size > opts.maxChannel) {
        const overflow = [...map.keys()].slice(0, map.size - opts.maxChannel)
        for (const k of overflow) map.delete(k)
      }
      prevByName.set(ch.name, {
        name: ch.name,
        id: ch.id,
        count: map.size,
        fetchedAt: new Date().toISOString(),
        stale: blocked || map.size === before,
        notes: [...map.values()],
      })
      if (ch !== toFetch[toFetch.length - 1]) await sleep(1500 + Math.random() * 1000)
    }
  }

  const outChannels = channelList.map(
    (ch) =>
      prevByName.get(ch.name) || { name: ch.name, id: ch.id, count: 0, fetchedAt: null, stale: true, notes: [] }
  )
  await writeJson(OUT_CHANNELS, {
    source: `${EXPLORE_URL}?channel_id=...&channel_type=web_explore_feed`,
    fetchedAt: new Date().toISOString(),
    withCookie: cookiesUsable,
    note: '本文件由 scripts/fetch-notes.mjs 抓取生成。频道页必须带登录 Cookie，未登录时 notes 为空数组。',
    channels: outChannels,
  })

  const filled = outChannels.filter((c) => c.notes.length > 0)
  console.log(
    `\n频道：${filled.length}/${outChannels.length} 个有数据 -> src/data/channels.json` +
      (filled.length ? `（${filled.map((c) => `${c.name} ${c.notes.length} 条`).join('、')}）` : '')
  )
  if (!filled.length) {
    console.log('提示：配置登录 Cookie 后频道才会有数据，执行 `npm run login`。')
  }
}

main().catch((e) => {
  console.error('抓取异常：', e)
  process.exit(1)
})
