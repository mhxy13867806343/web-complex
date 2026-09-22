import { useEffect, useState } from 'react'
import Explore from './components/Explore'
import UserPage from './components/UserPage'
import NoteDetail from './components/NoteDetail'
import SearchResult from './components/SearchResult'
import { ToastHost } from './components/Toast'
import { useRoute, navigate, openNoteRoute, openUserProfileRoute, getExploreUrl } from './router'

/**
 * 路由驱动的应用顶级入口：
 * 1. 发现页路由（/ 或 /?channel=...）渲染 Explore
 * 2. 用户主页路由（/user/profile/:userId 或 /user/:userId）渲染独立页面 UserPage
 * 3. 笔记详情路由（/explore/:noteId）渲染独立页面 NoteDetail
 * 4. 搜索结果路由（/search_result/?keyword=...）渲染独立页面 SearchResult
 */
export default function App() {
  const route = useRoute()
  const [searchMounted, setSearchMounted] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('vlog')

  useEffect(() => {
    if (route.name === 'search') {
      setSearchMounted(true)
      if (route.keyword) {
        setSearchKeyword(route.keyword)
      }
    } else if (route.name === 'home') {
      // 彻底返回首页时卸载搜索结果页
      setSearchMounted(false)
    }
  }, [route.name, route.keyword])

  return (
    <div className="phone">
      {/* 注意：这个 id 是必需的 —— NutUI 的 InfiniteLoading 用 document.getElementById(target) 找滚动容器，
          传类名选择器（'.page-body'）会找不到，它会静默回退到 window，导致上拉加载永远不触发。 */}
      {/* 发现页保持常驻挂载：避免查看博主主页或笔记详情返回后数据重置、二次加载或空状态闪烁 */}
      <div
        className="page-body"
        id="page-body"
        style={{
          display: 'block',
          visibility: route.name === 'home' ? 'visible' : 'hidden',
          pointerEvents: route.name === 'home' ? 'auto' : 'none',
        }}
      >
        <Explore />
      </div>

      {/* 搜索结果页同样保持常驻缓存：从搜索页进入博主主页或笔记详情时保持挂载，返回后分类Tab（如用户Tab）、子标签、已加载笔记和滚动位置完好如初 */}
      {searchMounted && (
        <div
          style={{
            display: 'block',
            visibility: route.name === 'search' ? 'visible' : 'hidden',
            pointerEvents: route.name === 'search' ? 'auto' : 'none',
          }}
        >
          <SearchResult
            keyword={searchKeyword}
            onBack={() => {
              if (window.history.length > 1) {
                window.history.back()
              } else {
                navigate(getExploreUrl())
              }
            }}
            onGoHome={() => {
              navigate(getExploreUrl())
            }}
            onOpenNote={(note) => {
              openNoteRoute(note.id)
            }}
            onOpenUser={(author) => {
              openUserProfileRoute(author)
            }}
          />
        </div>
      )}

      {route.name === 'user' && (
        <UserPage
          key={route.userId}
          userId={route.userId || ''}
          onBack={() => {
            if (window.history.length > 1) {
              window.history.back()
            } else {
              navigate(getExploreUrl())
            }
          }}
          onGoHome={() => {
            navigate(getExploreUrl())
          }}
          onOpenNote={(note) => {
            openNoteRoute(note.id)
          }}
        />
      )}

      {route.name === 'note' && (
        <NoteDetail
          key={route.noteId}
          noteId={route.noteId || ''}
          onClose={() => {
            if (window.history.length > 1) {
              window.history.back()
            } else {
              navigate(getExploreUrl())
            }
          }}
          onGoHome={() => {
            navigate(getExploreUrl())
          }}
          onOpenUser={(author) => {
            openUserProfileRoute(author)
          }}
        />
      )}
      <ToastHost />
    </div>
  )
}
