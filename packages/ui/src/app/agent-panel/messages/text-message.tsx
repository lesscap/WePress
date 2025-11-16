import { useMemo } from 'react'
import type { AgentMessage } from '@wepress/agent-query'
import { Marked } from '@/components/marked'

type TextMessageProps = {
  messages: Array<AgentMessage & { type: 'text' }>
}

export function TextMessage({ messages }: TextMessageProps) {
  // Merge all text deltas into final content
  const fullText = useMemo(() => {
    return messages.map(m => m.content.text).join('')
  }, [messages])

  const displayText = useMemo(() => {
    const toolCallRegex = /<tool_call>[\s\S]*?<\/tool_call>/g

    // Wrap tool_call tags in code blocks for markdown rendering
    return fullText.replace(toolCallRegex, match => {
      return `\n\`\`\`xml\n${match}\n\`\`\`\n`
    })
  }, [fullText])

  if (!fullText.trim()) {
    return null
  }

  return (
    <div className="text-xs text-gray-700">
      <Marked content={displayText} />
    </div>
  )
}
