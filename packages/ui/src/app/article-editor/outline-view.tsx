import { useState } from 'react'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Section, EditorSelection } from '@/types/editor'
import { getIndent } from './indent'

type OutlineViewProps = {
  sections: Section[]
  selection: EditorSelection
  onSelectionChange: (selection: EditorSelection) => void
  onMoveSection: (fromIndex: number, toIndex: number) => void
}

export function OutlineView({ sections, selection, onSelectionChange, onMoveSection }: OutlineViewProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== index) {
      setDropIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDropIndex(null)
  }

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== toIndex) {
      onMoveSection(dragIndex, toIndex)
    }
    setDragIndex(null)
    setDropIndex(null)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setDropIndex(null)
  }

  const handleClick = (index: number, section: Section) => {
    onSelectionChange({
      type: 'section',
      sectionIndex: index,
      sectionId: section.id,
      sectionTitle: section.title,
    })
  }

  return (
    <div className="space-y-0.5">
      {sections.map((section, index) => {
        const isSelected = selection.type === 'section' && selection.sectionIndex === index
        const isDragging = dragIndex === index
        const isDropTarget = dropIndex === index

        return (
          <div
            key={section.id}
            draggable
            onDragStart={e => handleDragStart(e, index)}
            onDragOver={e => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onClick={() => handleClick(index, section)}
            className={cn(
              'group flex items-center gap-1 py-1.5 px-2 rounded cursor-pointer transition-all',
              getIndent(section.level),
              isSelected && 'bg-blue-100 text-blue-800',
              !isSelected && 'hover:bg-gray-100',
              isDragging && 'opacity-50',
              isDropTarget && 'border-t-2 border-blue-500',
            )}
          >
            <GripVertical className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 cursor-grab flex-shrink-0" />
            <span
              className={cn(
                'truncate',
                section.level === 1 && 'font-semibold',
                section.level === 2 && 'font-medium',
                section.level >= 3 && 'text-gray-600',
              )}
            >
              {section.title}
            </span>
          </div>
        )
      })}
    </div>
  )
}
