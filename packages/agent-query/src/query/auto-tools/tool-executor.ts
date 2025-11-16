import type { QueryOptions, ToolCall } from '../../types'
import { addTodoItem, createTodoList, updateTodoItem } from '../../utils/todo-tools'
import { convertError, convertToolResult, type InternalToolResult } from '../tool-result-converter'

/**
 * Execute tool calls and return results
 * Handles both TODO tools and user-defined tools
 */
export async function executeToolCalls(
  toolCalls: ToolCall[],
  sessionId: string,
  onToolCall: NonNullable<QueryOptions['onToolCall']>,
): Promise<InternalToolResult[]> {
  const results: InternalToolResult[] = []

  for (const call of toolCalls) {
    try {
      // Handle TODO tools internally
      if (call.name === 'todo_create') {
        const { tasks } = call.arguments as { tasks: string[] }
        createTodoList(sessionId, tasks)
        results.push({
          toolCallId: call.toolCallId,
          result: '$$silent',
          isError: false,
        })
        continue
      }

      if (call.name === 'todo_add') {
        const { text, index } = call.arguments as { text: string; index?: number }
        addTodoItem(sessionId, text, index)
        results.push({
          toolCallId: call.toolCallId,
          result: '$$silent',
          isError: false,
        })
        continue
      }

      if (call.name === 'todo_update') {
        const { index, status, result } = call.arguments as {
          index: number
          status: 'pending' | 'completed'
          result?: string
        }
        updateTodoItem(sessionId, index, status, result)
        results.push({
          toolCallId: call.toolCallId,
          result: '$$silent',
          isError: false,
        })
        continue
      }

      // Handle user-defined tools
      const userResult = await onToolCall(call)
      results.push(convertToolResult(call, userResult))
    } catch (error) {
      results.push(convertError(call, error))
    }
  }

  return results
}
