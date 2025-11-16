import type { EditorSelection } from '@/types/editor'

type StatusBarProps = {
  selection: EditorSelection
  totalTokens: number
  isActive: boolean
}

export function StatusBar({ selection, totalTokens, isActive }: StatusBarProps) {
  const displayMap = {
    none: { icon: '📄', text: '全文' },
    section: {
      icon: '📝',
      text: selection.type === 'section' ? `第 ${selection.sectionIndex + 1} 段：${selection.sectionTitle}` : '',
    },
    text: {
      icon: '✏️',
      text: selection.type === 'text' ? `"${selection.selectedText}"` : '',
    },
  }

  const { icon, text } = displayMap[selection.type]

  const formatTokens = (tokens: number): string => {
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(2)}K`
    }
    return tokens.toString()
  }

  return (
    <div className="border-t border-gray-200 px-3 py-1.5 bg-gray-50">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-gray-600">
          <span>{icon}</span>
          <span>{text}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-500">💰 {formatTokens(totalTokens)}</span>
          <span className={isActive ? 'text-blue-600' : 'text-gray-400'}>{isActive ? '⚡ Active' : '⚡ Idle'}</span>
        </div>
      </div>
    </div>
  )
}
