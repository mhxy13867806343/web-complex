import { useState } from 'react'
import { Heart, HeartFill, Play } from '@nutui/icons-react'
import type { Note } from '../data'

interface Props {
  note: Note
  liked: boolean
  onLike: (note: Note) => void
  onOpen: (note: Note) => void
}

/** 笔记卡片：封面、点赞数、作者均来自真实抓取数据 */
export default function NoteCard({ note, liked, onLike, onOpen }: Props) {
  const [coverBroken, setCoverBroken] = useState(false)
  const [avatarBroken, setAvatarBroken] = useState(false)

  return (
    <div className="note-card" onClick={() => onOpen(note)}>
      <div
        className="note-cover"
        style={{ aspectRatio: `${note.coverWidth} / ${note.coverHeight}` }}
      >
        {coverBroken ? (
          <div className="note-cover-fallback">
            <span>🍠</span>
            <em>封面加载失败</em>
          </div>
        ) : (
          <img
            className="note-cover-img"
            src={note.cover}
            alt={note.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setCoverBroken(true)}
          />
        )}

        {note.type === 'video' && (
          <span className="note-cover-play">
            <Play width={12} height={12} color="#fff" />
          </span>
        )}
      </div>

      <div className="note-body">
        <div className="note-title ellipsis-2">{note.title}</div>
        <div className="note-meta">
          <span className="note-author">
            {avatarBroken || !note.author.avatar ? (
              <span className="avatar-emoji" style={{ background: '#f0f0f0' }}>
                {note.author.name.slice(0, 1)}
              </span>
            ) : (
              <img
                className="avatar-img"
                src={note.author.avatar}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => setAvatarBroken(true)}
              />
            )}
            <span className="note-author-name">{note.author.name}</span>
          </span>
          <span
            className={`note-like${liked ? ' on' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onLike(note)
            }}
          >
            {liked ? <HeartFill width={13} height={13} /> : <Heart width={13} height={13} />}
            {note.likes}
          </span>
        </div>
      </div>
    </div>
  )
}
