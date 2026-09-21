import { useState } from 'react'
import { Popup, Toast } from '@nutui/nutui-react'
import { ArrowLeft, Heart, HeartFill, Share, Star, StarFill } from '@nutui/icons-react'
import type { Note } from '../data'

interface Props {
  note: Note | null
  liked: boolean
  collected: boolean
  onLike: (note: Note) => void
  onCollect: (note: Note) => void
  onClose: () => void
}

/**
 * 笔记详情
 * 封面 / 标题 / 作者 / 点赞数均为真实数据；
 * 正文与评论需要登录态才能抓到，这里如实提示并给出原站链接。
 */
export default function NoteDetail({
  note,
  liked,
  collected,
  onLike,
  onCollect,
  onClose,
}: Props) {
  const [coverBroken, setCoverBroken] = useState(false)
  const [avatarBroken, setAvatarBroken] = useState(false)

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
            <div className="detail-cover">
              {coverBroken ? (
                <div className="detail-cover-fallback">
                  <span>🍠</span>
                  <em>封面加载失败</em>
                </div>
              ) : (
                <img
                  className="detail-cover-img"
                  src={note.cover}
                  alt={note.title}
                  referrerPolicy="no-referrer"
                  onError={() => setCoverBroken(true)}
                />
              )}
            </div>

            <div className="detail-body">
              <h2 className="detail-title">{note.title}</h2>

              <div className="detail-tags">
                <span className="detail-tag">{note.type === 'video' ? '视频笔记' : '图文笔记'}</span>
                <span className="detail-tag">❤️ {note.likes} 赞</span>
              </div>

              <div className="detail-locked">
                <p>正文、话题标签与评论需要登录小红书账号后才能获取，这里不做伪造。</p>
                <a
                  className="btn-open"
                  href={note.noteUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => Toast.show({ content: '在原站打开该笔记', duration: 1.2 })}
                >
                  在小红书打开原笔记
                </a>
              </div>
            </div>

            <div className="detail-author">
              {avatarBroken || !note.author.avatar ? (
                <span className="avatar-emoji" style={{ background: '#f0f0f0' }}>
                  {note.author.name.slice(0, 1)}
                </span>
              ) : (
                <img
                  className="avatar-img avatar-img-lg"
                  src={note.author.avatar}
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarBroken(true)}
                />
              )}
              <span className="detail-author-name">{note.author.name}</span>
              <button className="btn-follow">关注</button>
            </div>
          </div>

          <div className="detail-bar">
            <span className="detail-input">说点什么…</span>
            <span
              className={`detail-action${liked ? ' on' : ''}`}
              onClick={() => onLike(note)}
            >
              {liked ? <HeartFill width={19} height={19} /> : <Heart width={19} height={19} />}
              {note.likes}
            </span>
            <span
              className={`detail-action${collected ? ' on' : ''}`}
              onClick={() => onCollect(note)}
            >
              {collected ? <StarFill width={19} height={19} /> : <Star width={19} height={19} />}
              收藏
            </span>
            <span
              className="detail-action"
              onClick={() => Toast.show({ content: '已复制原站链接', duration: 1.2 })}
            >
              <Share width={19} height={19} />
            </span>
          </div>
        </div>
      )}
    </Popup>
  )
}
