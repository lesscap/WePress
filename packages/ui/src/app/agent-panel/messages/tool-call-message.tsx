import { useState } from 'react'
import type { AgentMessage } from '@wepress/agent-query'
import { ChevronDown, ChevronRight } from 'lucide-react'

type ToolCallMessageProps = {
  toolCall: AgentMessage & { type: 'tool_call' }
  toolResult?: AgentMessage & { type: 'tool_result' }
}

export function ToolCallMessage({ toolCall, toolResult }: ToolCallMessageProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const hasError = toolResult?.content.error
  const hasResult = toolResult?.content.result

  return (
    <div className="mb-2 mx-3">
      <div
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1.5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
        )}
        <span className="text-xs text-gray-500">🔧</span>
        <span className="text-xs font-medium text-gray-700">{toolCall.content.name}</span>
        {toolResult && (
          <span className="text-xs">{hasError ? '❌' : '✅'}</span>
        )}
      </div>

      {isExpanded && (
        <div className="ml-6 mt-2 space-y-2 text-xs">
          {/* Arguments */}
          <div>
            <div className="text-gray-500 mb-1">参数：</div>
            <pre className="bg-gray-50 border border-gray-200 rounded p-2 overflow-x-auto text-xs">
              {JSON.stringify(toolCall.content.arguments, null, 2)}
            </pre>
          </div>

          {/* Result or Error */}
          {toolResult && (
            <div>
              <div className="text-gray-500 mb-1">{hasError ? '错误：' : '结果：'}</div>
              <pre
                className={`border rounded p-2 overflow-x-auto text-xs ${
                  hasError ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                }`}
              >
                {JSON.stringify(hasError || hasResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
