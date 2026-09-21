import { useMemo } from 'react'
import type { Note } from '../data'
import NoteCard from './NoteCard'

interface Props {
  notes: Note[]
  onOpen: (note: Note) => void
}

/**
 * 双列瀑布流
 * 用每条笔记真实的 coverWidth / coverHeight 估算列高，
 * 按「累计高度最小优先」分列，视觉错落且两列高度接近。
 */
export default function Waterfall({ notes, onOpen }: Props) {
  const columns = useMemo(() => {
    const cols: Note[][] = [[], []]
    const heights = [0, 0]
    notes.forEach((note) => {
      const target = heights[0] <= heights[1] ? 0 : 1
      cols[target].push(note)
      const ratio = note.coverWidth > 0 ? note.coverHeight / note.coverWidth : 1.33
      // 封面高度 + 文字区固定高度（约 0.35 个列宽）
      heights[target] += ratio + 0.35
    })
    return cols
  }, [notes])

  return (
    <div className="waterfall">
      {columns.map((col, i) => (
        <div className="waterfall-col" key={i}>
          {col.map((note) => (
            <NoteCard key={note.id} note={note} onOpen={onOpen} />
          ))}
        </div>
      ))}
    </div>
  )
}
