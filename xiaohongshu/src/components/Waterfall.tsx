import { useMemo } from 'react'
import type { Note } from '../mock/notes'
import NoteCard from './NoteCard'

interface Props {
  notes: Note[]
  liked: Record<string, boolean>
  onLike: (note: Note) => void
  onOpen: (note: Note) => void
}

/**
 * 双列瀑布流
 * 按「累计高度最小优先」把笔记分配进两列，视觉上错落且两列高度接近。
 */
export default function Waterfall({ notes, liked, onLike, onOpen }: Props) {
  const columns = useMemo(() => {
    const cols: Note[][] = [[], []]
    const heights = [0, 0]
    notes.forEach((note) => {
      const target = heights[0] <= heights[1] ? 0 : 1
      cols[target].push(note)
      // 封面高度按 ratio 估算，文字区按固定 0.35 计
      heights[target] += note.ratio + 0.35
    })
    return cols
  }, [notes])

  return (
    <div className="waterfall">
      {columns.map((col, i) => (
        <div className="waterfall-col" key={i}>
          {col.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              liked={!!liked[note.id]}
              onLike={onLike}
              onOpen={onOpen}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
