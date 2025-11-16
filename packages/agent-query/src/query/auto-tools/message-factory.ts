import { nanoid } from 'nanoid'
import type { AgentMessage, ToolCall } from '../../types'
import type { InternalToolResult } from '../tool-result-converter'

/**
 * Create tool call messages
 */
export function createToolCallMessages(toolCalls: ToolCall[], sessionId: string): AgentMessage[] {
  return toolCalls.map((call) => ({
    type: 'tool_call' as const,
    messageId: nanoid(),
    conversationId: sessionId,
    content: {
      toolCallId: call.toolCallId,
      name: call.name,
      arguments: call.arguments,
    },
    timestamp: new Date().toISOString(),
  }))
}

/**
 * Create tool result messages
 */
export function createToolResultMessages(toolResults: InternalToolResult[], sessionId: string): AgentMessage[] {
  return toolResults.map((result) => ({
    type: 'tool_result' as const,
    messageId: nanoid(),
    conversationId: sessionId,
    content: result,
    timestamp: new Date().toISOString(),
  }))
}
