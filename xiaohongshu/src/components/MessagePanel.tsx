import { Toast } from '@nutui/nutui-react'
import { Service } from '@nutui/icons-react'

const CHATS = [
  { name: '赞和收藏', emoji: '❤️', bg: '#ffdfe5', preview: '阿橙 赞了你的笔记', time: '刚刚', unread: 12 },
  { name: '新增关注', emoji: '👋', bg: '#d9e8ff', preview: '在路上的猫 关注了你', time: '10:24', unread: 3 },
  { name: '评论和回复', emoji: '💬', bg: '#ffe6c7', preview: '拿铁不加冰：求个链接！', time: '昨天', unread: 0 },
  { name: '薯队长', emoji: '🍠', bg: '#ffe0e0', preview: '你的笔记已被推荐到发现页', time: '周一', unread: 1 },
  { name: '系统通知', emoji: '🔔', bg: '#e5e0ff', preview: '社区规范更新提醒', time: '上周', unread: 0 },
]

export default function MessagePanel() {
  return (
    <div>
      <div className="simple-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>消息</span>
        <Service width={20} height={20} />
      </div>

      {CHATS.map((c) => (
        <div
          className="msg-item"
          key={c.name}
          onClick={() => Toast.show({ content: `打开「${c.name}」（演示）`, duration: 1.2 })}
        >
          <span className="msg-avatar" style={{ background: c.bg }}>
            {c.emoji}
          </span>
          <div className="msg-main">
            <div className="msg-name">{c.name}</div>
            <div className="msg-preview">{c.preview}</div>
          </div>
          <div className="msg-right">
            <div className="msg-time">{c.time}</div>
            {c.unread > 0 && <span className="badge-dot">{c.unread}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
