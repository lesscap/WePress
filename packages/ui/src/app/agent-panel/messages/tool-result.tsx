import { useRef, useEffect } from 'react'
import type { AgentMessage } from '@wepress/agent-query'

type ToolResultProps = {
  message: AgentMessage & { type: 'tool_result' }
  onUpdate: (toolCallId: string, result: AgentMessage & { type: 'tool_result' }) => void
}

export function ToolResult({ message, onUpdate }: ToolResultProps) {
  const onUpdateRef = useRef(onUpdate)
  onUpdateRef.current = onUpdate

  useEffect(() => {
    onUpdateRef.current(message.content.toolCallId, message)
  }, [message])

  return null
}
