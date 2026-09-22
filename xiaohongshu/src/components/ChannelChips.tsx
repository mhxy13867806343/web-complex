import { useCallback, useEffect, useRef, useState } from 'react'

interface Props {
  channels: string[]
  value: string
  onChange: (name: string) => void
}

/**
 * 频道 chips：单行横向滚动。
 *
 * 原生 `overflow-x: auto` 在移动端（触摸滑动）够用，但在桌面端只有触控板用户能横滑，
 * 鼠标用户完全滚不动；再加上滚动条被隐藏，体感就是「这行东西卡住了」。
 * 所以这里补齐三种桌面端操作方式：
 *   1. 按住鼠标左右拖动（pointer events）
 *   2. 滚轮 / shift+滚轮（原生已支持 deltaX，这里额外把纯 deltaY 也转成横向）
 *   3. 悬停时出现左右翻页箭头
 * 并额外做两侧渐隐 + 箭头显隐，提示「这一行还有内容」。
 */
export default function ChannelChips({ channels, value, onChange }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: 0 })
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  /** 根据滚动位置更新两侧渐隐 / 箭头状态 */
  const syncEdges = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanLeft(el.scrollLeft > 2)
    setCanRight(el.scrollLeft < max - 2)
  }, [])

  useEffect(() => {
    syncEdges()
    const el = scrollRef.current
    if (!el || typeof ResizeObserver !== 'function') return
    // 容器尺寸变化（窗口缩放 / 手机旋转）也要重算
    const ro = new ResizeObserver(syncEdges)
    ro.observe(el)
    return () => ro.disconnect()
  }, [syncEdges, channels.length])

  // 频道列表变了（重新抓取后）宽度会变，重算一次两侧状态
  useEffect(() => {
    const id = window.setTimeout(syncEdges, 0)
    return () => window.clearTimeout(id)
  }, [syncEdges, channels.length])

  /**
   * 选中频道时，把该 chip 自动滚到可视区中间。
   * 不然点到「健身」「视频」这些靠右的频道时，用户根本不知道自己选了啥。
   */
  useEffect(() => {
    const scrollToActive = () => {
      const el = scrollRef.current
      if (!el) return
      const active = el.querySelector<HTMLElement>('.chip.active')
      if (!active) return
      const box = el.getBoundingClientRect()
      const chip = active.getBoundingClientRect()
      // 用 rect 而不是 offsetLeft，避免受 offsetParent / padding 影响
      const delta = chip.left + chip.width / 2 - (box.left + box.width / 2)
      if (Math.abs(delta) < 4) return
      // 平滑一点，跟随动画到一半时也能看到"滚过去了"
      el.scrollBy({ left: delta, behavior: 'smooth' })
    }
    scrollToActive()
    const timer = window.setTimeout(scrollToActive, 60)
    return () => window.clearTimeout(timer)
  }, [value, channels.length])

  /** 箭头翻页：一次滚一屏的 70% */
  const scrollByPage = (dir: -1 | 1) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' })
  }

  // ---- 鼠标拖拽滚动 ----
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return // 触摸交给原生滚动
    const el = scrollRef.current
    if (!el || el.scrollWidth <= el.clientWidth) return
    drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft, moved: 0 }
    el.classList.add('dragging')
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current
    if (!el || !drag.current.active) return
    const dx = e.clientX - drag.current.startX
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx))
    el.scrollLeft = drag.current.startLeft - dx
    if (drag.current.moved > 4) e.preventDefault()
  }

  const endDrag = () => {
    const el = scrollRef.current
    if (!el || !drag.current.active) return
    el.classList.remove('dragging')
    drag.current.active = false
    // 拖完马上恢复可点击，避免拖拽结束那一下误触
    window.setTimeout(() => {
      drag.current.moved = 0
    }, 0)
  }

  /** 拖拽超过阈值时吞掉这次 click，防止拖动变成切换频道 */
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved > 4) {
      e.preventDefault()
      e.stopPropagation()
      drag.current.moved = 0
    }
  }

  /**
   * 滚轮：纯纵向滚轮也转成横向滚动（横向触控板手势会走 deltaX 分支）。
   *
   * 必须用原生 addEventListener 且 passive: false —— React 的 onWheel 默认注册成
   * 被动监听器，里面调 preventDefault() 会被静默忽略，结果是页面一边纵向滚、
   * chips 一边横向滚。
   */
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      const max = el.scrollWidth - el.clientWidth
      if (max <= 0) return
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      const next = el.scrollLeft + delta
      // 到边界就不再拦截，把滚动交还给页面
      if (next < 0 || next > max) return
      e.preventDefault()
      el.scrollLeft = next
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  return (
    <div className={`chips-wrap${canLeft ? ' can-left' : ''}${canRight ? ' can-right' : ''}`}>
      <div
        ref={scrollRef}
        className="chips"
        role="tablist"
        onScroll={syncEdges}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {channels.map((c) => (
          <span
            key={c}
            role="tab"
            aria-selected={value === c}
            className={`chip${value === c ? ' active' : ''}`}
            onClick={() => onChange(c)}
          >
            {c}
          </span>
        ))}
      </div>

      <button
        type="button"
        aria-label="向左滚动"
        className={`chips-arrow left${canLeft ? '' : ' hide'}`}
        onClick={() => scrollByPage(-1)}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="向右滚动"
        className={`chips-arrow right${canRight ? '' : ' hide'}`}
        onClick={() => scrollByPage(1)}
      >
        ›
      </button>
    </div>
  )
}
