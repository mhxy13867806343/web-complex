import { Tabbar } from '@nutui/nutui-react'
import { getExploreUrl, navigate, type RouteInfo } from '../router'

const TABS = [
  { name: 'home' as const, title: '发现', path: '/' },
  { name: 'video' as const, title: 'RED', path: '/red_video' },
]

function TabIcon({ kind, active }: { kind: 'home' | 'video'; active: boolean }) {
  const color = active ? '#ff2442' : '#999'
  if (kind === 'home') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    )
  }
  if (kind === 'video') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="3" stroke={color} strokeWidth="1.8" />
        <path d="M10 9.5v5l4.5-2.5L10 9.5Z" fill={color} />
      </svg>
    )
  }
  return null
}

export default function BottomTabBar({ routeName }: { routeName: RouteInfo['name'] }) {
  const active = Math.max(0, TABS.findIndex((tab) => tab.name === routeName))

  return (
    <Tabbar
      className="app-tabbar"
      value={active}
      activeColor="#ff2442"
      inactiveColor="#999999"
      fixed={false}
      safeArea
      onSwitch={(index) => {
        const tab = TABS[index]
        if (!tab || tab.name === routeName) return
        navigate(tab.name === 'home' ? getExploreUrl() : tab.path)
      }}
    >
      {TABS.map((tab) => (
        <Tabbar.Item
          key={tab.name}
          title={tab.title}
          icon={(on) => <TabIcon kind={tab.name} active={on} />}
        />
      ))}
    </Tabbar>
  )
}
