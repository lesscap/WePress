import type { AgentMessage, TodoList } from '@wepress/agent-query'
import type { EditorSelection, AgentParam } from './editor'

/**
 * Task Request - Waiting in queue
 */
export type TaskRequest = {
  id: string
  agentKey: string
  scope: EditorSelection
  params: Record<string, unknown>
  instruction?: string  // User's text instruction for LLM prompt
  createdAt: number
}

/**
 * Task - Running or completed
 */
export type Task = {
  id: string
  agentKey: string
  scope: EditorSelection
  params: Record<string, unknown>
  instruction?: string  // User's text instruction for LLM prompt

  // Agent query data
  messages: AgentMessage[]
  todoList?: TodoList

  // Timestamps
  startTime: number
  endTime?: number

  // Metadata
  usage?: {
    inputTokens: number
    outputTokens: number
    totalTokens: number
  }
}

/**
 * Task Status - Derived from messages
 */
export type TaskStatus = 'running' | 'completed' | 'failed' | 'aborted'

/**
 * Tool Call - Derived from TODO items (for UI display)
 */
export type ToolCall = {
  id: string
  displayName: string
  status: 'running' | 'completed' | 'failed'
}

/**
 * Agent Config
 */
export type AgentConfig = {
  key: string
  name: string
  icon: string
  description: string
  scope: 'article' | 'section' | 'text'
  params?: AgentParam[]
  placeholder?: string
  systemPrompt: string
}
