import { useState } from 'react'
import { Play } from '@nutui/icons-react'
import type { Note } from '../data'

interface Props {
  note: Note
  onOpen: (note: Note) => void
}

/**
 * 笔记卡片：只保留封面 + 标题。
 * 底部的作者 / 点赞数那一行已按要求整体移除（不做点击、不展示计数）。
 */
export default function NoteCard({ note, onOpen }: Props) {
  const [coverBroken, setCoverBroken] = useState(false)

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
      </div>
    </div>
  )
}
