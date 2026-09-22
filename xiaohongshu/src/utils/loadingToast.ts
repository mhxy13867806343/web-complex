import { Toast } from '@nutui/nutui-react'

/**
 * 请求进行中的 NutUI Toast。
 * 提示还在时遮罩拦住点击和滚动。切到别的路由时立刻清掉，避免带到下一页。
 * Toast.show 是异步挂载，接口很快返回时 clear 会落空，所以关掉之后再补几次清理。
 */
let seq = 0
/** 当前还应该显示的那一次；0 表示不该再留着加载提示 */
let openId = 0

const blocking = {
  lockScroll: true,
  closeOnOverlayClick: false,
}

function wipeToast() {
  try {
    Toast.clear()
  } catch {
    /* 实例还没挂上时 clear 会空转 */
  }
  document.body.classList.remove('nut-overflow-hidden')
  document.documentElement.classList.remove('nut-overflow-hidden')
  document.querySelectorAll('.nut-toast-overlay-default').forEach((node) => {
    const host = node.parentElement
    if (host && host.parentElement === document.body) host.remove()
  })
}

function scheduleWipe(closedId: number) {
  const run = () => {
    if (openId !== 0 && openId !== closedId) return
    wipeToast()
  }
  run()
  queueMicrotask(run)
  requestAnimationFrame(run)
  window.setTimeout(run, 60)
}

/** 路由一切走就把当前加载提示作废，进行中的请求回来后也不能再把它弹回来 */
export function dismissRequestToast() {
  const closedId = seq
  seq += 1
  openId = 0
  scheduleWipe(closedId)
}

export function beginRequestToast(content = '加载中') {
  const id = ++seq
  openId = id
  try {
    Toast.show({
      content,
      icon: 'loading',
      duration: 0,
      ...blocking,
    })
  } catch (err) {
    console.warn('[Toast] 加载提示未弹出', err)
  }
  return id
}

export function endRequestToast(
  id: number,
  next?: { content: string; duration?: number }
) {
  if (id && id !== seq) return
  if (id === seq) {
    openId = 0
    scheduleWipe(id)
  }
  if (!next?.content) return
  window.setTimeout(() => {
    if ((id && id !== seq) || openId !== 0) return
    try {
      Toast.show({
        content: next.content,
        duration: next.duration ?? 1.5,
        ...blocking,
      })
    } catch (err) {
      console.warn('[Toast] 提示未弹出', err)
    }
  }, 80)
}
