/**
 * 渲染冒烟测试：在 jsdom 中真实挂载一次 App，验证四个页面都能渲染出真实数据。
 * 用法：npm run smoke
 */
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
})

// 把 jsdom 的 window 成员挂到 Node 全局，让 React DOM 认为自己在浏览器里
const g = globalThis
g.window = dom.window
g.document = dom.window.document
for (const key of ['HTMLElement', 'Element', 'Node', 'Event', 'MouseEvent', 'CustomEvent', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame', 'matchMedia']) {
  if (dom.window[key]) g[key] = dom.window[key]
}
Object.defineProperty(g, 'navigator', { value: dom.window.navigator, configurable: true })
g.MutationObserver = dom.window.MutationObserver
// jsdom 没有 ResizeObserver（也不做布局），给个空实现让组件能装上
if (!g.ResizeObserver) {
  g.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

// jsdom 没实现滚动方法（scrollTo / scrollBy / scrollIntoView），
// 组件里切换频道 / 自动吸顶会调用到，不 stub 会直接抛 TypeError 让 act 环境崩掉。
for (const fn of ['scrollTo', 'scrollBy', 'scrollIntoView']) {
  if (!dom.window.Element.prototype[fn]) {
    dom.window.Element.prototype[fn] = function () {
      return
    }
  }
}

const { run } = await import('../.smoke/smoke-entry.js')

try {
  const lines = await run()
  console.log('--- 冒烟测试 ---')
  for (const line of lines) console.log('  ✓', line)
  console.log('全部通过')
  process.exit(0)
} catch (err) {
  console.error('冒烟测试失败:', err?.message || err)
  process.exit(1)
}
