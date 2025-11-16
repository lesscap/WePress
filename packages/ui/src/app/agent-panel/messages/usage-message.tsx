import type { AgentMessage } from '@wepress/agent-query'

type UsageMessageProps = {
  message: AgentMessage & { type: 'usage' }
}

export function UsageMessage({ message }: UsageMessageProps) {
  // Usage messages are not rendered, they are accumulated in the parent component
  return null
}
