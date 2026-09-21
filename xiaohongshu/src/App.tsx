import { useState } from 'react'
import BottomTabBar, { type TabKey } from './components/BottomTabBar'
import Explore from './components/Explore'
import ShopPanel from './components/ShopPanel'
import MessagePanel from './components/MessagePanel'
import MePanel from './components/MePanel'

export default function App() {
  const [tab, setTab] = useState<TabKey>('explore')

  return (
    <div className="phone">
      <div className="page-body">
        {tab === 'explore' && <Explore />}
        {tab === 'shop' && <ShopPanel />}
        {tab === 'message' && <MessagePanel />}
        {tab === 'me' && <MePanel />}
      </div>
      <div className="tabbar-wrap">
        <BottomTabBar value={tab} onChange={setTab} />
      </div>
    </div>
  )
}
