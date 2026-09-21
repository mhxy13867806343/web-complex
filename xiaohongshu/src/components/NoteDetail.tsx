import { useState } from 'react'
import { Popup } from '@nutui/nutui-react'
import { ArrowLeft, Star, StarFill } from '@nutui/icons-react'
import type { Note } from '../data'
import { Toast } from './Toast'

interface Props {
  note: Note | null
  collected: boolean
  onCollect: (note: Note) => void
  onClose: () => void
}

/**
 * 笔记详情
 * 封面 / 标题 / 作者 / 点赞数均为真实数据；
 * 正文与评论需要登录态才能抓到，这里如实提示并给出原站链接。
 */
export default function NoteDetail({ note, collected, onCollect, onClose }: Props) {
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
            {/* 点赞数、分享入口均已移除，只剩收藏 */}
            <span
              className={`detail-action${collected ? ' on' : ''}`}
              onClick={() => onCollect(note)}
            >
              {collected ? <StarFill width={19} height={19} /> : <Star width={19} height={19} />}
              收藏
            </span>
          </div>
        </div>
      )}
    </Popup>
  )
}
