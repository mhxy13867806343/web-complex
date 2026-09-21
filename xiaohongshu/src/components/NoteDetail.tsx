import { Popup, Toast } from '@nutui/nutui-react'
import { ArrowLeft, Comment, Heart, HeartFill, Share, Star, StarFill } from '@nutui/icons-react'
import type { Note } from '../mock/notes'

const FAKE_COMMENTS = [
  { name: '阿橘', emoji: '🍊', bg: '#ffe0b0', text: '太实用了！已经收藏，周末就去试～' },
  { name: '小鹿不迷路', emoji: '🦌', bg: '#c8e6d0', text: '求个链接，找了好久同款！' },
  { name: '拿铁不加冰', emoji: '☕️', bg: '#e8d8f0', text: '第三点说到我心里去了，感谢分享' },
]

interface Props {
  note: Note | null
  liked: boolean
  collected: boolean
  onLike: (note: Note) => void
  onCollect: (note: Note) => void
  onClose: () => void
}

/** 笔记详情：底部弹出式全屏页 */
export default function NoteDetail({
  note,
  liked,
  collected,
  onLike,
  onCollect,
  onClose,
}: Props) {
  return (
    <Popup
      visible={!!note}
      position="bottom"
      round
      closeable
      closeIconPosition="top-left"
      closeIcon={<ArrowLeft width={20} height={20} />}
      style={{ height: '92%' }}
      onClose={onClose}
    >
      {note && (
        <div className="detail">
          <div className="detail-scroll">
            <div
              className="detail-cover"
              style={{
                background: `linear-gradient(135deg, ${note.cover[0]}, ${note.cover[1]})`,
              }}
            >
              <span className="detail-cover-emoji">{note.emoji}</span>
            </div>

            <div className="detail-body">
              <h2 className="detail-title">{note.title}</h2>
              <p className="detail-desc">{note.desc}</p>
              <div className="detail-tags">
                <span className="detail-tag">#{note.channel}</span>
                <span className="detail-tag">#生活记录</span>
                {note.location && <span className="detail-tag">#{note.location}</span>}
              </div>
            </div>

            <div className="detail-author">
              <span className="avatar-emoji" style={{ background: note.author.bg }}>
                {note.author.emoji}
              </span>
              <span className="detail-author-name">{note.author.name}</span>
              <button className="btn-follow">关注</button>
            </div>

            <div className="detail-comments">
              <h4>共 {note.comments} 条评论</h4>
              {FAKE_COMMENTS.map((c) => (
                <div className="comment" key={c.name}>
                  <span className="avatar-emoji" style={{ background: c.bg }}>
                    {c.emoji}
                  </span>
                  <div className="comment-main">
                    <div className="comment-name">{c.name}</div>
                    <div className="comment-text">{c.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-bar">
            <span className="detail-input">说点什么…</span>
            <span
              className={`detail-action${liked ? ' on' : ''}`}
              onClick={() => onLike(note)}
            >
              {liked ? <HeartFill width={19} height={19} /> : <Heart width={19} height={19} />}
              {note.likes + (liked ? 1 : 0)}
            </span>
            <span
              className={`detail-action${collected ? ' on' : ''}`}
              onClick={() => onCollect(note)}
            >
              {collected ? <StarFill width={19} height={19} /> : <Star width={19} height={19} />}
              {note.likes > 2000 ? '1.2k' : '收藏'}
            </span>
            <span
              className="detail-action"
              onClick={() => Toast.show({ content: '已复制链接（演示）', duration: 1.2 })}
            >
              <Comment width={19} height={19} />
              {note.comments}
            </span>
            <span
              className="detail-action"
              onClick={() => Toast.show({ content: '分享面板（演示）', duration: 1.2 })}
            >
              <Share width={19} height={19} />
            </span>
          </div>
        </div>
      )}
    </Popup>
  )
}
