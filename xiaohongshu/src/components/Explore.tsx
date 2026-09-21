import { useMemo, useState } from 'react'
import { Empty, InfiniteLoading, SearchBar, Tabs, Toast } from '@nutui/nutui-react'
import { Photograph, Tips } from '@nutui/icons-react'
import { CHANNELS, FETCHED_AT, NOTES, PAGE_SIZE, type Note } from '../data'
import NoteDetail from './NoteDetail'
import Waterfall from './Waterfall'

/** 未登录时不可用的页签 */
const LOGIN_REQUIRED_TABS = new Set(['follow', 'nearby'])

function formatTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '未知时间'
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

export default function Explore() {
  const [tab, setTab] = useState<string>('discover')
  const [channel, setChannel] = useState<string>('推荐')
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [collected, setCollected] = useState<Record<string, boolean>>({})
  const [openNote, setOpenNote] = useState<Note | null>(null)
  const [visible, setVisible] = useState(PAGE_SIZE)

  /** 频道切换需要登录态，匿名抓取只能拿到「推荐」流 */
  const channelLocked = channel !== '推荐'

  const list = useMemo(() => {
    if (LOGIN_REQUIRED_TABS.has(tab) || channelLocked) return []
    return NOTES.slice(0, visible)
  }, [tab, channelLocked, visible])

  const hasMore = !LOGIN_REQUIRED_TABS.has(tab) && !channelLocked && visible < NOTES.length

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

  const loginHint = (
    <div className="login-hint">
      <Tips width={26} height={26} color="#c8c8c8" />
      <b>{LOGIN_REQUIRED_TABS.has(tab) ? '该页签需要登录' : `「${channel}」频道需要登录`}</b>
      <p>
        {LOGIN_REQUIRED_TABS.has(tab)
          ? '小红书「关注」与「附近」依赖账号登录态与定位权限，匿名访问拿不到数据，这里如实留空。'
          : '小红书频道页（?channel_id=...）会对匿名请求 302 到登录页，所以频道内容抓不到。'}
      </p>
      <span className="login-hint-tip">
        若要看真实频道内容，可带登录 Cookie 重新抓取：
        <code>XHS_COOKIE=&quot;...&quot; npm run fetch:notes</code>
      </span>
    </div>
  )

  const content = (
    <>
      <div className="data-banner">
        <span className="dot" />
        共 {NOTES.length} 条真实笔记 · 抓取自 xiaohongshu.com/explore · {formatTime(FETCHED_AT)}
      </div>

      <div className="chips">
        {CHANNELS.map((c) => (
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

      {LOGIN_REQUIRED_TABS.has(tab) || channelLocked ? (
        loginHint
      ) : list.length === 0 ? (
        <div className="empty-box">
          <Empty description="没有内容" />
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
