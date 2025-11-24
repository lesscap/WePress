import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { Section, EditorSelection } from '@/types/editor'
import type { ParseResult } from '@/utils/markdown-parser'
import { parseMarkdownToSections, sectionToMarkdown } from '@/utils/markdown-parser'
import { Marked } from '@/components/marked'
import { getIndent } from './indent'

type DetailViewProps = {
  sections: Section[]
  selection: EditorSelection
  onSelectionChange: (selection: EditorSelection) => void
  onSectionUpdate: (index: number, result: ParseResult) => void
}

export function DetailView({ sections, selection, onSelectionChange, onSectionUpdate }: DetailViewProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleClick = (index: number, section: Section) => {
    // Select this section for LLM operations
    onSelectionChange({
      type: 'section',
      sectionIndex: index,
      sectionId: section.id,
      sectionTitle: section.title,
    })
    // Enter edit mode
    setEditingIndex(index)
  }

  const handleEditDone = (index: number, result: ParseResult) => {
    onSectionUpdate(index, result)
    setEditingIndex(null)
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        const isSelected = selection.type === 'section' && selection.sectionIndex === index
        const isEditing = editingIndex === index

        return (
          <SectionItem
            key={section.id}
            section={section}
            isSelected={isSelected}
            isEditing={isEditing}
            onClick={() => handleClick(index, section)}
            onEditDone={result => handleEditDone(index, result)}
          />
        )
      })}
    </div>
  )
}

type SectionItemProps = {
  section: Section
  isSelected: boolean
  isEditing: boolean
  onClick: () => void
  onEditDone: (result: ParseResult) => void
}

function SectionItem({ section, isSelected, isEditing, onClick, onEditDone }: SectionItemProps) {
  const [editMarkdown, setEditMarkdown] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const HeadingTag = `h${section.level}` as const
  const indent = getIndent(section.level)

  useEffect(() => {
    if (isEditing) {
      setEditMarkdown(sectionToMarkdown(section))
      setTimeout(() => textareaRef.current?.focus(), 0)
    }
  }, [isEditing, section])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick()
  }

  const handleBlur = () => {
    const result = parseMarkdownToSections(editMarkdown)
    onEditDone(result)
  }

  // Edit mode
  if (isEditing) {
    return (
      <div className={cn('rounded-lg border border-blue-500 bg-blue-50 p-4', indent)} onClick={e => e.stopPropagation()}>
        <label className="mb-2 block text-xs font-medium text-gray-700">
          编辑段落 (Markdown) - 使用 # 标题可拆分为多段
        </label>
        <textarea
          ref={textareaRef}
          value={editMarkdown}
          onChange={e => setEditMarkdown(e.target.value)}
          onBlur={handleBlur}
          rows={12}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm font-mono bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
          placeholder="## 标题&#10;&#10;正文内容..."
        />
      </div>
    )
  }

  // Display mode (with selection highlight)
  return (
    <div
      className={cn(
        'group rounded-lg border p-4 transition-all cursor-pointer',
        isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
        indent,
      )}
      onClick={handleClick}
    >
      <HeadingTag
        className={cn(
          'font-medium mb-3',
          section.level === 1 && 'text-2xl',
          section.level === 2 && 'text-xl',
          section.level === 3 && 'text-lg',
          section.level >= 4 && 'text-base',
        )}
      >
        {section.title}
      </HeadingTag>
      <div className="prose prose-sm max-w-none">
        <Marked content={section.body} />
      </div>
      {section.image && (
        <div className="mt-4">
          <div className="flex justify-center">
            <img src={section.image} alt={section.title} className="max-w-full h-auto rounded-lg shadow-sm" />
          </div>
        </div>
      )}
    </div>
  )
}
