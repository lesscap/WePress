import type { Task, TaskRequest, TaskStatus, ToolCall, AgentConfig } from '@/types/task'
import { agentConfigs } from '@/config/agents'

/**
 * Get agent configuration (works for both Task and TaskRequest)
 */
export function getAgentConfig(item: Task | TaskRequest): AgentConfig {
  const config = agentConfigs[item.agentKey]
  if (!config) {
    console.warn(`Agent config not found: ${item.agentKey}`)
    return {
      key: item.agentKey,
      name: item.agentKey,
      icon: '❓',
      description: 'Unknown agent',
      scope: 'article',
      systemPrompt: '',
    }
  }
  return config
}

/**
 * Get task status from messages
 */
export function getStatus(task: Task): TaskStatus {
  if (!task.endTime) {
    const hasAbort = task.messages.some((m) => m.type === 'abort')
    return hasAbort ? 'aborted' : 'running'
  }

  const hasError = task.messages.some((m) => m.type === 'error')
  return hasError ? 'failed' : 'completed'
}

/**
 * Get streaming output (accumulated text deltas)
 */
export function getStreamingOutput(task: Task): string {
  return task.messages
    .filter((m): m is Extract<typeof m, { type: 'text' }> => m.type === 'text' && m.delta)
    .map((m) => m.content.text)
    .join('')
}

/**
 * Get final text output
 */
export function getFinalText(task: Task): string | undefined {
  const finalMsg = task.messages
    .filter((m): m is Extract<typeof m, { type: 'text' }> => m.type === 'text' && !m.delta)
    .pop()
  return finalMsg?.content.text
}

/**
 * Get task duration in milliseconds
 */
export function getDuration(task: Task): number | undefined {
  return task.endTime ? task.endTime - task.startTime : undefined
}

/**
 * Get human-readable timestamp
 */
export function getTimestamp(task: Task): string {
  const now = Date.now()
  const elapsed = now - task.startTime

  if (elapsed < 60000) return '刚刚'
  if (elapsed < 3600000) return `${Math.floor(elapsed / 60000)}分钟前`
  if (elapsed < 86400000) return `${Math.floor(elapsed / 3600000)}小时前`
  return `${Math.floor(elapsed / 86400000)}天前`
}

/**
 * Get scope display text (works for both Task and TaskRequest)
 */
export function getScopeDisplay(item: Task | TaskRequest): string {
  const { scope } = item
  if (scope.type === 'none') return '全文'
  if (scope.type === 'section') return `第${scope.sectionIndex + 1}段：${scope.sectionTitle}`
  if (scope.type === 'text') return '选中文本'
  return '未知'
}

/**
 * Get tool calls from TODO list (for UI display)
 */
export function getToolCalls(task: Task): ToolCall[] {
  if (!task.todoList) return []

  return task.todoList.items.map((item, i) => ({
    id: `todo-${i}`,
    displayName: item.content,
    status: item.status === 'completed' ? 'completed' : 'running',
  }))
}
