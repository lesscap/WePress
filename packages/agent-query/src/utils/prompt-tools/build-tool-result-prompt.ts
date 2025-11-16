import type { InternalToolResult } from '../../query/tool-result-converter'
import { getTodoList, formatTodoListForPrompt } from '../todo-tools'

const MAX_RESULT_SIZE = 20000
const MAX_ARRAY_ITEMS = 3
const MAX_STRING_LENGTH = 500

type CompressOptions = {
  maxArrayItems?: number
  maxStringLength?: number
}

/**
 * Smart compress tool result value
 * - Array: keep first N items + total count
 * - Object: keep structure and compress fields recursively
 * - String: truncate + length info
 * - Other: return as is
 */
function compressToolResult(value: unknown, options: CompressOptions = {}): unknown {
  const maxArrayItems = options.maxArrayItems ?? MAX_ARRAY_ITEMS
  const maxStringLength = options.maxStringLength ?? MAX_STRING_LENGTH

  if (value === null || value === undefined) {
    return value
  }

  const type = typeof value

  // String: truncate if too long
  if (type === 'string') {
    const str = value as string
    if (str.length > maxStringLength) {
      return `${str.slice(0, maxStringLength)}... [Truncated, total length: ${str.length}]`
    }
    return str
  }

  // Number, boolean: return as is
  if (type === 'number' || type === 'boolean') {
    return value
  }

  // Array: keep first few items + total count
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return []
    }
    if (value.length <= maxArrayItems) {
      return value.map((item) => compressToolResult(item, options))
    }
    const compressed = value.slice(0, maxArrayItems).map((item) => compressToolResult(item, options))
    return [...compressed, `... [Omitted ${value.length - maxArrayItems} items, total ${value.length} items]`]
  }

  // Object: recursively compress fields
  if (type === 'object') {
    const obj = value as Record<string, unknown>
    const compressed: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(obj)) {
      compressed[key] = compressToolResult(val, options)
    }
    return compressed
  }

  return value
}

/**
 * Serialize tool result, compress if too large
 */
function serializeToolResult(result: unknown, maxSize = MAX_RESULT_SIZE, compressOpts?: CompressOptions): string {
  const serialized = JSON.stringify(result, null, 2)

  if (serialized.length <= maxSize) {
    return serialized
  }

  const compressed = compressToolResult(result, compressOpts)
  return JSON.stringify(compressed, null, 2)
}

export type BuildToolResultPromptOptions = {
  maxResultSize?: number
  maxArrayItems?: number
  maxStringLength?: number
  sessionId?: string
  enableTodo?: boolean
}

/**
 * Build tool result prompt for LLM continuation
 */
export function buildToolResultPrompt(results: InternalToolResult[], options?: BuildToolResultPromptOptions): string {
  if (results.length === 0) {
    return ''
  }

  const maxResultSize = options?.maxResultSize
  const compressOpts: CompressOptions = {
    maxArrayItems: options?.maxArrayItems,
    maxStringLength: options?.maxStringLength,
  }

  const resultDocs = results
    .filter((result) => result.result !== '$$silent')
    .map((result) => {
      if (result.isError) {
        return `<tool_result>
{
  "toolCallId": "${result.toolCallId}",
  "error": ${JSON.stringify(result.error)}
}
</tool_result>`
      }

      return `<tool_result>
{
  "toolCallId": "${result.toolCallId}",
  "result": ${serializeToolResult(result.result, maxResultSize, compressOpts)}
}
</tool_result>`
    })
    .join('\n\n')

  const parts: string[] = []

  if (resultDocs) {
    parts.push('Tool execution results - read carefully and extract key information:')
    parts.push('')
    parts.push(resultDocs)
    parts.push('')
    parts.push('Continue processing based on the actual tool results above. Do not fabricate or assume.')
  }

  // Include TODO list if enabled
  if (options?.sessionId && options?.enableTodo) {
    const todoList = getTodoList(options.sessionId)
    if (todoList && todoList.items.length > 0) {
      parts.push('')
      parts.push('---')
      parts.push('')
      parts.push(formatTodoListForPrompt(todoList))
      parts.push('')

      const allCompleted = todoList.items.every((item) => item.status === 'completed')

      if (allCompleted) {
        parts.push('✅ All tasks completed! Summarize the results and provide a clear, complete answer.')
      } else {
        parts.push('Process tasks one by one. Call todo_update to mark as completed and record results.')
      }
    }
  }

  return parts.join('\n').trim()
}
