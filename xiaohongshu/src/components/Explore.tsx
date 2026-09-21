import { useMemo, useState } from 'react'
import { InfiniteLoading, SearchBar, Tabs, Toast, Empty } from '@nutui/nutui-react'
import { Photograph } from '@nutui/icons-react'
import { CHANNELS, NOTES, TOPICS, type Note } from '../mock/notes'
import NoteDetail from './NoteDetail'
import Waterfall from './Waterfall'

/** 关注页只展示这些作者的笔记 */
const FOLLOWED = new Set(['林小满', 'Yuki', '在路上的猫'])
const MAX_ROUND = 3

export default function Explore() {
  const [tab, setTab] = useState<string>('discover')
  const [channel, setChannel] = useState<string>('推荐')
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [collected, setCollected] = useState<Record<string, boolean>>({})
  const [openNote, setOpenNote] = useState<Note | null>(null)
  const [round, setRound] = useState(1)

  // 依据顶部主 tab 过滤数据源
  const base = useMemo(() => {
    if (tab === 'follow') return NOTES.filter((n) => FOLLOWED.has(n.author.name))
    if (tab === 'nearby') return NOTES.filter((n) => !!n.location)
    return NOTES
  }, [tab])

  // 再按细分频道过滤；「加载更多」时把当前列表复制追加一轮
  const list = useMemo(() => {
    const src = channel === '推荐' ? base : base.filter((n) => n.channel === channel)
    const out: Note[] = []
    for (let i = 0; i < round; i++) {
      src.forEach((n) => out.push(i === 0 ? n : { ...n, id: `${n.id}-r${i}` }))
    }
    return out
  }, [base, channel, round])

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
        setRound((r) => r + 1)
        resolve()
      }, 600)
    })

  const content = (
    <>
      <div className="chips">
        {CHANNELS.map((c) => (
          <span
            key={c}
            className={`chip${channel === c ? ' active' : ''}`}
            onClick={() => {
              setChannel(c)
              setRound(1)
            }}
          >
            {c}
          </span>
        ))}
      </div>

      {channel === '推荐' && (
        <div className="topics">
          {TOPICS.map((t) => (
            <div className="topic" key={t.id}>
              <span className="topic-emoji">{t.emoji}</span>
              <div>
                <div className="topic-name">{t.name}</div>
                <div className="topic-hot">{t.hot}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {list.length === 0 ? (
        <div className="empty-box">
          <Empty description="这个频道还没有内容" />
        </div>
      ) : (
        <Waterfall notes={list} liked={liked} onLike={toggleLike} onOpen={setOpenNote} />
      )}

      <InfiniteLoading
        hasMore={round < MAX_ROUND && list.length > 0}
        threshold={120}
        target=".page-body"
        loadingText="正在加载…"
        loadMoreText="没有更多内容了"
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
          setRound(1)
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
