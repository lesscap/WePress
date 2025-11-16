import { nanoid } from 'nanoid'
import type { ToolCallMessage } from '../types'

/**
 * Parse tool calls from text with <tool_call> tags
 * Supports multiple calls and handles unclosed tags
 */
export function parseToolCallsFromText(text: string, conversationId: string): ToolCallMessage[] {
  const TOOL_CALL_REGEX = /<tool_call>\s*(\{[\s\S]*?\})\s*(?:<\/tool_call>|$)/g
  const messages: ToolCallMessage[] = []
  let match: RegExpExecArray | null

  while ((match = TOOL_CALL_REGEX.exec(text)) !== null) {
    try {
      const json = JSON.parse(match[1])

      if (!json.name) {
        console.warn('Invalid tool call: missing name', match[1])
        continue
      }

      messages.push({
        type: 'tool_call',
        messageId: nanoid(),
        conversationId,
        content: {
          toolCallId: nanoid(),
          name: json.name,
          arguments: json.arguments || {},
        },
        timestamp: new Date().toISOString(),
      })
    } catch (e) {
      console.error('Failed to parse tool call:', match[1], e)
    }
  }

  return messages
}
