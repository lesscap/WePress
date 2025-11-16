import type { AgentMessage } from '@wepress/agent-query'
import { AlertCircle } from 'lucide-react'

type ErrorMessageProps = {
  message: AgentMessage & { type: 'error' }
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  const content = message.content as {
    error?: string
    code?: string
    details?: string
  }

  const errorText = content.error || '未知错误'

  return (
    <div className="mb-3 mx-3">
      <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-sm text-red-700 font-medium">{errorText}</div>
          {(content.code || content.details) && (
            <div className="mt-1 text-xs text-red-600 space-y-0.5">
              {content.code && <div>错误代码: {content.code}</div>}
              {content.details && <div>详情: {content.details}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
