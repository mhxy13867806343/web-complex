import Explore from './components/Explore'
import UserPage from './components/UserPage'
import { ToastHost } from './components/Toast'
import { useRoute, navigate } from './router'

/**
 * 路由驱动的应用顶级入口：
 * 1. 发现页路由（/ 或 /?channel=...）渲染 Explore
 * 2. 用户主页路由（/user/profile/:userId 或 /user/:userId）渲染独立页面 UserPage
 */
export default function App() {
  const route = useRoute()

  return (
    <div className="phone">
      {/* 注意：这个 id 是必需的 —— NutUI 的 InfiniteLoading 用 document.getElementById(target) 找滚动容器，
          传类名选择器（'.page-body'）会找不到，它会静默回退到 window，导致上拉加载永远不触发。 */}
      {/* 发现页保持常驻挂载：避免查看博主主页返回后数据重置、二次加载或空状态闪烁 */}
      <div
        className="page-body"
        id="page-body"
        style={{ display: route.name === 'user' ? 'none' : 'block' }}
      >
        <Explore />
      </div>

      {route.name === 'user' && (
        <UserPage
          key={route.userId}
          userId={route.userId || ''}
          onBack={() => {
            if (window.history.length > 1) {
              window.history.back()
            } else {
              navigate('/')
            }
          }}
          onOpenNote={(note) => {
            navigate(`/?channel=推荐&note=${note.id}`)
          }}
        />
      )}
      <ToastHost />
    </div>
  )
}
