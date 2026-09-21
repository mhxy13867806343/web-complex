import { useCallback, useEffect, useRef, useState } from 'react'
import { Empty, InfiniteLoading, Loading, SearchBar } from '@nutui/nutui-react'
import { Photograph, Refresh } from '@nutui/icons-react'
import { PAGE_SIZE, type Note } from '../data'
import { fetchChannels, fetchFeed } from '../data/api'
import { PTR_TRIGGER, usePullToRefresh } from '../hooks/usePullToRefresh'
import ChannelChips from './ChannelChips'
import NoteDetail from './NoteDetail'
import { Toast } from './Toast'
import Waterfall from './Waterfall'

const RECOMMEND = '推荐'
/** 给 document.querySelector 用（带 #），下拉刷新 / 切频道滚顶都靠它 */
const SCROLLER = '#page-body'
/** 给 NutUI InfiniteLoading 的 target 用 —— 组件内部是 document.getElementById(target)，所以这里只能传 id（不带 #） */
const SCROLLER_ID = 'page-body'

/** 单个流最多累积多少条 */
const CAP = 300

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
  const [channels, setChannels] = useState<string[]>([RECOMMEND])
  const [channel, setChannel] = useState<string>(RECOMMEND)
  /** 每个流抓到的笔记（新抓的排前面） */
  const [feeds, setFeeds] = useState<Record<string, Note[]>>({})
  const [loading, setLoading] = useState(false)
  /** 接口不可用（纯静态部署 / 被风控）时不再反复重试 */
  const [dead, setDead] = useState<Record<string, boolean>>({})
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [collected, setCollected] = useState<Record<string, boolean>>({})
  const [openNote, setOpenNote] = useState<Note | null>(null)
  const [visible, setVisible] = useState(PAGE_SIZE)
  const abortRef = useRef<AbortController | null>(null)
  /** 每个流已经「到底」的标记：上拉加载某次返回 0 条新内容就封顶 */
  const [bottom, setBottom] = useState<Record<string, boolean>>({})
  /** feeds 的镜像 ref，load 里用来算「这次新增了 N 条」（避免闭包拿到旧 state） */
  const feedsRef = useRef<Record<string, Note[]>>({})

  const activeNotes: Note[] = feeds[channel] || []
  const list = activeNotes.slice(0, visible)
  const hasMoreLocal = visible < activeNotes.length
  const hasMore = hasMoreLocal || (!dead[channel] && !bottom[channel])

  /**
   * 抓一次数据。
   * @param mode refresh=插到最前（下拉刷新/切频道）；more=追加到末尾（上拉加载）
   * @param silent 不弹 Toast
   */
  const load = useCallback(
    async (ch: string, silent = false, mode: 'refresh' | 'more' = 'refresh') => {
      abortRef.current?.abort()
      const ac = new AbortController()
      abortRef.current = ac
      setLoading(true)
      try {
        const r = await fetchFeed(ch, { signal: ac.signal, more: mode === 'more' })
        if (r.notes.length) {
          const cur = feedsRef.current[ch] || []
          const next = mode === 'more' ? mergeNotes(cur, r.notes) : mergeNotes(r.notes, cur)
          const added = next.length - cur.length
          feedsRef.current[ch] = next.slice(0, CAP)
          setFeeds((prev) => ({ ...prev, [ch]: next.slice(0, CAP) }))
          // 重新有数据了，撤销「到底」标记
          setBottom((prev) => (prev[ch] ? { ...prev, [ch]: false } : prev))
          setDead((prev) => (prev[ch] ? { ...prev, [ch]: false } : prev))
          if (added > 0) {
            if (!silent) {
              Toast.show({
                content: mode === 'more' ? `又加载了 ${added} 条` : `已刷新 ${added} 条`,
                duration: 1.5,
              })
            }
            return added
          }
          // 抓到了但全是重复的（极少见）→ 当作到底
          if (mode === 'more') setBottom((prev) => ({ ...prev, [ch]: true }))
          if (!silent) Toast.show({ content: '暂时没有更多了', duration: 1.5 })
          return 0
        }
        setDead((prev) => (prev[ch] ? { ...prev, [ch]: false } : prev))
        if (!silent) Toast.show({ content: '暂时没有更多了', duration: 1.5 })
        return 0
      } catch (e) {
        if ((e as Error).name === 'AbortError') return 0
        setDead((prev) => ({ ...prev, [ch]: true }))
        if (!silent) Toast.show({ content: `抓取失败：${(e as Error).message}`, duration: 2.4 })
        return 0
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // 分类实时拉（不是写死的）
  useEffect(() => {
    const ac = new AbortController()
    fetchChannels(ac.signal)
      .then((r) => {
        const names = r.channels.filter((c) => c.name !== RECOMMEND).map((c) => c.name)
        if (names.length) setChannels([RECOMMEND, ...names])
      })
      .catch(() => {
        /* 拉不到就只有「推荐」，下面会有提示 */
      })
    return () => ac.abort()
  }, [])

  // 首屏 + 每次切频道都重新请求
  useEffect(() => {
    setVisible(PAGE_SIZE)
    document.querySelector(SCROLLER)?.scrollTo({ top: 0 })
    void load(channel, true, 'refresh')
  }, [channel, load])

  useEffect(() => () => abortRef.current?.abort(), [])

  /** 下拉刷新 */
  const { distance, pulling, refreshing } = usePullToRefresh(SCROLLER, async () => {
    setVisible(PAGE_SIZE)
    const n = await load(channel, true, 'refresh')
    if (n) Toast.show({ content: `已刷新 ${n} 条最新笔记`, duration: 1.6 })
  })

  /** 上拉加载：先把本地没展示完的翻出来，翻完了再从接口续一页 */
  const loadMore = () =>
    new Promise<void>((resolve) => {
      if (hasMoreLocal) {
        setTimeout(() => {
          setVisible((v) => v + PAGE_SIZE)
          resolve()
        }, 400)
        return
      }
      if (dead[channel] || loading || bottom[channel]) {
        resolve()
        return
      }
      void load(channel, true, 'more').then((n) => {
        // 只有真的多出来新笔记才把可见条数往下推一页；否则（已到底）就停在「已经到底了」
        if (n > 0) setVisible((v) => v + PAGE_SIZE)
        resolve()
      })
    })

  const toggleLike = (note: Note) => {
    setLiked((prev) => ({ ...prev, [note.id]: !prev[note.id] }))
  }

  const toggleCollect = (note: Note) => {
    const next = !collected[note.id]
    setCollected((prev) => ({ ...prev, [note.id]: next }))
    Toast.show({ content: next ? '已收藏' : '已取消收藏', duration: 1.2 })
  }

  const busy = refreshing || loading
  const pullText = refreshing ? '正在刷新…' : distance >= PTR_TRIGGER ? '松手立即刷新' : '下拉刷新'
  /** 接口挂了且一条数据都没有时的说明 */
  const offline = dead[channel] && list.length === 0

  return (
    <div>
      {/* 顶栏 + 频道栏整体吸顶，滚多远都能直接切频道 */}
      <div className="sticky-top">
        <header className="xhs-header">
          <div className="xhs-logo">小红书</div>
          <SearchBar
            className="xhs-search"
            shape="round"
            placeholder="搜索小红书"
            onInputClick={() => Toast.show({ content: '搜索页（演示）', duration: 1.2 })}
          />
          <button
            type="button"
            className={`xhs-refresh${busy ? ' spinning' : ''}`}
            aria-label="刷新"
            onClick={() => void load(channel)}
          >
            <Refresh width={20} height={20} />
          </button>
          <Photograph className="xhs-header-icon" width={22} height={22} />
        </header>

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
            if (c !== channel) setChannel(c)
          }}
        />
      </div>

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
        <Waterfall notes={list} liked={liked} onLike={toggleLike} onOpen={setOpenNote} />
      )}

      <InfiniteLoading
        hasMore={hasMore}
        threshold={120}
        target={SCROLLER_ID}
        loadingText="正在加载…"
        loadMoreText="已经到底了"
        onLoadMore={loadMore}
      />

      <NoteDetail
        note={openNote}
        liked={openNote ? !!liked[openNote.id] : false}
        collected={openNote ? !!collected[openNote.id] : false}
        onLike={toggleLike}
        onCollect={toggleCollect}
        onClose={() => setOpenNote(null)}
      />
    </div>
  )
}
