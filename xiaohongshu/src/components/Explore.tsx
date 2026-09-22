import { useCallback, useEffect, useRef, useState } from 'react'
import { BackTop, Empty, InfiniteLoading, Loading } from '@nutui/nutui-react'
import type { Author, Note, UserProfileData } from '../data'
import { buildUserProfile, fetchChannels, fetchFeed } from '../data/api'
import { STATIC_CHANNELS } from '../data/staticFeeds'
import { PTR_TRIGGER, usePullToRefresh } from '../hooks/usePullToRefresh'
import ChannelChips from './ChannelChips'
import NoteDetail from './NoteDetail'
import { Toast } from './Toast'
import UserProfile from './UserProfile'
import Waterfall from './Waterfall'

const RECOMMEND = '推荐'
/** 给 document.querySelector 用（带 #），下拉刷新 / 切频道滚顶都靠它 */
const SCROLLER = '#page-body'
/** 给 NutUI InfiniteLoading 的 target 用 —— 组件内部是 document.getElementById(target)，所以这里只能传 id（不带 #） */
const SCROLLER_ID = 'page-body'

/** 单个流最多累积多少条 */
const CAP = 300

/** 默认包含所有预置频道，确保初次根据 URL 渲染时 tab 即可直接定位选中 */
const INITIAL_CHANNELS = [RECOMMEND, ...STATIC_CHANNELS.map((c) => c.name)]

/** 从当前地址栏获取频道参数（支持 ?channel=彩妆、?tab=彩妆 以及 hash 锚点） */
function getInitialChannel(): string {
  if (typeof window === 'undefined') return RECOMMEND
  try {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('channel') || params.get('tab')
    if (q) return decodeURIComponent(q).trim()
    const hash = window.location.hash.replace(/^#\/?/, '').trim()
    if (hash) {
      const hashParams = new URLSearchParams(hash)
      const hq = hashParams.get('channel') || hashParams.get('tab')
      if (hq) return decodeURIComponent(hq).trim()
      return decodeURIComponent(hash).trim()
    }
  } catch {
    /* fallback */
  }
  return RECOMMEND
}

/** 同步当前频道到浏览器地址栏（写入 history，支持刷新与后退前进） */
function syncUrlChannel(ch: string) {
  if (typeof window === 'undefined') return
  try {
    const url = new URL(window.location.href)
    if (ch && ch !== RECOMMEND) {
      url.searchParams.set('channel', ch)
    } else {
      url.searchParams.delete('channel')
    }
    window.history.pushState({ channel: ch }, '', url.toString())
  } catch {
    /* ignore */
  }
}

/** 去重拼接 */
function mergeNotes(head: Note[], tail: Note[]): Note[] {
  const seen = new Set<string>()
  const out: Note[] = []
  for (const n of [...head, ...tail]) {
    if (seen.has(n.id)) continue
    seen.add(n.id)
    out.push(n)
  }
  return out
}

export default function Explore() {
  const [channels, setChannels] = useState<string[]>(INITIAL_CHANNELS)
  const [channel, setChannel] = useState<string>(getInitialChannel)
  /** 每个流抓到的笔记列表 */
  const [feeds, setFeeds] = useState<Record<string, Note[]>>({})
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)
  /** 接口不可用时标记 */
  const [dead, setDead] = useState<Record<string, boolean>>({})
  const [collected, setCollected] = useState<Record<string, boolean>>({})
  const [openNote, setOpenNote] = useState<Note | null>(null)
  const [activeProfile, setActiveProfile] = useState<UserProfileData | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  /** 每个流已经「到底」的标记 */
  const [bottom, setBottom] = useState<Record<string, boolean>>({})
  /** feeds 的镜像 ref */
  const feedsRef = useRef<Record<string, Note[]>>({})

  const list: Note[] = feeds[channel] || []
  const hasMore = !dead[channel] && !bottom[channel]

  const handleOpenUser = useCallback(
    (author: Author, relatedNote?: Note) => {
      // 聚合所有已知笔记以提供最丰富的主页作品流
      const allKnownNotes = Object.values(feedsRef.current).flat()
      if (relatedNote && !allKnownNotes.some((n) => n.id === relatedNote.id)) {
        allKnownNotes.unshift(relatedNote)
      }
      const profile = buildUserProfile(author, allKnownNotes)
      setActiveProfile(profile)
    },
    []
  )

  /**
   * 抓一次数据（真实的 Ajax GET 请求）。
   * @param mode refresh=重新加载第 1 页；more=上拉加载下一页追加到末尾
   * @param silent 不弹 Toast
   */
  const load = useCallback(
    async (ch: string, silent = false, mode: 'refresh' | 'more' = 'refresh') => {
      if (loadingRef.current && mode === 'more') return 0
      loadingRef.current = true
      setLoading(true)
      const ac = new AbortController()
      abortRef.current = ac
      try {
        const r = await fetchFeed(ch, { signal: ac.signal, more: mode === 'more' })
        if (r.notes.length) {
          const cur = mode === 'more' ? (feedsRef.current[ch] || []) : []
          const next = mode === 'more' ? mergeNotes(cur, r.notes) : r.notes
          const added = next.length - cur.length
          feedsRef.current[ch] = next.slice(0, CAP)
          setFeeds((prev) => ({ ...prev, [ch]: next.slice(0, CAP) }))
          if (mode === 'more' && added === 0) {
            // 没有更多新笔记可追加了（已全部加载完毕），标记到底并停止重复触发加载
            setBottom((prev) => ({ ...prev, [ch]: true }))
            if (!silent) {
              Toast.show({ content: '已经到底了', duration: 1.5 })
            }
            return 0
          }
          // 重新有新数据了，撤销「到底」标记
          setBottom((prev) => (prev[ch] ? { ...prev, [ch]: false } : prev))
          setDead((prev) => (prev[ch] ? { ...prev, [ch]: false } : prev))
          if (added > 0 && !silent) {
            Toast.show({
              content: mode === 'more' ? `已加载 ${added} 条新笔记` : `已刷新 ${added} 条笔记`,
              duration: 1.5,
            })
          }
          return added
        }
        if (mode === 'more') setBottom((prev) => ({ ...prev, [ch]: true }))
        if (!silent) Toast.show({ content: '已经到底了', duration: 1.5 })
        return 0
      } catch (e) {
        if ((e as Error).name === 'AbortError') return 0
        setDead((prev) => ({ ...prev, [ch]: true }))
        if (!silent) Toast.show({ content: `加载失败：${(e as Error).message}`, duration: 2.4 })
        return 0
      } finally {
        loadingRef.current = false
        setLoading(false)
      }
    },
    []
  )

  // 监听浏览器前进 / 后退 / hash 改变，自动同步切换频道
  useEffect(() => {
    const handleUrlChange = () => {
      const ch = getInitialChannel()
      setChannel((prev) => (prev !== ch ? ch : prev))
    }
    window.addEventListener('popstate', handleUrlChange)
    window.addEventListener('hashchange', handleUrlChange)
    return () => {
      window.removeEventListener('popstate', handleUrlChange)
      window.removeEventListener('hashchange', handleUrlChange)
    }
  }, [])

  // 分类实时拉取
  useEffect(() => {
    const ac = new AbortController()
    fetchChannels(ac.signal)
      .then((r) => {
        const names = r.channels.filter((c) => c.name !== RECOMMEND).map((c) => c.name)
        if (names.length) setChannels([RECOMMEND, ...names])
      })
      .catch(() => {
        /* 拉不到就只有「推荐」 */
      })
    return () => ac.abort()
  }, [])

  // 首屏 + 每次切频道发起 Ajax 请求
  useEffect(() => {
    document.querySelector(SCROLLER)?.scrollTo({ top: 0 })
    void load(channel, true, 'refresh')
  }, [channel, load])

  useEffect(() => () => abortRef.current?.abort(), [])

  /** 下拉刷新：详情弹窗打开时彻底关闭，防止任何下拉手势穿透触发主页刷新 */
  const { distance, pulling, refreshing } = usePullToRefresh(
    SCROLLER,
    async () => {
      const n = await load(channel, false, 'refresh')
      if (n) Toast.show({ content: `已刷新 ${n} 条最新笔记`, duration: 1.6 })
    },
    !openNote
  )

  /** 上拉加载：每一次都发起真实的 Ajax / Fetch 请求并追加数据 */
  const loadMore = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (openNote || loadingRef.current || dead[channel] || bottom[channel]) {
        resolve()
        return
      }
      void load(channel, false, 'more').then(() => {
        resolve()
      })
    })
  }, [channel, dead, bottom, load, openNote])

  /** 滚动触底检测双保险（同时监听 window 和 #page-body，确保任何视口/设备下均能触底加载） */
  useEffect(() => {
    const el = document.getElementById(SCROLLER_ID)
    const checkAndLoad = () => {
      if (openNote || loadingRef.current || bottom[channel] || dead[channel]) return

      let distanceToBottom = 9999
      if (el && el.scrollHeight > el.clientHeight) {
        distanceToBottom = Math.min(distanceToBottom, el.scrollHeight - el.clientHeight - el.scrollTop)
      }
      const winScrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
      const winHeight = window.innerHeight || document.documentElement.clientHeight || 0
      const winScrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0
      if (winScrollHeight > winHeight) {
        distanceToBottom = Math.min(distanceToBottom, winScrollHeight - winHeight - winScrollTop)
      }

      if (distanceToBottom <= 260) {
        void load(channel, false, 'more')
      }
    }

    el?.addEventListener('scroll', checkAndLoad, { passive: true })
    window.addEventListener('scroll', checkAndLoad, { passive: true })
    return () => {
      el?.removeEventListener('scroll', checkAndLoad)
      window.removeEventListener('scroll', checkAndLoad)
    }
  }, [channel, bottom, dead, load])

  const toggleCollect = (note: Note) => {
    const next = !collected[note.id]
    setCollected((prev) => ({ ...prev, [note.id]: next }))
    Toast.show({ content: next ? '已收藏' : '已取消收藏', duration: 1.2 })
  }

  // 左右滑动手势切换频道（像小红书原生 App 一样左右滑屏切 Tab）
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 })
  const onFeedTouchStart = (e: React.TouchEvent) => {
    if (pulling || refreshing || openNote) return
    const t = e.touches[0]
    touchStartRef.current = { x: t.clientX, y: t.clientY, time: Date.now() }
  }

  const onFeedTouchEnd = (e: React.TouchEvent) => {
    if (pulling || refreshing || openNote) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStartRef.current.x
    const dy = t.clientY - touchStartRef.current.y
    const dt = Date.now() - touchStartRef.current.time

    // 滑动位移大于 55px，横向大于纵向 1.3 倍，且在 600ms 内完成
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3 && dt < 600) {
      const idx = channels.indexOf(channel)
      if (idx !== -1) {
        if (dx < 0 && idx < channels.length - 1) {
          // 向左滑：切换到下一个频道
          const nextCh = channels[idx + 1]
          setChannel(nextCh)
          syncUrlChannel(nextCh)
        } else if (dx > 0 && idx > 0) {
          // 向右滑：切换到上一个频道
          const prevCh = channels[idx - 1]
          setChannel(prevCh)
          syncUrlChannel(prevCh)
        }
      }
    }
  }

  const busy = refreshing || loading
  const pullText = refreshing ? '正在刷新…' : distance >= PTR_TRIGGER ? '松手立即刷新' : '下拉刷新'
  /** 接口挂了且一条数据都没有时的说明 */
  const offline = dead[channel] && list.length === 0

  return (
    <div>
      {/* 顶栏 + 频道栏整体吸顶，滚多远都能直接切频道 */}
      <div className="sticky-top">
    

        {/* 下拉刷新提示区：随手指位移撑开高度，把内容顶下去 */}
        <div
          className={`ptr${pulling ? ' pulling' : ''}`}
          style={{ height: distance }}
          aria-hidden={distance === 0}
        >
          <span>{pullText}</span>
        </div>

        <ChannelChips
          channels={channels}
          value={channel}
          onChange={(c) => {
            if (c !== channel) {
              setChannel(c)
              syncUrlChannel(c)
            }
          }}
        />
      </div>

      <div
        className="feed-swipe-area"
        onTouchStart={onFeedTouchStart}
        onTouchEnd={onFeedTouchEnd}
      >
        {offline ? (
          <div className="empty-box">
            <Empty description="接口不可用，请用 npm run dev 或 npm run start 启动带 /api 的服务" />
          </div>
        ) : busy && list.length === 0 ? (
          <div className="empty-box">
            <Loading>正在抓取最新数据…</Loading>
          </div>
        ) : list.length === 0 ? (
          <div className="empty-box">
            <Empty description="这个频道暂时拿不到数据，点右上角刷新试试" />
          </div>
        ) : (
          <>
            <div key={channel} className="feed-transition-wrap">
              <Waterfall notes={list} onOpen={setOpenNote} onOpenUser={handleOpenUser} />
            </div>
            <div
              className="loadmore-trigger"
              onClick={() => {
                if (!loadingRef.current && hasMore) {
                  void load(channel, false, 'more')
                }
              }}
              style={{
                textAlign: 'center',
                padding: '16px 0 28px',
                color: '#999',
                fontSize: '13px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              {loading ? '正在请求最新笔记…' : hasMore ? '上拉或点击加载更多' : '— 已经到底了 —'}
            </div>
          </>
        )}
      </div>

      <InfiniteLoading
        hasMore={hasMore}
        threshold={180}
        target={SCROLLER_ID}
        loadingText="正在加载更多…"
        loadMoreText="已经到底了"
        onLoadMore={loadMore}
      />

      <NoteDetail
        note={openNote}
        collected={openNote ? !!collected[openNote.id] : false}
        onCollect={toggleCollect}
        onClose={() => setOpenNote(null)}
        onOpenUser={handleOpenUser}
      />

      <UserProfile
        profile={activeProfile}
        visible={!!activeProfile}
        onClose={() => setActiveProfile(null)}
        onOpenNote={(note) => {
          setOpenNote(note)
        }}
      />

      {/* NutUI BackTop 返回顶部 */}
      <BackTop
        target={SCROLLER_ID}
        threshold={240}
        duration={500}
      />
    </div>
  )
}
