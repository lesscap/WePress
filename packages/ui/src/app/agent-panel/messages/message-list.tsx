import type { AgentMessage } from '@wepress/agent-query'
import { TextMessage } from './text-message'
import { ToolCallMessage } from './tool-call-message'
import { ToolResult } from './tool-result'
import { ErrorMessage } from './error-message'

type MessageListProps = {
  messages: AgentMessage[]
  toolResults: Record<string, AgentMessage & { type: 'tool_result' }>
  onToolResultUpdate: (toolCallId: string, result: AgentMessage & { type: 'tool_result' }) => void
}

export function MessageList({ messages, toolResults, onToolResultUpdate }: MessageListProps) {
  return (
    <>
      {messages.map(msg => {
        if (msg.type === 'text') {
          return <TextMessage key={msg.messageId} messages={[msg as AgentMessage & { type: 'text' }]} />
        }

        if (msg.type === 'tool_call') {
          const toolResult = toolResults[msg.content.toolCallId]
          return (
            <ToolCallMessage
              key={msg.messageId}
              toolCall={msg as AgentMessage & { type: 'tool_call' }}
              toolResult={toolResult}
            />
          )
        }

        if (msg.type === 'tool_result') {
          return <ToolResult key={msg.messageId} message={msg as AgentMessage & { type: 'tool_result' }} onUpdate={onToolResultUpdate} />
        }

        if (msg.type === 'error') {
          return <ErrorMessage key={msg.messageId} message={msg as AgentMessage & { type: 'error' }} />
        }

        if (msg.type === 'abort') {
          return (
            <div key={msg.messageId} className="mb-3 mx-3">
              <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600">
                ⛔ 任务已中止
              </div>
            </div>
          )
        }

        // todolist and usage are handled elsewhere
        if (msg.type === 'todolist' || msg.type === 'usage') {
          return null
        }

        return null
      })}
    </>
  )
}
