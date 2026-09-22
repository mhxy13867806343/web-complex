/**
 * 搜索历史记录管理（localStorage 持久化与跨组件响应式同步）
 */
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'xhs_search_history'
const EVENT_NAME = 'xhs:search_history_change'
const MAX_HISTORY_ITEMS = 15

export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string' && item.trim()) : []
  } catch {
    return []
  }
}

export function saveSearchHistory(list: string[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: list }))
  } catch {
    /* ignore */
  }
}

export function addSearchHistory(keyword: string): string[] {
  const clean = keyword.replace(/^#/, '').trim()
  if (!clean) return getSearchHistory()
  const list = getSearchHistory().filter((item) => item.toLowerCase() !== clean.toLowerCase())
  list.unshift(clean)
  const sliced = list.slice(0, MAX_HISTORY_ITEMS)
  saveSearchHistory(sliced)
  return sliced
}

export function removeSearchHistoryItem(keyword: string): string[] {
  const clean = keyword.replace(/^#/, '').trim()
  const list = getSearchHistory().filter((item) => item.toLowerCase() !== clean.toLowerCase())
  saveSearchHistory(list)
  return list
}

export function clearSearchHistory(): string[] {
  saveSearchHistory([])
  return []
}

/**
 * 响应式搜索历史 React Hook
 */
export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => getSearchHistory())

  useEffect(() => {
    const handleUpdate = () => {
      setHistory(getSearchHistory())
    }
    window.addEventListener(EVENT_NAME, handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  return {
    history,
    addHistory: addSearchHistory,
    removeItem: removeSearchHistoryItem,
    clearHistory: clearSearchHistory,
  }
}
