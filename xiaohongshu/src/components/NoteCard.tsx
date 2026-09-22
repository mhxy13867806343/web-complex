import { useState } from 'react'
import { Heart, Play } from '@nutui/icons-react'
import type { Note } from '../data'

interface Props {
  note: Note
  onOpen: (note: Note) => void
  onOpenUser?: (author: Note['author'], note: Note) => void
}

/**
 * 笔记卡片：封面 + 标题 + 作者信息与点赞数展示（"likes": "787"）
 */
export default function NoteCard({ note, onOpen, onOpenUser }: Props) {
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
        <div className="note-footer">
          <div
            className="note-author"
            onClick={(e) => {
              e.stopPropagation()
              onOpenUser?.(note.author, note)
            }}
          >
            {avatarBroken || !note.author.avatar ? (
              <span className="note-avatar-fallback">{note.author.name.slice(0, 1)}</span>
            ) : (
              <img
                className="note-avatar"
                src={note.author.avatar}
                alt=""
                referrerPolicy="no-referrer"
                onError={() => setAvatarBroken(true)}
              />
            )}
            <span className="note-author-name">{note.author.name}</span>
          </div>
          <div className="note-likes">
            <Heart width={12} height={12} />
            <span className="note-likes-count">{note.likes || '0'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
