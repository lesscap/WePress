import { cn } from '@/lib/utils'
import type { Section } from '@/types/editor'
import { Marked } from '@/components/marked'

type SectionBlockProps = {
  section: Section
  index: number
  isSelected: boolean
  onSelect: () => void
}

export function SectionBlock({ section, index, isSelected, onSelect }: SectionBlockProps) {
  const HeadingTag = `h${section.level}` as const

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering page-level click
    onSelect()
  }

  return (
    <div
      className={cn(
        'group rounded-lg border p-4 transition-all cursor-pointer',
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
      )}
      onClick={handleClick}
    >
      <div className="mb-3">
        <label className="mb-1 block text-xs font-medium text-gray-500">标题 (H{section.level})</label>
        <HeadingTag
          className={cn(
            'font-medium',
            section.level === 1 && 'text-2xl',
            section.level === 2 && 'text-xl',
            section.level === 3 && 'text-lg',
            section.level >= 4 && 'text-base',
          )}
        >
          {section.title}
        </HeadingTag>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">正文</label>
        <div className="prose prose-sm max-w-none">
          <Marked content={section.body} />
        </div>
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
