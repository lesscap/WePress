import { useMemo } from 'react'
import type { AgentMessage } from '@wepress/agent-query'
import { Marked } from '@/components/Marked'

type TextMessageProps = {
  messages: Array<AgentMessage & { type: 'text' }>
}

export function TextMessage({ messages }: TextMessageProps) {
  // Merge all text deltas into final content
  const content = useMemo(() => {
    return messages.map(m => m.content.text).join('')
  }, [messages])

  if (!content.trim()) {
    return null
  }

  return (
    <div className="mb-3 px-3">
      <div className="flex items-start gap-2">
        <div className="text-sm font-medium text-gray-500 flex-shrink-0 mt-0.5">AI:</div>
        <div className="flex-1 text-sm text-gray-700">
          <Marked content={content} />
        </div>
      </div>
    </div>
  )
}
