import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { Section } from '@/types/editor'
import { Marked } from '@/components/marked'
import { parseMarkdownToSections, sectionToMarkdown, type ParseResult } from '@/utils/markdown-parser'

type SectionBlockProps = {
  section: Section
  index: number
  isSelected: boolean
  onSelect: () => void
  onUpdate: (result: ParseResult) => void
}

export function SectionBlock({ section, index, isSelected, onSelect, onUpdate }: SectionBlockProps) {
  const [editMarkdown, setEditMarkdown] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const HeadingTag = `h${section.level}` as const

  useEffect(() => {
    if (isSelected) {
      setEditMarkdown(sectionToMarkdown(section))
      setTimeout(() => textareaRef.current?.focus(), 0)
    }
  }, [isSelected, section])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect()
  }

  const handleBlur = () => {
    const result = parseMarkdownToSections(editMarkdown)
    onUpdate(result)
  }

  if (isSelected) {
    return (
      <div className="rounded-lg border border-blue-500 bg-blue-50 p-4" onClick={e => e.stopPropagation()}>
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

  return (
    <div
      className={cn(
        'group rounded-lg border p-4 transition-all cursor-pointer',
        'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
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
          <label className="mb-2 block text-xs font-medium text-gray-500">配图</label>
          <div className="flex justify-center">
            <img
              src={section.image}
              alt={section.title}
              className="max-w-full h-auto rounded-lg shadow-sm"
            />
          </div>
        </div>
      )}
    </div>
  )
}
