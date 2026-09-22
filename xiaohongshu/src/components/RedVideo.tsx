import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Empty, InfiniteLoading, Loading } from '@nutui/nutui-react'
import { Toast } from '@nutui/nutui-react'
import type { Note } from '../data'
import { fetchFeed, fetchNoteDetail } from '../data/api'
import { openNoteRoute, openSearchResultRoute, openUserProfileRoute } from '../router'
import { beginRequestToast, endRequestToast } from '../utils/loadingToast'
import Waterfall from './Waterfall'

const SCROLLER_ID = 'red-page-body'

function videoSrc(rawUrl?: string) {
  if (!rawUrl) return ''
  if (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return `/api/xhs/video?url=${encodeURIComponent(rawUrl)}`
  }
  return rawUrl.replace(/^http:/, 'https:')
}

function mergeVideos(head: Note[], tail: Note[]) {
  const seen = new Set<string>()
  const out: Note[] = []
  for (const note of [...head, ...tail]) {
    if (note.type !== 'video' || !note.id || seen.has(note.id)) continue
    seen.add(note.id)
    out.push(note)
  }
  return out
}

/**
 * 小红书 /red_video
 * 瀑布流是原来的双列视频列表；上下滑是整页视频流。两套布局都留在这一页。
 */
export default function RedVideo() {
  const [mode, setMode] = useState<'list' | 'swipe'>('list')
  const [swipeIndex, setSwipeIndex] = useState(0)
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)
  const [bottom, setBottom] = useState(false)
  const pageRef = useRef(0)
  const loadingRef = useRef(false)

  const load = useCallback(async (more: boolean) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    const toastId = beginRequestToast(more ? '正在加载更多' : '正在加载')
    const page = more ? pageRef.current + 1 : 1
    try {
      const batch = await fetchFeed('视频', { more: page > 1 })
      const incoming = (batch.notes || []).filter((note) => note.type === 'video')
      setNotes((prev) => {
        const next = mergeVideos(more ? prev : [], incoming)
        if (more && next.length === prev.length) setBottom(true)
        return next
      })
      pageRef.current = page
      endRequestToast(toastId, incoming.length || more ? undefined : { content: '暂时没有视频', duration: 1.5 })
    } catch {
      endRequestToast(toastId, { content: '加载失败，请稍后重试', duration: 1.5 })
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [])

  const loadMore = useCallback(() => {
    if (bottom) return
    void load(true)
  }, [bottom, load])

  useEffect(() => {
    void load(false)
  }, [load])

  useEffect(() => {
    const el = document.getElementById(SCROLLER_ID)
    if (!el) return
    if (mode === 'swipe') {
      el.classList.add('is-swipe-host')
      el.scrollTop = 0
    } else {
      el.classList.remove('is-swipe-host')
    }
    return () => el.classList.remove('is-swipe-host')
  }, [mode])

  return (
    <>
      {mode === 'list' ? (
        <>
          <div className="sticky-top">
            <header className="explore-header">
              <div className="explore-logo">RED</div>
              <button
                type="button"
                className="explore-search-wrap red-search-btn"
                onClick={() => openSearchResultRoute('视频')}
              >
                <span className="explore-search-icon">搜索视频</span>
              </button>
              <RedModeSwitch mode={mode} onChange={setMode} />
            </header>
          </div>
          {loading && notes.length === 0 ? (
            <div className="empty-box">
              <Loading>正在加载视频…</Loading>
            </div>
          ) : notes.length === 0 ? (
            <div className="empty-box">
              <Empty description="暂时没有视频" />
            </div>
          ) : (
            <>
              <Waterfall
                notes={notes}
                onOpen={(note) => openNoteRoute(note.id)}
                onOpenUser={(author) => openUserProfileRoute(author)}
              />
              <InfiniteLoading
                target={SCROLLER_ID}
                hasMore={!bottom}
                onLoadMore={async () => {
                  await load(true)
                }}
                loadingText="加载中"
                loadMoreText="没有更多视频了"
              />
            </>
          )}
        </>
      ) : (
        <SwipeFeed
          notes={notes}
          loading={loading}
          initialIndex={swipeIndex}
          onIndexChange={setSwipeIndex}
          onNeedMore={loadMore}
          onBack={() => setMode('list')}
        />
      )}
    </>
  )
}

function RedModeSwitch({
  mode,
  onChange,
}: {
  mode: 'list' | 'swipe'
  onChange: (mode: 'list' | 'swipe') => void
}) {
  return (
    <div className="red-mode-switch">
      <button type="button" className={mode === 'list' ? 'is-on' : ''} onClick={() => onChange('list')}>
        瀑布流
      </button>
      <button type="button" className={mode === 'swipe' ? 'is-on' : ''} onClick={() => onChange('swipe')}>
        上下滑
      </button>
    </div>
  )
}

function SwipeFeed({
  notes,
  loading,
  initialIndex,
  onIndexChange,
  onNeedMore,
  onBack,
}: {
  notes: Note[]
  loading: boolean
  initialIndex: number
  onIndexChange: (index: number) => void
  onNeedMore: () => void
  onBack: () => void
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const urlCache = useRef<Record<string, string>>({})
  const emptyTold = useRef<Set<string>>(new Set())
  const positionedRef = useRef(false)
  const [index, setIndex] = useState(() => Math.max(0, initialIndex))
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [stats, setStats] = useState<
    Record<string, { likedCount: string; collectedCount: string; commentCount: string; shareCount: string }>
  >({})
  const [muted, setMuted] = useState(false)
  const [paused, setPaused] = useState(false)

  useLayoutEffect(() => {
    const root = scrollerRef.current
    if (!root || !notes.length) return
    const start = Math.min(Math.max(0, initialIndex), notes.length - 1)
    const jump = () => {
      const height = root.clientHeight
      if (!height) return
      root.scrollTop = start * height
    }
    jump()
    const frame = requestAnimationFrame(() => {
      jump()
      positionedRef.current = true
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  const resolveUrl = useCallback(async (note: Note) => {
    if (urlCache.current[note.id]) return urlCache.current[note.id]
    const detail = await fetchNoteDetail(note.id, note.noteUrl, note)
    const info = detail.interactInfo
    setStats((prev) => ({
      ...prev,
      [note.id]: {
        likedCount: info?.likedCount || note.likes || '0',
        collectedCount: info?.collectedCount || '0',
        commentCount: info?.commentCount || '0',
        shareCount: info?.shareCount || '0',
      },
    }))
    const url = (detail.videoUrl || '').trim()
    if (!url) {
      if (!emptyTold.current.has(note.id)) {
        emptyTold.current.add(note.id)
        Toast.show({ content: '这条视频内容为空', duration: 1.5, lockScroll: false })
      }
      return ''
    }
    urlCache.current[note.id] = url
    setUrls((prev) => ({ ...prev, [note.id]: url }))
    return url
  }, [])

  useEffect(() => {
    const current = notes[index]
    const next = notes[index + 1]
    if (current) void resolveUrl(current)
    if (next) void resolveUrl(next)
    if (notes.length && index >= notes.length - 2) onNeedMore()
  }, [index, notes, resolveUrl, onNeedMore])

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (i === index && !paused) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [index, paused, urls])

  const onScroll = () => {
    const root = scrollerRef.current
    if (!root) return
    const height = root.clientHeight || 1
    if (!positionedRef.current) return
    const next = Math.min(notes.length - 1, Math.max(0, Math.round(root.scrollTop / height)))
    if (next !== index) {
      setPaused(false)
      setIndex(next)
      onIndexChange(next)
    }
  }

  if (loading && notes.length === 0) {
    return (
      <div className="swipe-empty">
        <Loading>正在加载视频…</Loading>
      </div>
    )
  }

  if (!notes.length) {
    return (
      <div className="swipe-empty">
        <Empty description="暂时没有视频" />
        <button type="button" className="swipe-back" onClick={onBack}>
          瀑布流
        </button>
      </div>
    )
  }

  return (
    <div className="swipe-feed" ref={scrollerRef} onScroll={onScroll}>
      {notes.map((note, i) => {
        const src = urls[note.id] ? videoSrc(urls[note.id]) : ''
        const active = i === index
        return (
          <section className="swipe-slide" key={note.id}>
            {note.cover ? (
              <img className="swipe-poster" src={note.cover} alt="" referrerPolicy="no-referrer" />
            ) : null}
            {src ? (
              <video
                ref={(el) => {
                  videoRefs.current[i] = el
                }}
                src={Math.abs(i - index) <= 1 ? src : undefined}
                poster={note.cover || undefined}
                playsInline
                loop
                muted={muted}
                preload={active ? 'auto' : 'none'}
                onClick={() => {
                  const video = videoRefs.current[i]
                  if (!video) return
                  if (video.paused) {
                    video.play().catch(() => {})
                    setPaused(false)
                  } else {
                    video.pause()
                    setPaused(true)
                  }
                }}
              />
            ) : (
              <div className="swipe-waiting">{active ? '正在加载视频…' : ''}</div>
            )}
            <button type="button" className="swipe-back" onClick={onBack}>
              瀑布流
            </button>
            <button type="button" className="swipe-mute" onClick={() => setMuted((value) => !value)}>
              {muted ? '静音' : '有声'}
            </button>
            <div className="swipe-meta">
              <button type="button" className="swipe-author" onClick={() => openUserProfileRoute(note.author)}>
                {note.author.avatar ? (
                  <img src={note.author.avatar} alt="" referrerPolicy="no-referrer" />
                ) : null}
                <span>{note.author.name}</span>
              </button>
              <p>{note.title}</p>
              <div className="swipe-stats">
                <span>{stats[note.id]?.likedCount || note.likes || '0'} 赞</span>
                <span>{stats[note.id]?.collectedCount || '0'} 收藏</span>
                <span>{stats[note.id]?.commentCount || '0'} 评论</span>
                <span>{stats[note.id]?.shareCount || '0'} 分享</span>
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
