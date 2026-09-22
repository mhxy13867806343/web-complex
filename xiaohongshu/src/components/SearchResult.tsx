import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, Home, Loading } from '@nutui/icons-react'
import type { Note } from '../data'
import { fetchSearchResultsApi, type SearchResultData } from '../data/api'
import Waterfall from './Waterfall'
import { openSearchResultRoute } from '../router'

interface Props {
  keyword: string
  onBack: () => void
  onGoHome: () => void
  onOpenNote: (note: Note) => void
  onOpenUser: (author: any) => void
}

type MainTab = 'all' | 'image' | 'video' | 'user'

export default function SearchResult({
  keyword,
  onBack,
  onGoHome,
  onOpenNote,
  onOpenUser,
}: Props) {
  const [keywordInput, setKeywordInput] = useState(keyword || 'vlog')
  const [currentKeyword, setCurrentKeyword] = useState(keyword || 'vlog')
  const [activeTab, setActiveTab] = useState<MainTab>('all')
  const [activeSubTag, setActiveSubTag] = useState('综合')
  const [showFilter, setShowFilter] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  // 筛选 5 大维度状态（完全对齐图 3）
  const [sort, setSort] = useState('general') // 'general' | 'latest' | 'most_likes' | 'most_comments' | 'most_collected'
  const [noteType, setNoteType] = useState('all') // 'all' | 'video' | 'image'
  const [timeRange, setTimeRange] = useState('all') // 'all' | '1d' | '1w' | '6m'
  const [searchScope, setSearchScope] = useState('all') // 'all' | 'viewed' | 'not_viewed' | 'followed'
  const [distance, setDistance] = useState('all') // 'all' | 'city' | 'nearby'

  const [data, setData] = useState<SearchResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const abortRef = useRef<AbortController | null>(null)

  // 当外部传入的 keyword 变更时同步
  useEffect(() => {
    if (keyword && keyword !== currentKeyword) {
      setKeywordInput(keyword)
      setCurrentKeyword(keyword)
      setActiveSubTag('综合')
    }
  }, [keyword])

  // 发起搜索拉取
  const loadSearch = useCallback(
    async (kw: string, currentSubTag = activeSubTag, currentSort = sort, currentType = noteType) => {
      abortRef.current?.abort()
      const ac = new AbortController()
      abortRef.current = ac
      setLoading(true)
      try {
        const res = await fetchSearchResultsApi(
          kw,
          {
            sort: currentSort,
            noteType: currentType,
            subTag: currentSubTag,
          },
          ac.signal
        )
        setData(res)
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setData(null)
        }
      } finally {
        setLoading(false)
      }
    },
    [activeSubTag, sort, noteType]
  )

  useEffect(() => {
    void loadSearch(currentKeyword, activeSubTag, sort, noteType)
    return () => {
      abortRef.current?.abort()
    }
  }, [currentKeyword, activeSubTag, sort, noteType, loadSearch])

  // 执行搜索
  const doSearch = (newKw?: string) => {
    const targetKw = (newKw ?? keywordInput).trim()
    if (!targetKw) return
    setCurrentKeyword(targetKw)
    setActiveSubTag('综合')
    openSearchResultRoute(targetKw)
  }

  // 顶部四大分类切换
  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab)
    if (tab === 'video') {
      setNoteType('video')
    } else if (tab === 'image') {
      setNoteType('image')
    } else {
      setNoteType('all')
    }
  }

  // 重置筛选
  const handleResetFilters = () => {
    setSort('general')
    setNoteType(activeTab === 'video' ? 'video' : activeTab === 'image' ? 'image' : 'all')
    setTimeRange('all')
    setSearchScope('all')
    setDistance('all')
    setActiveSubTag('综合')
  }

  // 退出动画
  const handleBack = () => {
    if (isClosing) return
    setIsClosing(true)
    setTimeout(() => {
      onBack()
    }, 220)
  }

  const handleGoHome = () => {
    if (isClosing) return
    setIsClosing(true)
    setTimeout(() => {
      onGoHome()
    }, 200)
  }

  const notesList = data?.notes || []
  const subTagsList = data?.subTags || [
    '综合',
    '西安',
    '日常生活',
    '杭州',
    '上学日记',
    '南京',
    '长沙',
    '治愈系',
    '新加坡',
    '打工人',
    '青岛',
    '马来西亚',
  ]

  return (
    <div className={`search-page-container ${isClosing ? 'is-closing' : ''}`}>
      {/* 顶部搜索栏 */}
      <div className="search-page-header">
        <button
          type="button"
          className="search-nav-btn"
          onClick={handleBack}
          title="返回上一页"
          aria-label="返回上一页"
        >
          <ArrowLeft width={20} height={20} />
        </button>

        <div className="search-input-wrap">
          <input
            type="text"
            className="search-input-field"
            value={keywordInput}
            placeholder="搜索小红书笔记"
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                doSearch()
              }
            }}
          />
          {keywordInput && (
            <button
              type="button"
              className="search-input-clear"
              onClick={() => {
                setKeywordInput('')
              }}
              title="清空"
              aria-label="清空输入"
            >
              ✕
            </button>
          )}
          <button
            type="button"
            className="search-input-submit"
            onClick={() => doSearch()}
            title="搜索"
            aria-label="搜索"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="search-nav-btn"
          onClick={handleGoHome}
          title="返回首页"
          aria-label="返回首页"
        >
          <Home width={18} height={18} />
        </button>
      </div>

      {/* 主类型导航与筛选开关（图 2） */}
      <div className="search-sub-nav">
        <div className="search-type-tabs">
          <button
            type="button"
            className={`search-tab-item ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            全部
          </button>
          <button
            type="button"
            className={`search-tab-item ${activeTab === 'image' ? 'active' : ''}`}
            onClick={() => handleTabChange('image')}
          >
            图文
          </button>
          <button
            type="button"
            className={`search-tab-item ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => handleTabChange('video')}
          >
            视频
          </button>
          <button
            type="button"
            className={`search-tab-item ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => handleTabChange('user')}
          >
            用户
          </button>
        </div>

        <button
          type="button"
          className={`search-filter-toggle ${showFilter ? 'open' : ''}`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          <span>筛选</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: showFilter ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s',
            }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      {/* 二级横向热词选择条（图 2） */}
      <div className="search-subtags-bar">
        <div className="search-subtags-scroll">
          {subTagsList.map((st) => (
            <button
              key={st}
              type="button"
              className={`search-subtag-chip ${activeSubTag === st ? 'active' : ''}`}
              onClick={() => {
                setActiveSubTag(st)
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 筛选多维浮层（完全对应图 3） */}
      {showFilter && (
        <div className="search-filter-backdrop" onClick={() => setShowFilter(false)}>
          <div className="search-filter-panel" onClick={(e) => e.stopPropagation()}>
            {/* 1. 排序依据 */}
            <div className="filter-group">
              <div className="filter-group-title">排序依据</div>
              <div className="filter-options-grid">
                {[
                  { id: 'general', label: '综合' },
                  { id: 'latest', label: '最新' },
                  { id: 'most_likes', label: '最多点赞' },
                  { id: 'most_comments', label: '最多评论' },
                  { id: 'most_collected', label: '最多收藏' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`filter-btn ${sort === opt.id ? 'active' : ''}`}
                    onClick={() => setSort(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. 笔记类型 */}
            <div className="filter-group">
              <div className="filter-group-title">笔记类型</div>
              <div className="filter-options-grid col-3">
                {[
                  { id: 'all', label: '不限' },
                  { id: 'video', label: '视频' },
                  { id: 'image', label: '图文' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`filter-btn ${noteType === opt.id ? 'active' : ''}`}
                    onClick={() => {
                      setNoteType(opt.id)
                      if (opt.id === 'video') setActiveTab('video')
                      else if (opt.id === 'image') setActiveTab('image')
                      else setActiveTab('all')
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. 发布时间 */}
            <div className="filter-group">
              <div className="filter-group-title">发布时间</div>
              <div className="filter-options-grid">
                {[
                  { id: 'all', label: '不限' },
                  { id: '1d', label: '一天内' },
                  { id: '1w', label: '一周内' },
                  { id: '6m', label: '半年内' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`filter-btn ${timeRange === opt.id ? 'active' : ''}`}
                    onClick={() => setTimeRange(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. 搜索范围 */}
            <div className="filter-group">
              <div className="filter-group-title">搜索范围</div>
              <div className="filter-options-grid">
                {[
                  { id: 'all', label: '不限' },
                  { id: 'viewed', label: '已看过' },
                  { id: 'not_viewed', label: '未看过' },
                  { id: 'followed', label: '已关注' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`filter-btn ${searchScope === opt.id ? 'active' : ''}`}
                    onClick={() => setSearchScope(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. 位置距离 */}
            <div className="filter-group">
              <div className="filter-group-title">位置距离</div>
              <div className="filter-options-grid col-3">
                {[
                  { id: 'all', label: '不限' },
                  { id: 'city', label: '同城' },
                  { id: 'nearby', label: '附近' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`filter-btn ${distance === opt.id ? 'active' : ''}`}
                    onClick={() => setDistance(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 底部重置与收起按钮（图 3） */}
            <div className="filter-footer-actions">
              <button
                type="button"
                className="filter-footer-btn filter-reset-btn"
                onClick={handleResetFilters}
              >
                <span>↺</span>
                <span>重置</span>
              </button>
              <button
                type="button"
                className="filter-footer-btn filter-close-btn"
                onClick={() => setShowFilter(false)}
              >
                <span>∧</span>
                <span>收起</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 搜索结果内容区 */}
      <div className="search-result-body">
        {loading ? (
          <div className="search-loading-box">
            <Loading>正在搜索相关笔记…</Loading>
          </div>
        ) : activeTab === 'user' ? (
          <div className="search-user-list">
            {notesList.slice(0, 6).map((n) => (
              <div
                key={n.id}
                className="search-user-card"
                onClick={() => onOpenUser(n.author)}
              >
                <img
                  src={n.author.avatar || 'https://sns-avatar-qc.xhscdn.com/avatar/6054fe950000000005774a42.jpg'}
                  alt={n.author.name}
                  className="search-user-avatar"
                />
                <div className="search-user-info">
                  <div className="search-user-name">{n.author.name}</div>
                  <div className="search-user-sub">小红书号：{n.author.userId?.slice(0, 8) || 'red_creator'} · 笔记 {Math.floor(10 + Math.random() * 40)}</div>
                </div>
                <button
                  type="button"
                  className="search-user-follow"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  关注
                </button>
              </div>
            ))}
          </div>
        ) : notesList.length === 0 ? (
          <div className="search-empty-box">
            <div className="search-empty-icon">🔍</div>
            <div className="search-empty-text">未找到与“{currentKeyword}”相关的笔记</div>
            <div className="search-empty-tip">试试搜索其他关键词或精简筛选条件</div>
          </div>
        ) : (
          <div className="search-waterfall-wrap">
            <Waterfall
              notes={notesList}
              onOpen={onOpenNote}
              onOpenUser={(author) => onOpenUser(author)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
