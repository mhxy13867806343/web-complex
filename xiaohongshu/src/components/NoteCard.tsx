import { Heart, HeartFill, Location, Play } from '@nutui/icons-react'
import type { Note } from '../mock/notes'

interface Props {
  note: Note
  liked: boolean
  onLike: (note: Note) => void
  onOpen: (note: Note) => void
}

/** 点赞/评论数格式化：超过一万显示「x.x 万」 */
export function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)} 万`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export default function NoteCard({ note, liked, onLike, onOpen }: Props) {
  const count = note.likes + (liked ? 1 : 0)

  return (
    <div className="note-card" onClick={() => onOpen(note)}>
      <div
        className="note-cover"
        style={{
          height: 0,
          paddingBottom: `${note.ratio * 100}%`,
          background: `linear-gradient(135deg, ${note.cover[0]}, ${note.cover[1]})`,
        }}
      >
        <span className="note-cover-emoji">{note.emoji}</span>

        {note.location && (
          <span className="note-cover-tag">
            <Location width={10} height={10} color="#fff" />
            {note.location}
          </span>
        )}

        {note.video && (
          <span className="note-cover-play">
            <Play width={12} height={12} color="#fff" />
          </span>
        )}
      </div>

      <div className="note-body">
        <div className="note-title ellipsis-2">{note.title}</div>
        <div className="note-meta">
          <span className="note-author">
            <span className="avatar-emoji" style={{ background: note.author.bg }}>
              {note.author.emoji}
            </span>
            <span className="note-author-name">{note.author.name}</span>
          </span>
          <span
            className={`note-like${liked ? ' on' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onLike(note)
            }}
          >
            {liked ? (
              <HeartFill width={13} height={13} />
            ) : (
              <Heart width={13} height={13} />
            )}
            {formatCount(count)}
          </span>
        </div>
      </div>
    </div>
  )
}
