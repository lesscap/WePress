import type { EditorSelection } from '@/types/editor'

type ScopeIndicatorProps = {
  selection: EditorSelection
}

export function ScopeIndicator({ selection }: ScopeIndicatorProps) {
  const displayMap = {
    none: { icon: '📄', text: '文章' },
    section: {
      icon: '📝',
      text: selection.type === 'section'
        ? `第 ${selection.sectionIndex + 1} 段：${selection.sectionTitle}`
        : ''
    },
    text: {
      icon: '✏️',
      text: selection.type === 'text'
        ? `"${selection.selectedText}"`
        : ''
    }
  }

  const { icon, text } = displayMap[selection.type]

  return (
    <div className="border-b border-gray-200 px-3 py-2">
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <span>{icon}</span>
        <span>{text}</span>
      </div>
    </div>
  )
}
