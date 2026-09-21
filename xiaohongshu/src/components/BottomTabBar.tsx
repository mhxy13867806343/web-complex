import { Tabbar, Toast } from '@nutui/nutui-react'
import { Cart, Home, Message, Plus, User } from '@nutui/icons-react'

export type TabKey = 'explore' | 'shop' | 'message' | 'me'

/** 底部 5 个位置，中间的「发布」不对应页面，点击时给一个提示 */
const ITEMS: { key: TabKey | 'publish'; title: string }[] = [
  { key: 'explore', title: '首页' },
  { key: 'shop', title: '购物' },
  { key: 'publish', title: '发布' },
  { key: 'message', title: '消息' },
  { key: 'me', title: '我' },
]

interface Props {
  value: TabKey
  onChange: (key: TabKey) => void
}

export default function BottomTabBar({ value, onChange }: Props) {
  const index = Math.max(
    0,
    ITEMS.findIndex((item) => item.key === value)
  )

  return (
    <Tabbar
      fixed={false}
      value={index}
      activeColor="#333333"
      inactiveColor="#b3b3b3"
      safeArea
      onSwitch={(v: number) => {
        const item = ITEMS[v]
        if (!item) return
        if (item.key === 'publish') {
          Toast.show({ content: '发布笔记（演示）', duration: 1.2 })
          return
        }
        onChange(item.key)
      }}
    >
      <Tabbar.Item title="首页" icon={<Home width={22} height={22} />} />
      <Tabbar.Item title="购物" icon={<Cart width={22} height={22} />} />
      <Tabbar.Item
        title="发布"
        icon={
          <span className="tabbar-plus">
            <Plus width={18} height={18} color="#ffffff" />
          </span>
        }
      />
      <Tabbar.Item title="消息" icon={<Message width={22} height={22} />} dot />
      <Tabbar.Item title="我" icon={<User width={22} height={22} />} />
    </Tabbar>
  )
}
