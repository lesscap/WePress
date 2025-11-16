import type { AgentMessage } from '@wepress/agent-query'

type UsageMessageProps = {
  message: AgentMessage & { type: 'usage' }
}

const formatTokens = (count?: number): string => {
  if (!count) return '0'
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

export function UsageMessage({ message }: UsageMessageProps) {
  return (
    <div className="mb-3 px-3">
      <div className="text-xs text-gray-500">
        Token: 输入 {formatTokens(message.content.promptTokens)} + 输出{' '}
        {formatTokens(message.content.completionTokens)} = 总计{' '}
        {formatTokens(message.content.totalTokens)}
      </div>
    </div>
  )
}
