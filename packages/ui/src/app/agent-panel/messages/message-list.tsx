import { useMemo } from 'react'
import type { AgentMessage } from '@wepress/agent-query'
import { TextMessage } from './text-message'
import { ToolCallMessage } from './tool-call-message'
import { ErrorMessage } from './error-message'

type MessageListProps = {
  messages: AgentMessage[]
}

export function MessageList({ messages }: MessageListProps) {
  // Group text messages by conversationId
  const textGroups = useMemo(() => {
    const groups = new Map<string, Array<AgentMessage & { type: 'text' }>>()
    messages.forEach(msg => {
      if (msg.type === 'text') {
        const id = msg.conversationId || 'default'
        if (!groups.has(id)) {
          groups.set(id, [])
        }
        groups.get(id)!.push(msg as AgentMessage & { type: 'text' })
      }
    })
    return groups
  }, [messages])

  // Pair tool_call with tool_result
  const toolPairs = useMemo(() => {
    const pairs: Array<{
      call: AgentMessage & { type: 'tool_call' }
      result?: AgentMessage & { type: 'tool_result' }
    }> = []

    messages.forEach(msg => {
      if (msg.type === 'tool_call') {
        const call = msg as AgentMessage & { type: 'tool_call' }
        const result = messages.find(
          m =>
            m.type === 'tool_result' &&
            (m as AgentMessage & { type: 'tool_result' }).content.toolCallId === call.content.toolCallId,
        ) as AgentMessage & { type: 'tool_result' } | undefined

        pairs.push({ call, result })
      }
    })

    return pairs
  }, [messages])

  // Get error messages
  const errors = useMemo(() => {
    return messages.filter(msg => msg.type === 'error') as Array<AgentMessage & { type: 'error' }>
  }, [messages])

  // Check for abort
  const hasAbort = useMemo(() => {
    return messages.some(msg => msg.type === 'abort')
  }, [messages])

  return (
    <div className="space-y-1">
      {/* Render text messages */}
      {Array.from(textGroups.values()).map((textMsgs, idx) => (
        <TextMessage key={`text-${idx}`} messages={textMsgs} />
      ))}

      {/* Render tool calls */}
      {toolPairs.map((pair, idx) => (
        <ToolCallMessage key={`tool-${idx}`} toolCall={pair.call} toolResult={pair.result} />
      ))}

      {/* Render errors */}
      {errors.map((error, idx) => (
        <ErrorMessage key={`error-${idx}`} message={error} />
      ))}

      {/* Render abort message */}
      {hasAbort && (
        <div className="mb-3 mx-3">
          <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600">
            ⛔ 任务已中止
          </div>
        </div>
      )}
    </div>
  )
}
