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
      const userId = userProfileMatch ? decodeURIComponent(userProfileMatch[1]) : userQueryId!
      const name = query.name ? decodeURIComponent(query.name) : ''
      const avatar = query.avatar ? decodeURIComponent(query.avatar) : ''
      const userUrl = query.userUrl ? decodeURIComponent(query.userUrl) : ''

      const author: Author = {
        name,
        avatar,
        userId,
        userUrl: userUrl || undefined,
      }

      return {
        path: pathname,
        name: 'user',
        userId,
        author,
        query,
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
 * 跳转到指定博主详情页的路由包装工具
 */
export function openUserProfileRoute(author: Partial<Author> & { name?: string; avatar?: string; userId?: string; userUrl?: string }) {
  const avatarIdMatch = author.avatar?.match(/avatar\/([a-f0-9]{24})/i)
  const userId = author.userId || (avatarIdMatch ? avatarIdMatch[1] : '') || encodeURIComponent(author.name || 'user')
  const qs = new URLSearchParams()
  if (author.name) qs.set('name', author.name)
  if (author.avatar) qs.set('avatar', author.avatar)
  if (author.userUrl) qs.set('userUrl', author.userUrl)
  const queryString = qs.toString() ? `?${qs.toString()}` : ''
  navigate(`/user/profile/${userId}${queryString}`)
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
