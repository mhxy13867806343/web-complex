/**
 * 冒烟测试入口：在 jsdom 中挂载 App，逐个 Tab / 频道渲染并输出关键断言。
 * 由 scripts/smoke.mjs 驱动（先 vite ssr 构建，再在 Node 里执行）。
 */
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../src/App'
import { CHANNEL_FEEDS, NOTES } from '../src/data'

const results: string[] = []

function pick(host: HTMLElement, selector: string, text: string) {
  return Array.from(host.querySelectorAll<HTMLElement>(selector)).find((el) =>
    (el.textContent || '').includes(text)
  )
}

/** 点击并等待 React 把状态刷到 DOM */
async function click(el: HTMLElement) {
  await act(async () => {
    el.click()
    await Promise.resolve()
  })
}

export async function run() {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  const host = document.createElement('div')
  document.body.appendChild(host)
  const root = createRoot(host)

  await act(async () => {
    root.render(<App />)
  })

  const html = host.innerHTML
  results.push(`[首页] 默认渲染字符数=${html.length}`)

  const imgCount = (html.match(/<img/g) || []).length
  results.push(`[首页] 真实封面 <img> 数量=${imgCount}`)
  if (imgCount === 0) throw new Error('首页没有渲染出真实封面图片')

  const srcSample = html.match(/src="(https:\/\/[^"]+)"/)?.[1] ?? ''
  results.push(`[首页] 首个图片地址=${srcSample.slice(0, 72)}`)
  if (!srcSample.startsWith('https://')) throw new Error('封面不是真实 CDN 地址')

  const banner = html.match(/共\s*\d+\s*条真实笔记/)?.[0] ?? ''
  results.push(`[首页] 数据横幅=${banner || '未找到'}`)
  if (!banner) throw new Error('未渲染真实数据横幅')

  // ---- 频道 chips：切到每个频道都要有真实笔记 ----
  results.push(`[频道] 有数据的频道=${CHANNEL_FEEDS.map((c) => `${c.name}(${c.notes.length})`).join(' ')}`)
  if (CHANNEL_FEEDS.length === 0) throw new Error('没有抓到任何频道数据')

  for (const feed of CHANNEL_FEEDS) {
    const chip = pick(host, '.chip', feed.name)
    if (!chip) throw new Error(`找不到「${feed.name}」频道 chip`)
    await click(chip)
    const after = host.innerHTML
    const imgs = (after.match(/<img/g) || []).length
    const hit = after.includes(`「${feed.name}」共 ${feed.notes.length} 条真实笔记`)
    const idHit = after.includes(feed.id)
    results.push(`[频道] ${feed.name} 图片=${imgs} 横幅匹配=${hit} 频道id=${idHit}`)
    if (!hit || !idHit) throw new Error(`「${feed.name}」频道切换后横幅/频道 id 不正确`)
    if (imgs === 0) throw new Error(`「${feed.name}」频道没有渲染出封面`)
  }

  // 回到推荐流，确认能切回来
  const recChip = pick(host, '.chip', '推荐')
  if (!recChip) throw new Error('找不到「推荐」频道 chip')
  await click(recChip)
  if (!host.innerHTML.includes(`共 ${NOTES.length} 条真实笔记`)) {
    throw new Error('切回推荐流后数据不对')
  }
  results.push(`[频道] 切回推荐流 OK（${NOTES.length} 条）`)

  // ---- 底部四个 Tab ----
  for (const label of ['购物', '消息', '我']) {
    const item = pick(host, '.nut-tabbar-item, .nut-tabbar-item__icon, .nut-tabbar-item__text', label)
    if (!item) throw new Error(`找不到「${label}」Tab 入口`)
    await click(item)
    const after = host.innerHTML
    results.push(`[${label}] 渲染字符数=${after.length}`)
    if (after.length < 50) throw new Error(`「${label}」页面渲染为空`)
  }

  results.push(`[数据] 推荐流=${NOTES.length} 条，频道流=${CHANNEL_FEEDS.length} 个`)
  return results
}
