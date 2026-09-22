import { useEffect, useRef, useState } from 'react'

/** 下拉最大位移 */
export const PTR_MAX = 90
/** 松手触发刷新的阈值 */
export const PTR_TRIGGER = 55

/**
 * 下拉刷新。
 *
 * 小红书这类信息流的下拉刷新，核心就是：容器滚到顶之后再继续往下拖，
 * 顶部露出一段提示区，松手超过阈值就触发刷新。
 * 同时支持触摸与鼠标拖拽（桌面预览时也能试）。
 */
export function usePullToRefresh(
  selector: string,
  onRefresh: () => Promise<unknown> | unknown,
  enabled = true
) {
  const [distance, setDistance] = useState(0)
  const [pulling, setPulling] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const cb = useRef(onRefresh)
  useEffect(() => {
    cb.current = onRefresh
  }, [onRefresh])

  useEffect(() => {
    if (!enabled) {
      setDistance(0)
      setPulling(false)
      return
    }

    const el = document.querySelector<HTMLElement>(selector)
    if (!el) return

    let active = false
    let startX = 0
    let startY = 0
    let dist = 0
    let dirLock: 'vertical' | 'horizontal' | null = null

    const begin = (x: number, y: number) => {
      if (!enabled) return
      if (el.scrollTop > 0) return
      active = true
      startX = x
      startY = y
      dirLock = null
      dist = 0
    }

    const move = (x: number, y: number, prevent: (() => void) | null) => {
      if (!active) return
      const dx = Math.abs(x - startX)
      const dy = y - startY

      // 手势方向仲裁：区分是横向滑动还是纵向下拉刷新
      if (!dirLock) {
        if (dx > 6 && dx > Math.abs(dy)) {
          // 判定为横向手势，不触发下拉刷新
          dirLock = 'horizontal'
          active = false
          setPulling(false)
          return
        }
        if (dy > 6 && dy > dx) {
          // 锁定为纵向下拉
          dirLock = 'vertical'
          setPulling(true)
        }
      }

      if (dirLock !== 'vertical') return

      // 往上拖（相当于正常滚动）就交还给浏览器
      if (dy <= 0) {
        if (dist !== 0) {
          dist = 0
          setDistance(0)
        }
        return
      }
      if (el.scrollTop > 0) {
        active = false
        setPulling(false)
        return
      }
      dist = Math.min(PTR_MAX, dy * 0.45)
      setDistance(dist)
      prevent?.()
    }

    const finish = async () => {
      if (!active && !dirLock) return
      active = false
      dirLock = null
      setPulling(false)
      const d = dist
      dist = 0
      if (d >= PTR_TRIGGER) {
        setDistance(PTR_TRIGGER)
        setRefreshing(true)
        try {
          await cb.current()
        } catch {
          /* 刷新失败由调用方自己提示 */
        }
        setRefreshing(false)
      }
      setDistance(0)
    }

    // ---- 触摸 ----
    const onTouchStart = (e: TouchEvent) => {
      if (!enabled) return
      if ((e.target as HTMLElement)?.closest('.chips-wrap, .chips, button, input, .nut-searchbar, .nut-backtop, .nut-popup, .nut-popup-mask, .detail, .nut-overlay')) return
      const t = e.touches[0]
      begin(t.clientX, t.clientY)
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!enabled) return
      const t = e.touches[0]
      move(t.clientX, t.clientY, () => {
        if (e.cancelable) e.preventDefault()
      })
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', finish)
    el.addEventListener('touchcancel', finish)

    // ---- 鼠标（桌面预览调试用）----
    const onMouseDown = (e: MouseEvent) => {
      if (!enabled || e.button !== 0) return
      if ((e.target as HTMLElement)?.closest('.chips-wrap, .chips, button, input, .nut-searchbar, .nut-backtop, .nut-popup, .nut-popup-mask, .detail, .nut-overlay')) return
      begin(e.clientX, e.clientY)
    }
    const onMouseMove = (e: MouseEvent) => move(e.clientX, e.clientY, null)
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', finish)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', finish)
      el.removeEventListener('touchcancel', finish)
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', finish)
    }
  }, [selector])

  return { distance, pulling, refreshing }
}
