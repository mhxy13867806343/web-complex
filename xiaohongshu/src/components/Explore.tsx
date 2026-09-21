import { useState } from 'react'
import { Empty, InfiniteLoading, SearchBar, Tabs, Toast } from '@nutui/nutui-react'
import { Photograph, Tips } from '@nutui/icons-react'
import {
  CHANNEL_FEEDS,
  CHANNELS_FETCHED_AT,
  FETCHED_AT,
  NOTES,
  PAGE_SIZE,
  getChannelFeed,
  type Note,
} from '../data'
import NoteDetail from './NoteDetail'
import Waterfall from './Waterfall'

/** 未登录时不可用的页签（小红书需要账号登录态 + 定位权限） */
const LOGIN_REQUIRED_TABS = new Set(['follow', 'nearby'])

const RECOMMEND = '推荐'

/** 频道 chips：推荐 + 已抓到真实数据的频道 */
const CHIPS = [RECOMMEND, ...CHANNEL_FEEDS.map((c) => c.name)]

function formatTime(iso: string | null): string {
  if (!iso) return '未知时间'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '未知时间'
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

export default function Explore() {
  const [tab, setTab] = useState<string>('discover')
  const [channel, setChannel] = useState<string>(RECOMMEND)
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [collected, setCollected] = useState<Record<string, boolean>>({})
  const [openNote, setOpenNote] = useState<Note | null>(null)
  const [visible, setVisible] = useState(PAGE_SIZE)

  const lockedTab = LOGIN_REQUIRED_TABS.has(tab)
  const feed = channel === RECOMMEND ? null : getChannelFeed(channel)

  /** 当前流的数据：推荐流 or 频道流；频道没数据时为空 */
  const activeNotes: Note[] = feed ? feed.notes : channel === RECOMMEND ? NOTES : []

  const list = lockedTab ? [] : activeNotes.slice(0, visible)
  const hasMore = !lockedTab && visible < activeNotes.length

  const toggleLike = (note: Note) => {
    setLiked((prev) => ({ ...prev, [note.id]: !prev[note.id] }))
  }

  const toggleCollect = (note: Note) => {
    const next = !collected[note.id]
    setCollected((prev) => ({ ...prev, [note.id]: next }))
    Toast.show({ content: next ? '已收藏' : '已取消收藏', duration: 1.2 })
  }

  const loadMore = () =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        setVisible((v) => v + PAGE_SIZE)
        resolve()
      }, 500)
    })

  const lockedHint = (
    <div className="login-hint">
      <Tips width={26} height={26} color="#c8c8c8" />
      <b>「{tab === 'follow' ? '关注' : '附近'}」需要登录</b>
      <p>小红书「关注」与「附近」依赖账号登录态与定位权限，匿名访问拿不到数据，这里如实留空。</p>
    </div>
  )

  const banner =
    channel === RECOMMEND
      ? `共 ${NOTES.length} 条真实笔记 · 抓取自 xiaohongshu.com/explore · ${formatTime(FETCHED_AT)}`
      : `「${channel}」共 ${activeNotes.length} 条真实笔记 · 频道 id ${feed?.id ?? '—'} · ${formatTime(
          CHANNELS_FETCHED_AT
        )}`

  const content = (
    <>
      <div className="data-banner">
        <span className="dot" />
        {banner}
      </div>

      <div className="chips">
        {CHIPS.map((c) => (
          <span
            key={c}
            className={`chip${channel === c ? ' active' : ''}`}
            onClick={() => {
              setChannel(c)
              setVisible(PAGE_SIZE)
            }}
          >
            {c}
          </span>
        ))}
      </div>

      {lockedTab ? (
        lockedHint
      ) : list.length === 0 ? (
        <div className="empty-box">
          <Empty description="该频道暂无数据，执行 npm run fetch:notes 抓取" />
        </div>
      ) : (
        <Waterfall notes={list} liked={liked} onLike={toggleLike} onOpen={setOpenNote} />
      )}

      <InfiniteLoading
        hasMore={hasMore}
        threshold={120}
        target=".page-body"
        loadingText="正在加载…"
        loadMoreText="已经到底了"
        onLoadMore={loadMore}
      />
    </>
  )

  return (
    <div>
      <header className="xhs-header">
        <div className="xhs-logo">小红书</div>
        <SearchBar
          className="xhs-search"
          shape="round"
          placeholder="搜索小红书"
          onInputClick={() => Toast.show({ content: '搜索页（演示）', duration: 1.2 })}
        />
        <Photograph className="xhs-header-icon" width={22} height={22} />
      </header>

      <Tabs
        className="main-tabs"
        value={tab}
        activeType="line"
        activeColor="#333333"
        autoHeight
        onChange={(v) => {
          setTab(String(v))
          setVisible(PAGE_SIZE)
        }}
      >
        <Tabs.TabPane title="关注" value="follow">
          {content}
        </Tabs.TabPane>
        <Tabs.TabPane title="发现" value="discover">
          {content}
        </Tabs.TabPane>
        <Tabs.TabPane title="附近" value="nearby">
          {content}
        </Tabs.TabPane>
      </Tabs>

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
