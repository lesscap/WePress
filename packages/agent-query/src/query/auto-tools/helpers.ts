import type { AgentMessage } from '../../types'
import { getTodoList } from '../../utils/todo-tools'

/**
 * Serialize TODO state for comparison (status array only)
 */
export function serializeTodoState(sessionId: string): string {
  const todoList = getTodoList(sessionId)
  if (!todoList) return ''
  return JSON.stringify(todoList.items.map((item) => item.status))
}

/**
 * Extract final text from messages
 */
export function extractFinalText(messages: AgentMessage[]): string {
  let finalText = ''

  for (const msg of messages) {
    if (msg.type === 'text' && !msg.delta) {
      finalText = msg.content.text
    }
  }

  return finalText
}

/**
 * Check if messages contain errors
 */
export function checkHasError(messages: AgentMessage[]): boolean {
  return messages.some((msg) => {
    if (msg.type === 'text' && msg.content.status === 'ERROR') {
      return true
    }
    if (msg.type === 'error') {
      return true
    }
    return false
  })
}
