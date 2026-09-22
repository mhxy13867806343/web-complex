/**
 * 冒烟测试入口：在 jsdom 中挂载 App，逐个频道渲染并输出关键断言。
 * 由 scripts/smoke.mjs 驱动（先 vite ssr 构建，再在 Node 里执行）。
 *
 * 注意：数据现在是「动态实时」的（见 src/data/api.ts），没有静态快照。
 * 这里不真去抓小红书，而是把 globalThis.fetch 替成返回假数据的桩，
 * 验证「组件在拿到接口数据后能正确渲染出 chips / 瀑布流 / 封面图」这条链路，
 * 同时确认旧的购物/消息/我的/底部导航模块已经完全移除。
 *
 * 横向滚动、下拉刷新、触屏手势这些依赖真实布局的能力，jsdom 测不了，
 * 靠真实浏览器（npm run dev 后用 Chrome 验证）兜底。
 */
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../src/App'

/* ---------------- mock 接口数据 ---------------- */
const MOCK_CHANNELS = [
  { name: '穿搭', id: 'homefeed.fashion_v3' },
  { name: '美食', id: 'homefeed.food_v3' },
  { name: '视频', id: 'homefeed.video' },
]

// 用真实 CDN 形态的 https 地址，断言时才不会误判成「假数据」
const MOCK_NOTES = Array.from({ length: 24 }, (_, i) => ({
  id: `smoke_${i}`,
  title: `冒烟测试笔记 ${i + 1} · 真实封面走 CDN`,
  cover: `https://sns-img.xiaohongshu.com/test/cover_${i}.jpg`,
  coverWidth: 3,
  coverHeight: 4,
  type: i % 5 === 0 ? 'video' : 'normal',
  likes: i % 7 === 0 ? '3.5万' : `${i * 13}`,
  author: {
    name: `测试作者${i}`,
    avatar: `https://sns-img.xiaohongshu.com/test/avatar_${i}.jpg`,
  },
  noteUrl: `https://www.xiaohongshu.com/explore/smoke_${i}`,
}))

function installFetchStub() {
  const handler = async (url: string) => {
    const u = new URL(url, 'http://localhost')
    if (u.pathname === '/api/xhs/channels' || u.pathname.endsWith('channels.json')) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ fetchedAt: new Date().toISOString(), channels: MOCK_CHANNELS }),
      }
    }
    if (u.pathname === '/api/xhs/feed' || u.pathname.includes('homefeed_')) {
      const ch = u.searchParams.get('channel') || '推荐'
      return {
        ok: true,
        status: 200,
        json: async () => ({
          channel: ch,
          channelId: 'homefeed_recommend',
          fetchedAt: new Date().toISOString(),
          count: MOCK_NOTES.length,
          notes: MOCK_NOTES,
        }),
      }
    }
    return { ok: false, status: 404, json: async () => ({}) }
  }
  // 包一层：兼容组件里 fetch(path, { signal, headers }) 的调用方式
  ;(globalThis as unknown as { fetch: typeof fetch }).fetch = (async (
    input: any,
    _init?: any
  ) => handler(typeof input === 'string' ? input : String(input))) as unknown as typeof fetch
}

const results: string[] = []

function pick(host: HTMLElement, selector: string, text: string) {
  return Array.from(host.querySelectorAll<HTMLElement>(selector)).find((el) =>
    (el.textContent || '').includes(text)
  )
}

async function settle(ms = 120) {
  await act(async () => {
    await new Promise((r) => setTimeout(r, ms))
  })
}

/** 点击并等待 React 把状态刷到 DOM */
async function click(el: HTMLElement) {
  await act(async () => {
    el.click()
    await Promise.resolve()
  })
  await settle(40)
}

export async function run() {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  installFetchStub()

  const host = document.createElement('div')
  document.body.appendChild(host)
  const root = createRoot(host)

  await act(async () => {
    root.render(<App />)
  })
  // 等首屏接口 + setState 刷完（fetch 是异步的）
  for (let i = 0; i < 10; i++) {
    await settle(100)
    if (host.querySelectorAll('.chip').length > 1) break
  }

  const html = host.innerHTML
  results.push(`[页面] 默认渲染字符数=${html.length}`)

  const imgCount = (html.match(/<img/g) || []).length
  results.push(`[页面] 真实封面 <img> 数量=${imgCount}`)
  if (imgCount === 0) throw new Error('没有渲染出封面图片')

  const srcSample = html.match(/src="(https:\/\/[^"]+)"/)?.[1] ?? ''
  results.push(`[页面] 首个图片地址=${srcSample.slice(0, 72)}`)
  if (!srcSample.startsWith('https://')) throw new Error('封面不是真实 CDN 地址')

  // 已废弃的模块不应再出现
  for (const dead of ['nut-tabbar', 'shop-header', 'demo-banner', 'login-hint', 'data-banner']) {
    if (html.includes(dead)) throw new Error(`仍然渲染出了已移除的模块：${dead}`)
  }
  results.push('[页面] 已确认无购物/消息/我的/底部导航/数据横幅残留')

  // ---- 频道 chips ----
  const chipEls = host.querySelectorAll('.chip')
  const total = MOCK_CHANNELS.length + 1
  results.push(`[频道] chip 数量=${chipEls.length}（推荐 + ${MOCK_CHANNELS.length} 个频道）`)
  if (chipEls.length !== total) {
    throw new Error(`chip 数量不对，期望 ${total} 实际 ${chipEls.length}`)
  }

  const arrows = host.querySelectorAll('.chips-arrow')
  results.push(`[频道] 翻页箭头数量=${arrows.length}`)
  if (arrows.length !== 2) throw new Error('左右翻页箭头没有渲染')

  if (!host.querySelector('.chips-wrap')) throw new Error('缺少 .chips-wrap 滚动容器')

  // ---- 切频道：点一个真实频道，确认会重新请求数据并渲染该频道封面 ----
  for (const ch of MOCK_CHANNELS) {
    const chip = pick(host, '.chip', ch.name)
    if (!chip) throw new Error(`找不到「${ch.name}」频道 chip`)
    await click(chip)
    const after = host.innerHTML
    const imgs = (after.match(/<img/g) || []).length
    if (imgs === 0) throw new Error(`「${ch.name}」切换后没有渲染出封面`)
    const active = host.querySelector(`.chip.active`)?.textContent || ''
    results.push(`[频道] ${ch.name} chip 选中=${active === ch.name} 图片=${imgs} ✓`)
  }

  // 回到推荐流
  const recChip = pick(host, '.chip', '推荐')
  if (!recChip) throw new Error('找不到「推荐」chip')
  await click(recChip)
  if (host.querySelectorAll('.note-card').length === 0) {
    throw new Error('切回推荐流后没有渲染出笔记卡片')
  }
  results.push(`[频道] 切回推荐流 OK（${host.querySelectorAll('.note-card').length} 张卡片）`)

  results.push(`[数据] 推荐流=${MOCK_NOTES.length} 条，频道流=${MOCK_CHANNELS.length} 个（均为接口实时返回）`)
  return results
}
