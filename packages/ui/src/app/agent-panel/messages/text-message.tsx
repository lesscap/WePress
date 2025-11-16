import { useMemo, useState } from 'react'
import type { AgentMessage } from '@wepress/agent-query'
import { Marked } from '@/components/marked'

type TextMessageProps = {
  messages: Array<AgentMessage & { type: 'text' }>
}

export function TextMessage({ messages }: TextMessageProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Merge all text deltas into final content
  const fullText = useMemo(() => {
    return messages.map(m => m.content.text).join('')
  }, [messages])

  const [displayText, isOnlyToolCall, preview] = useMemo(() => {
    const toolCallRegex = /<tool_call>[\s\S]*?<\/tool_call>/g

    // Wrap tool_call tags in code blocks for markdown rendering
    const displayText = fullText.replace(toolCallRegex, match => {
      return `\`\`\`\n${match}\n\`\`\``
    })

    // Check if text only contains tool_call tags (no other content)
    const onlyToolCall = !fullText.replace(toolCallRegex, '').trim()

    // Create preview for collapsed view
    const preview = onlyToolCall ? fullText.replace(/\n/g, ' ').substring(0, 100) : ''

    return [displayText, onlyToolCall, preview]
  }, [fullText])

  if (!fullText.trim()) {
    return null
  }

  // If only tool_call tags, show collapsed/expandable view
  if (isOnlyToolCall) {
    return (
      <div className="mb-3 px-3">
        <div className="flex items-start gap-2">
          <div className="text-sm font-medium text-gray-500 flex-shrink-0 mt-0.5">AI:</div>
          <div className="flex-1 text-sm">
            {isExpanded ? (
              <div className="cursor-pointer" onClick={() => setIsExpanded(false)}>
                <Marked content={displayText} />
              </div>
            ) : (
              <div
                className="text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => setIsExpanded(true)}
              >
                {preview}...
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Normal text with content
  return (
    <div className="mb-3 px-3">
      <div className="flex items-start gap-2">
        <div className="text-sm font-medium text-gray-500 flex-shrink-0 mt-0.5">AI:</div>
        <div className="flex-1 text-sm text-gray-700">
          <Marked content={displayText} />
        </div>
      </div>
    </div>
  )
}
