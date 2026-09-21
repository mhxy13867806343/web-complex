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
  onRefresh: () => Promise<unknown> | unknown
) {
  const [distance, setDistance] = useState(0)
  const [pulling, setPulling] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const cb = useRef(onRefresh)
  useEffect(() => {
    cb.current = onRefresh
  }, [onRefresh])

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(selector)
    if (!el) return

    let active = false
    let startY = 0
    let dist = 0

    const begin = (y: number) => {
      if (el.scrollTop > 0) return
      active = true
      startY = y
      dist = 0
      setPulling(true)
    }

    const move = (y: number, prevent: (() => void) | null) => {
      if (!active) return
      const dy = y - startY
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
      if (!active) return
      active = false
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
    const onTouchStart = (e: TouchEvent) => begin(e.touches[0].clientY)
    const onTouchMove = (e: TouchEvent) =>
      move(e.touches[0].clientY, () => {
        if (e.cancelable) e.preventDefault()
      })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', finish)
    el.addEventListener('touchcancel', finish)

    // ---- 鼠标（桌面预览调试用）----
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      begin(e.clientY)
    }
    const onMouseMove = (e: MouseEvent) => move(e.clientY, null)
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
