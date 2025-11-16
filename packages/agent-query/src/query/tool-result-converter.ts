import type { ToolCall, ToolResult } from '../types'

/**
 * Internal tool result (with toolCallId)
 */
export type InternalToolResult = {
  toolCallId: string
  result?: unknown
  isError?: boolean
  error?: string
}

/**
 * Convert ToolResult to InternalToolResult
 * Handles: { result }, { error }, or thrown Error
 */
export function convertToolResult(call: ToolCall, userResult: ToolResult): InternalToolResult {
  if ('error' in userResult && userResult.error) {
    return {
      toolCallId: call.toolCallId,
      result: null,
      isError: true,
      error: userResult.error,
    }
  }

  return {
    toolCallId: call.toolCallId,
    result: userResult.result,
    isError: false,
  }
}

/**
 * Convert error to InternalToolResult
 */
export function convertError(call: ToolCall, error: unknown): InternalToolResult {
  return {
    toolCallId: call.toolCallId,
    result: null,
    isError: true,
    error: error instanceof Error ? error.message : String(error),
  }
}
