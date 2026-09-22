import { useEffect, useState } from 'react'
import type { Author } from './data'

export interface RouteInfo {
  path: string
  name: 'home' | 'user'
  userId?: string
  author?: Author
  channel?: string
  query: Record<string, string>
}

/**
 * 解析并生成小红书标准的 24 位十六进制博主 ID（MongoDB ObjectId 规范）
 */
export function resolveUserId(author: { name?: string; avatar?: string; userId?: string }): string {
  // 1. 若已有合法有效的英文/数字/十六进制 ID（且非中文名称占位，长度至少 8 位）
  if (author.userId && !/[^\w-]/.test(author.userId) && author.userId !== author.name && author.userId.length >= 8) {
    return author.userId
  }

  // 2. 尝试从头像链接提取 24 位 Hex ID
  const avatarHexMatch = author.avatar?.match(/avatar\/([a-f0-9]{24})/i)
  if (avatarHexMatch) {
    return avatarHexMatch[1]
  }

  // 3. 基于博主昵称与头像哈希，生成确定性的 24 位十六进制博主 ID（格式完全对齐小红书官方规范）
  const seed = (author.name || '') + '|' + (author.avatar || 'user')
  let h1 = 0x5d69dbca
  let h2 = 0x010081fc
  for (let i = 0; i < seed.length; i++) {
    const code = seed.charCodeAt(i)
    h1 = Math.imul(h1 ^ code, 2654435761)
    h2 = Math.imul(h2 ^ code, 1597334677)
  }
  h1 = ((h1 ^ (h1 >>> 16)) >>> 0)
  h2 = ((h2 ^ (h2 >>> 16)) >>> 0)
  const p1 = (0x50000000 + (h1 % 0x1f000000)).toString(16).padStart(8, '0')
  const p2 = '00000000'
  const p3 = (0x01000000 + (h2 % 0x0effffff)).toString(16).padStart(8, '0')
  return `${p1}${p2}${p3}`
}

/**
 * 解析当前浏览器地址为规范化路由信息
 */
export function parseRoute(rawUrl?: string): RouteInfo {
  if (typeof window === 'undefined') {
    return { path: '/', name: 'home', query: {} }
  }

  try {
    const url = rawUrl ? new URL(rawUrl, window.location.origin) : new URL(window.location.href)
    let pathname = url.pathname
    const searchParams = url.searchParams

    // 兼顾 hash 路由兜底（例如 #/user/profile/xxx）
    if (url.hash && url.hash.startsWith('#/')) {
      const hashPart = url.hash.slice(1)
      const [hp, hq] = hashPart.split('?')
      pathname = hp
      if (hq) {
        const hashParams = new URLSearchParams(hq)
        hashParams.forEach((v, k) => {
          if (!searchParams.has(k)) searchParams.set(k, v)
        })
      }
    }

    const query: Record<string, string> = {}
    searchParams.forEach((val, key) => {
      query[key] = val
    })

    // 匹配 /user/profile/:id 或 /user/:id
    const userProfileMatch = pathname.match(/^\/user\/(?:profile\/)?([^/]+)/)
    // 兼容 query 参数形如 ?user=xxx 或 ?userId=xxx
    const userQueryId = searchParams.get('userId') || searchParams.get('user')

    if (userProfileMatch || userQueryId) {
      const rawUserId = userProfileMatch ? decodeURIComponent(userProfileMatch[1]) : userQueryId!
      const userId = resolveUserId({ name: query.name, avatar: query.avatar, userId: rawUserId })

      // 清除任何多余的 query 参数（如 ?name=...&avatar=...），确保地址栏严格只有 /user/profile/:userId
      if (typeof window !== 'undefined') {
        const cleanPath = `/user/profile/${userId}`
        if (window.location.pathname !== cleanPath || window.location.search) {
          window.history.replaceState({}, '', cleanPath)
        }
      }

      return {
        path: `/user/profile/${userId}`,
        name: 'user',
        userId,
        query: {},
      }
    }

    return {
      path: pathname,
      name: 'home',
      channel: query.channel || query.tab || undefined,
      query,
    }
  } catch {
    return { path: '/', name: 'home', query: {} }
  }
}

const ROUTE_EVENT = 'app:routechange'

/**
 * 客户端路由跳转方法，同步更新浏览器地址栏并触发路由变更事件
 */
export function navigate(to: string, replace = false) {
  if (typeof window === 'undefined') return
  try {
    if (replace) {
      window.history.replaceState({}, '', to)
    } else {
      window.history.pushState({}, '', to)
    }
    window.dispatchEvent(new Event(ROUTE_EVENT))
    window.dispatchEvent(new PopStateEvent('popstate'))
  } catch {
    window.location.href = to
  }
}

/**
 * 跳转到指定博主详情页的路由包装工具（URL 仅保留标准 24 位十六进制 userId，其他信息完全走接口拉取）
 */
export function openUserProfileRoute(author: Partial<Author> & { name?: string; avatar?: string; userId?: string; userUrl?: string }) {
  const userId = resolveUserId(author)
  navigate(`/user/profile/${userId}`)
}

/**
 * React 路由订阅 Hook
 */
export function useRoute(): RouteInfo {
  const [route, setRoute] = useState<RouteInfo>(() => parseRoute())

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(parseRoute())
    }

    window.addEventListener('popstate', handleRouteChange)
    window.addEventListener(ROUTE_EVENT, handleRouteChange)
    window.addEventListener('hashchange', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      window.removeEventListener(ROUTE_EVENT, handleRouteChange)
      window.removeEventListener('hashchange', handleRouteChange)
    }
  }, [])

  return route
}
