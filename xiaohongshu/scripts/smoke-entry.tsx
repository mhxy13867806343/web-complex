/**
 * 冒烟测试入口：在 jsdom 中挂载 App，逐个 Tab 渲染并输出关键断言。
 * 由 scripts/smoke.mjs 驱动（先 vite ssr 构建，再在 Node 里执行）。
 */
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../src/App'
import { NOTES } from '../src/data'

const results: string[] = []

function mount() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const root = createRoot(host)
  return { host, root }
}

function clickTab(host: HTMLElement, label: string) {
  const items = Array.from(host.querySelectorAll('.nut-tabbar-item, .nut-tabbar-item__icon, .nut-tabbar-item__text'))
  const hit = items.find((el) => (el.textContent || '').includes(label))
  if (!hit) return false
  ;(hit as HTMLElement).click()
  return true
}

export async function run() {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  const { host, root } = mount()

  await act(async () => {
    root.render(<App />)
  })

  const html = host.innerHTML
  results.push(`[首页] 默认渲染字符数=${html.length}`)

  const imgCount = (html.match(/<img/g) || []).length
  results.push(`[首页] 真实封面 <img> 数量=${imgCount}`)
  if (imgCount === 0) throw new Error('首页没有渲染出真实封面图片')

  const srcSample = html.match(/src="(https:\/\/[^"]+)"/)?.[1] ?? ''
  results.push(`[首页] 首个图片地址=${srcSample.slice(0, 80)}`)
  if (!srcSample.startsWith('https://')) throw new Error('封面不是真实 CDN 地址')

  const banner = html.match(/共\s*\d+\s*条真实笔记/)?.[0] ?? ''
  results.push(`[首页] 数据横幅=${banner || '未找到'}`)
  if (!banner) throw new Error('未渲染真实数据横幅')

  for (const label of ['购物', '消息', '我']) {
    const ok = clickTab(host, label)
    await act(async () => {
      await Promise.resolve()
    })
    const after = host.innerHTML
    results.push(`[${label}] 点击=${ok ? '成功' : '未找到入口'} 渲染字符数=${after.length}`)
    if (!ok) throw new Error(`找不到「${label}」Tab 入口`)
    if (after.length < 50) throw new Error(`「${label}」页面渲染为空`)
  }

  results.push(`[数据] NOTES 条数=${NOTES.length}`)
  if (NOTES.length === 0) throw new Error('真实笔记数据为空')

  return results
}
