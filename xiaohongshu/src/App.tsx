import Explore from './components/Explore'
import { ToastHost } from './components/Toast'

/**
 * 只做小红书「发现」页。
 * 首页 / 购物 / 消息 / 我的这四条都需要登录态才有真实数据，
 * 与其摆假数据占位，不如直接不做。
 */
export default function App() {
  return (
    <div className="phone">
      {/* 注意：这个 id 是必需的 —— NutUI 的 InfiniteLoading 用 document.getElementById(target) 找滚动容器，
          传类名选择器（'.page-body'）会找不到，它会静默回退到 window，导致上拉加载永远不触发。 */}
      <div className="page-body" id="page-body">
        <Explore />
      </div>
      <ToastHost />
    </div>
  )
}
