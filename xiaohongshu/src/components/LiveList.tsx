import { useCallback, useEffect, useRef, useState } from 'react'
import { Empty, InfiniteLoading, Loading } from '@nutui/nutui-react'
import { fetchLiveList, liveListQuery, type LiveRoom } from '../data/api'
import { navigate } from '../router'
import ChannelChips from './ChannelChips'
import { beginRequestToast, endRequestToast } from '../utils/loadingToast'

const SCROLLER_ID = 'live-page-body'

function categoryFromLocation() {
  const value = new URLSearchParams(window.location.search).get('category') || '0'
  return /^[0-6]$/.test(value) ? value : '0'
}

function writeLiveUrl(category: string, replace: boolean) {
  if (!window.location.pathname.startsWith('/livelist')) return
  const next = `/livelist?${liveListQuery('0', category)}`
  const current = `${window.location.pathname}${window.location.search}`
  if (current === next) return
  if (replace) window.history.replaceState({ liveCategory: category }, '', next)
  else window.history.pushState({ liveCategory: category }, '', next)
}

const LIVE_CATEGORIES = [
  { id: '0', name: '全部' },
  { id: '1', name: '游戏' },
  { id: '2', name: '才艺颜值' },
  { id: '3', name: '生活分享' },
  { id: '4', name: '兴趣手工' },
  { id: '5', name: '科技财经' },
  { id: '6', name: '运动户外' },
]

/**
 * 小红书 /livelist。数据来自直播广场 squarefeed，不走首页的热搜、频道和推荐流。
 */
export default function LiveList({ active = true }: { active?: boolean }) {
  const [category, setCategory] = useState(categoryFromLocation)
  const urlReadyRef = useRef(false)
  const [rooms, setRooms] = useState<LiveRoom[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const cursorRef = useRef<Record<string, string>>({})
  const roomsRef = useRef<Record<string, LiveRoom[]>>({})
  const abortRef = useRef<AbortController | null>(null)
  const reqRef = useRef(0)

  const load = useCallback(async (cat: string, more: boolean) => {
    const req = ++reqRef.current
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setLoading(true)
    const toastId = beginRequestToast(more ? '正在加载更多' : '正在加载')
    try {
      const data = await fetchLiveList(more ? cursorRef.current[cat] || '0' : '0', cat, ac.signal)
      if (req !== reqRef.current) {
        endRequestToast(toastId)
        return
      }
      const incoming = data.rooms || []
      setRooms((prev) => {
        const seen = new Set(more ? prev.map((room) => room.roomId) : [])
        const next = more ? [...prev] : []
        for (const room of incoming) {
          if (seen.has(room.roomId)) continue
          seen.add(room.roomId)
          next.push(room)
        }
        roomsRef.current[cat] = next
        return next
      })
      cursorRef.current[cat] = data.cursor || ''
      setHasMore(Boolean(data.hasMore && data.cursor))
      const empty = incoming.length === 0 && !more
      endRequestToast(
        toastId,
        empty
          ? { content: data.upstreamStatus === 200 ? '暂时没有直播' : '直播加载失败', duration: 1.5 }
          : undefined
      )
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        endRequestToast(toastId)
        return
      }
      endRequestToast(toastId, { content: '直播加载失败', duration: 1.5 })
    } finally {
      if (req === reqRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!active) {
      abortRef.current?.abort()
      return
    }
    const cached = roomsRef.current[category]
    if (cached?.length) {
      setRooms(cached)
      setHasMore(Boolean(cursorRef.current[category]))
      return
    }
    setRooms([])
    void load(category, false)
  }, [active, category, load])

  useEffect(() => {
    if (!active) return
    writeLiveUrl(category, !urlReadyRef.current)
    urlReadyRef.current = true
  }, [active, category])

  useEffect(() => {
    const onPop = () => {
      if (!window.location.pathname.startsWith('/livelist')) return
      setCategory(categoryFromLocation())
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => () => abortRef.current?.abort(), [])

  return (
    <>
      <div className="sticky-top">
        <header className="explore-header">
          <div className="explore-logo">直播</div>
        </header>
        <ChannelChips
          channels={LIVE_CATEGORIES.map((item) => item.name)}
          value={LIVE_CATEGORIES.find((item) => item.id === category)?.name || '全部'}
          onChange={(name) => {
            const hit = LIVE_CATEGORIES.find((item) => item.name === name)
            if (hit) setCategory(hit.id)
          }}
        />
      </div>
      {loading && rooms.length === 0 ? (
        <div className="empty-box">
          <Loading>正在加载直播…</Loading>
        </div>
      ) : rooms.length === 0 ? (
        <div className="empty-box">
          <Empty description="暂时没有直播" />
        </div>
      ) : (
        <>
          <div className="live-grid">
            {rooms.map((room) => (
              <button
                key={room.roomId}
                type="button"
                className="live-card"
                onClick={() => navigate(`/livestream/${room.roomId}`)}
              >
                {room.cover ? (
                  <img src={room.cover} alt="" referrerPolicy="no-referrer" />
                ) : (
                  <span className="live-card-fallback">直播</span>
                )}
                <span className="live-card-title">{room.title}</span>
                <span className="live-card-host">
                  {room.nickname}
                  {room.viewers ? ` · ${room.viewers}` : ''}
                </span>
              </button>
            ))}
          </div>
          <InfiniteLoading
            target={SCROLLER_ID}
            hasMore={hasMore}
            onLoadMore={async () => {
              await load(category, true)
            }}
            loadingText="加载中"
            loadMoreText="没有更多直播了"
          />
        </>
      )}
    </>
  )
}
