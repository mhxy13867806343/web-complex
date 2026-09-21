import { useEffect, useState } from 'react'

/**
 * 轻量 Toast。
 *
 * 为什么不用 NutUI 的 Toast：它的命令式 API 内部走的是 React 18 的
 * `ReactDOM.render`，React 19 已经移除该入口，一调用就报
 * `reactRender is not a function`。这里用「模块级订阅 + 宿主组件」自己实现，
 * 只依赖 React 19 的声明式渲染，调用方式保持不变：`Toast.show({ content, duration })`。
 */
interface ToastOptions {
  content: string
  /** 秒 */
  duration?: number
}

type Handler = (content: string, durationMs: number) => void

let handler: Handler | null = null

export const Toast = {
  show({ content, duration = 1.5 }: ToastOptions) {
    if (!handler) {
      // 宿主还没挂上（极少见），至少留个痕迹方便排查
      console.warn('[Toast] 宿主未挂载，消息被丢弃：', content)
      return
    }
    handler(content, duration * 1000)
  },
}

/** 挂一次即可，放在 App 根节点里 */
export function ToastHost() {
  const [content, setContent] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let timer = 0
    handler = (text, durationMs) => {
      setContent(text)
      setVisible(true)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setVisible(false), durationMs)
    }
    return () => {
      handler = null
      window.clearTimeout(timer)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="wb-toast-wrap" role="status" aria-live="polite">
      <div className="wb-toast">{content}</div>
    </div>
  )
}
