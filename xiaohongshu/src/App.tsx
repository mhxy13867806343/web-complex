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
      <div className="page-body">
        <Explore />
      </div>
      <ToastHost />
    </div>
  )
}
